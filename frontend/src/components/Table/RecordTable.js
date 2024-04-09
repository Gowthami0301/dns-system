// components/Table/RecordTable.js
import React from 'react';
import { Table } from 'antd';

const RecordTable = ({ records }) => {
  const columns = [
    {
      title: 'Record Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
    // Add more columns as needed
  ];

  return <Table dataSource={records} columns={columns} />;
};

export default RecordTable;
