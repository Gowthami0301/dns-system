const aws = require('aws-sdk');
const { Domain, DnsRecord } = require('../models/Domain');
require('dotenv').config();

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});
const route53 = new aws.Route53();
exports.getAllDomains = async (req, res) => {
  try {
    const data = await route53.listHostedZones().promise();
    const domains = data.HostedZones.map((zone) => new Domain(zone));
    // Fetch DNS records for each domain
    for (const domain of domains) {
      const recordParams = {
        HostedZoneId: domain.id,
      };
      const recordsData = await route53.listResourceRecordSets(recordParams).promise();
      domain.dnsRecords = recordsData.ResourceRecordSets.map((record) => {
        const type = record.Type || '';
        const value = record.ResourceRecords ? record.ResourceRecords.map((r) => r.Value).join(', ') : '';
        return new DnsRecord(type, value);
      });
    }
    res.json(domains);
  } catch (error) {
    console.error('Error fetching domains:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
exports.createDomain = async (req, res) => {
  const { domainName, dnsRecords } = req.body;
  const params = {
    Name: domainName,
    CallerReference: `${Date.now()}`,
  };
  try {
    const data = await route53.createHostedZone(params).promise();
    const newDomain = new Domain(data.HostedZone);
    // Add DNS records to the domain
    if (dnsRecords && dnsRecords.length > 0) {
      for (const record of dnsRecords) {
        const recordParams = {
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
exports.deleteDomain = async (req, res) => {
  const { domainId } = req.params;
  const params = {
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



exports.updateDomain = async (req, res) => {
    const { domainId } = req.params;
    const { newName, newDnsRecords } = req.body;
  
    // Validate that newDnsRecords is an array
    if (!Array.isArray(newDnsRecords)) {
      res.status(400).json({ error: 'Invalid DNS records format' });
      return;
    }
  
    // Ensure at least one NS record is provided for the zone
    const hasNSRecord = newDnsRecords.some(record => record.type === 'NS');
    if (!hasNSRecord) {
      res.status(400).json({ error: 'At least one NS record must be provided for the zone' });
      return;
    }
  
    // Remove spaces from NS record values
    newDnsRecords.forEach(record => {
      if (record.type === 'NS' && record.value.includes(' ')) {
        record.value = record.value.replace(/\s/g, '');
      }
    });
  
    const params = {
      Id: "/hostedzone/"+domainId,
      Comment: newName,
    };
  
    try {
      const data = await route53.updateHostedZoneComment(params).promise();
  
      // Update DNS records if new records are provided
      if (newDnsRecords.length > 0) {
        const recordParams = {
          HostedZoneId: "/hostedzone/"+domainId,
          ChangeBatch: {
            Changes: newDnsRecords.map(record => ({
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
  
