import React from 'react';
import { Modal } from 'antd';
import DomainForm from '../Form/DomainForm';

const DomainModal = ({ visible, onCancel, onSubmit }) => {
  return (
    <Modal
      title="Add Domain"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <DomainForm onSubmit={onSubmit} />
    </Modal>
  );
};

export default DomainModal;
