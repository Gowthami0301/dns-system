// controllers/domainsController.ts
import { Request, Response } from 'express';
import aws from 'aws-sdk';
import { Domain, DnsRecord } from '../models/Domain';

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const route53 = new aws.Route53();

export const getAllDomains = async (req: Request, res: Response): Promise<void> => {
  try {
    const data = await route53.listHostedZones().promise();
    const domains = data.HostedZones.map((zone: aws.Route53.HostedZone) => new Domain(zone));

    // Fetch DNS records for each domain
    for (const domain of domains) {
      const recordParams = {
        HostedZoneId: domain.id,
      };
      const recordsData = await route53.listResourceRecordSets(recordParams).promise();
      domain.dnsRecords = recordsData.ResourceRecordSets.map((record: aws.Route53.ResourceRecordSet) => {
        const type = record.Type || '';
        const value = record.ResourceRecords ? record.ResourceRecords.map((r: any) => r.Value).join(', ') : '';
        return new DnsRecord(type, value);
      });
    }

    res.json(domains);
  } catch (error) {
    console.error('Error fetching domains:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createDomain = async (req: Request, res: Response): Promise<void> => {
  const { domainName, dnsRecords } = req.body;
  
  const params: aws.Route53.CreateHostedZoneRequest = {
    Name: domainName,
    CallerReference: `${Date.now()}`,
  };

  try {
    const data = await route53.createHostedZone(params).promise();
    const newDomain = new Domain(data.HostedZone);
    
    // Add DNS records to the domain
    if (dnsRecords && dnsRecords.length > 0) {
      for (const record of dnsRecords) {
        const recordParams: aws.Route53.ChangeResourceRecordSetsRequest = {
          HostedZoneId: newDomain.id,
          ChangeBatch: {
            Changes: [{
              Action: 'UPSERT',
              ResourceRecordSet: {
                Name: domainName,
                Type: record.type,
                TTL: 300,
                ResourceRecords: [{ Value: record.value }],
              },
            }],
          },
        };
        await route53.changeResourceRecordSets(recordParams).promise();
        newDomain.dnsRecords.push(record);
      }
    }

    res.status(201).json(newDomain);
  } catch (error) {
    console.error('Error creating domain:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const deleteDomain = async (req: Request, res: Response): Promise<void> => {
  const { domainId } = req.params;

  const params: aws.Route53.DeleteHostedZoneRequest = {
    Id: domainId,
  };

  try {
    await route53.deleteHostedZone(params).promise();
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting domain:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const updateDomain = async (req: Request, res: Response): Promise<void> => {
  const { domainId } = req.params;
  const { newName, newDnsRecords } = req.body;

  const params: aws.Route53.UpdateHostedZoneCommentRequest = {
    Id: domainId,
    Comment: newName,
  };

  try {
    const data = await route53.updateHostedZoneComment(params).promise();

    // Update DNS records if new records are provided
    if (newDnsRecords && newDnsRecords.length > 0) {
      const recordParams: aws.Route53.ChangeResourceRecordSetsRequest = {
        HostedZoneId: domainId,
        ChangeBatch: {
          Changes: newDnsRecords.map((record: DnsRecord) => ({
            Action: 'UPSERT',
            ResourceRecordSet: {
              Name: newName,
              Type: record.type,
              TTL: 300,
              ResourceRecords: [{ Value: record.value }],
            },
          })),
        },
      };
      await route53.changeResourceRecordSets(recordParams).promise();
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error updating domain:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
