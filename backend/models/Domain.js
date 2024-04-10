class Domain {
  constructor(data) {
    this.id = data.Id || '';
    this.name = data.Name || '';
    this.resourceRecordSetCount = data.ResourceRecordSetCount || 0;
    this.dnsRecords = [];
  }
}

class DnsRecord {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

module.exports = { Domain, DnsRecord };
