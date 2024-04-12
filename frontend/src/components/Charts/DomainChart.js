import React from 'react';
import { PieChart, Pie, Legend, Tooltip, Cell } from 'recharts';
import { Card } from 'antd';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF1919']; // You can add more colors as needed

const formatDataForChart = (domains) => {
  const recordCounts = domains.reduce((acc, domain) => {
    domain.dnsRecords.forEach((record) => {
      acc[record.type] = (acc[record.type] || 0) + 1;
    });
    return acc;
  }, {});

  return Object.entries(recordCounts).map(([type, count], index) => ({
    name: type,
    value: count,
    fill: COLORS[index % COLORS.length] // Assign color from COLORS array
  }));
};

const DomainChart = ({ domains }) => {
  const data = formatDataForChart(domains);
  return (
    <PieChart width={300} height={300}>
      <Pie
        dataKey="value"
        isAnimationActive={false}
        data={data}
        cx={150}
        cy={150}
        outerRadius={60}
        fill="#8884d8"
        label
      >
        {data.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={entry.fill} />
        ))}
      </Pie>
      <Tooltip />
      <Legend />
    </PieChart>
  );
};

const DomainCharts = ({ domains }) => {
  // Chunk domains array into groups of three
  const chunkedDomains = domains.reduce((acc, curr, index) => {
    const chunkIndex = Math.floor(index / 3);
    if (!acc[chunkIndex]) {
      acc[chunkIndex] = []; // start a new chunk
    }
    acc[chunkIndex].push(curr);
    return acc;
  }, []);

  return (
    <div>
      {chunkedDomains.map((chunk, chunkIndex) => (
        <div key={chunkIndex} style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '20px' }}>
          {chunk.map((domain, index) => (
            <Card title={domain.name} key={index} style={{ width: 400 }}>
              <DomainChart domains={[domain]} />
            </Card>
          ))}      
          {[...Array(3 - chunk.length)].map((_, index) => (
            <Card key={chunk.length + index} style={{ visibility: 'hidden', width: 400 }} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default DomainCharts;
