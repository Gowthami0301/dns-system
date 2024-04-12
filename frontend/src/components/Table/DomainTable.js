// DomainTable component
import React from 'react';
import {Select, Table, Button, Modal, Form, Input, Space } from 'antd';
const { Option } = Select;

const DomainTable = ({ domains, onDelete, onUpdate }) => {
  const [form] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = React.useState(false);
  const [selectedDomain, setSelectedDomain] = React.useState(null);

  const handleUpdateClick = (record) => {
    setSelectedDomain(record);
    setIsModalVisible(true);
    form.setFieldsValue({ newName: record.name, newDnsRecords: record.dnsRecords });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const { newName, newDnsRecords } = values;
      onUpdate(selectedDomain.id, newName, newDnsRecords);
      setIsModalVisible(false);
    });
  };

  const columns = [
    {
      title: 'Domain Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Resource Record Set Count',
      dataIndex: 'resourceRecordSetCount',
      key: 'resourceRecordSetCount',
    },
    {
      title: 'DNS Records',
      dataIndex: 'dnsRecords',
      key: 'dnsRecords',
      render: (dnsRecords) => (
        <ul>
          {dnsRecords.map((record, index) => (
            <li key={index}>{`${record.type}: ${record.value}`}</li>
          ))}
        </ul>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => handleUpdateClick(record)}>Update</Button>
          <Button onClick={() => onDelete(record.id)}>Delete</Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
   
      <Table dataSource={domains} columns={columns} />

      <Modal title="Update Domain" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Form form={form} layout="vertical" name="updateDomainForm">
          <Form.Item
            name="newName"
            label="New Domain Name"
            rules={[{ required: true, message: 'Please enter the new domain name' }]}
          >
            <Input />
          </Form.Item>
          <Form.List name="newDnsRecords">
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => (
                  <Space key={field.key} style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                    <Form.Item
                      {...field}
                      label={`Record ${index + 1}`}
                      name={[field.name, 'type']}
                      fieldKey={[field.fieldKey, 'type']}
                      rules={[{ required: true, message: 'Please enter the record type' }]}
                    >
                     
                     <Select
                        style={{ width: 120 }}
                        placeholder="Select Type"
                        onChange={(value) => {
                          const updatedRecords = [...form.getFieldValue('newDnsRecords')];
                          updatedRecords[index].type = value;
                          form.setFieldsValue({ newDnsRecords: updatedRecords });
                        }}
                      >
                        <Option value="A">A</Option>
                        <Option value="AAAA">AAAA</Option>
                        <Option value="CNAME">CNAME</Option>
                        <Option value="MX">MX</Option>
                        <Option value="NS">NS</Option>
                        <Option value="PTR">PTR</Option>
                        <Option value="SOA">SOA</Option>
                        <Option value="SRV">SRV</Option>
                        <Option value="TXT">TXT</Option>
                        <Option value="DNSSEC">DNSSEC</Option>
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...field}
                      name={[field.name, 'value']}
                      fieldKey={[field.fieldKey, 'value']}
                      rules={[{ required: true, message: 'Please enter the record value' }]}
                    >
                      <Input placeholder="Value" />
                    </Form.Item>
                    <Button onClick={() => remove(field.name)}>-</Button>
                  </Space>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()} block>
                    Add Record
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>
        </Form>
      </Modal>
    </div>
  );
};

export default DomainTable;
