import { Modal } from "antd";
import React from "react";

function CustomModal({children, onClose, onOk, visible, title, okButtonProps, okText}) {
  return (
    <div>
      <Modal
        title={title}
        placement="right"
        onClose={onClose}
        open={visible}
        onOk={onOk}
        okText={okText}
        okButtonProps={okButtonProps}
        onCancel={onClose}
      >
        {children}
      </Modal>

    </div>);
}

export default CustomModal;