import React, { useState } from 'react';
import { Form, Input, Button, Select } from 'antd';

const { Option } = Select;

const RecordForm = ({ onSubmit }) => {
  const [recordType, setRecordType] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    onSubmit({ recordType, value });
    setRecordType('');
    setValue('');
  };

  return (
    <Form onFinish={handleSubmit}>
      <Form.Item label="Record Type" name="recordType" rules={[{ required: true }]}>
        <Select value={recordType} onChange={setRecordType}>
          <Option value="A">A</Option>
          <Option value="AAAA">AAAA</Option>
          <Option value="CNAME">CNAME</Option>
          {/* Add more options as needed */}
        </Select>
      </Form.Item>
      <Form.Item label="Value" name="value" rules={[{ required: true }]}>
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RecordForm;
