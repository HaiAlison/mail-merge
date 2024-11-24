import React, { useState } from 'react';
import { Modal } from 'antd';

const Logout = () => {
  const removeToken = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
  const [open, setOpen] = useState(false);
  return (<div>
    <Modal
      title={"Đăng xuất"}
      onOk={() => removeToken()}
      onCancel={() => setOpen(false)}
      open={open}
    >
      <p>Bạn có chắc chắn muốn đăng xuất?</p>
    </Modal>
    <span
      style={{top: '10px'}} onClick={() => {
      setOpen(true)
    }}>Đăng xuất
      </span>
  </div>);
};

export default Logout;