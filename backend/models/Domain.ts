class Domain {
  id: string;
  name: string;
  resourceRecordSetCount: number;
  dnsRecords: DnsRecord[];

  constructor(data: AWS.Route53.HostedZone) {
    this.id = data.Id || '';
    this.name = data.Name || '';
    this.resourceRecordSetCount = data.ResourceRecordSetCount || 0;
    this.dnsRecords = [];
  }
}

class DnsRecord {
  type: string;
  value: string;

  constructor(type: string, value: string) {
    this.type = type;
    this.value = value;
  }
}

export { Domain, DnsRecord };
