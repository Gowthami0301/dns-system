import React, { useState, useEffect } from 'react';
import { Layout, Button, Modal, Card } from 'antd';
import { getAllDomains, createDomain, deleteDomain, updateDomain } from '../../api';
import DomainTable from '../Table/DomainTable';
import DomainForm from '../Form/DomainForm';
import DomainChart from '../Charts/DomainChart';

const {Header, Footer,  Content } = Layout;

const Dashboard = () => {
  const [domains, setDomains] = useState([]);
  const [isDomainModalVisible, setIsDomainModalVisible] = useState(false);

  useEffect(() => {
    fetchDomains();
  }, []);

  const fetchDomains = async () => {
    try {
      const data = await getAllDomains();
      setDomains(data);
    } catch (error) {
      console.error('Failed to fetch domains:', error);
    }
  };

  const handleAddDomain = async (formData) => {
    try {
      // Extract domainName and dnsRecords from formData
      const { domainName, dnsRecords } = formData;
      await createDomain(domainName, dnsRecords);
      fetchDomains();
      setIsDomainModalVisible(false);
    } catch (error) {
      console.error('Failed to add domain:', error);
    }
  };

  const handleDeleteDomain = async (domainId) => {
    try {
      await deleteDomain(domainId);
      fetchDomains();
    } catch (error) {
      console.error('Failed to delete domain:', error);
    }
  };

  const handleUpdateDomain = async (domainId, newName, newDnsRecords) => {
    try {
      await updateDomain(domainId, newName, newDnsRecords);
      fetchDomains();
    } catch (error) {
      console.error('Failed to update domain:', error);
    }
  };

  return (
    <Layout>
        <Header style={{ color: 'white', textAlign: 'center', fontSize: '24px' }}>
        Welcome to Domain Management Portal
      </Header>
      <Content>
      <Card
          title="Domain List"
          extra={
            <Button onClick={() => setIsDomainModalVisible(true)} type="primary">
              Add Domain
            </Button>
          }
          style={{ marginTop: 16 }}
        >
          <DomainTable
            domains={domains}
            onDelete={handleDeleteDomain}
            onUpdate={handleUpdateDomain}
          />
        </Card>

        <Modal
          title="Add Domain"
          visible={isDomainModalVisible}
          onCancel={() => setIsDomainModalVisible(false)}
          footer={null}
        >
          <DomainForm onSubmit={handleAddDomain} />
        </Modal>
     

        <Card title="Domain Chart" style={{ marginTop: 16 }}>
          <DomainChart domains={domains} />
        </Card>
      </Content>
      <Footer style={{ textAlign: 'center' }}>@Domain Management Portal</Footer>

    </Layout>
  );
};

export default Dashboard;
