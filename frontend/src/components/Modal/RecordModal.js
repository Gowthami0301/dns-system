import React from 'react';
import { Modal } from 'antd';
import RecordForm from '../Form/RecordForm';

const RecordModal = ({ visible, onCancel, onSubmit }) => {
  return (
    <Modal
      title="Add Record"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <RecordForm onSubmit={onSubmit} />
    </Modal>
  );
};

export default RecordModal;
