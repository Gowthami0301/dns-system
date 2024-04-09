import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';

const { Option } = Select;

const DomainForm = ({ onSubmit }) => {
  const [domainName, setDomainName] = useState('');
  const [dnsRecords, setDnsRecords] = useState([{ type: '', value: '' }]);

  const handleAddRecord = () => {
    setDnsRecords([...dnsRecords, { type: '', value: '' }]);
  };

  const handleRemoveRecord = (index) => {
    const updatedRecords = dnsRecords.filter((_, i) => i !== index);
    setDnsRecords(updatedRecords);
  };

  const handleSubmit = () => {
    onSubmit({ domainName, dnsRecords });
    setDomainName('');
    setDnsRecords([{ type: '', value: '' }]);
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item label="Domain Name" name="domainName" rules={[{ required: true }]}>
        <Input value={domainName} onChange={(e) => setDomainName(e.target.value)} />
      </Form.Item>
      {dnsRecords.map((record, index) => (
        <div key={index} style={{ display: 'flex', marginBottom: 16 }}>
          <Form.Item style={{ marginRight: 8 }}>
            <Select
              value={record.type}
              onChange={(value) => {
                const updatedRecords = [...dnsRecords];
                updatedRecords[index].type = value;
                setDnsRecords(updatedRecords);
              }}
              style={{ width: 120 }}
              placeholder="Select Type"
            >
              <Option value="A">A</Option>
              <Option value="CNAME">CNAME</Option>
              {/* Add other record types as needed */}
            </Select>
          </Form.Item>
          <Form.Item style={{ marginRight: 8 }}>
            <Input
              value={record.value}
              onChange={(e) => {
                const updatedRecords = [...dnsRecords];
                updatedRecords[index].value = e.target.value;
                setDnsRecords(updatedRecords);
              }}
              placeholder="Value"
            />
          </Form.Item>
          <Button onClick={() => handleRemoveRecord(index)}>Remove</Button>
        </div>
      ))}
      <Button type="dashed" onClick={handleAddRecord} style={{ width: '100%' }}>
        Add DNS Record
      </Button>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginTop: 16 }}>
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DomainForm;
