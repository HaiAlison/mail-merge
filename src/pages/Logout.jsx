import React from 'react';
import { Button } from 'antd';
import '../styles/Common.css';
import { LogoutOutlined } from '@ant-design/icons';

const Logout = () => {
  const removeToken = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
  return (
    <div>
      <Button className={"right-button"} type="primary" title={"Đăng xuất"} size={"large"}
              onClick={() => removeToken()}>
        <LogoutOutlined/>Đăng xuất
      </Button>
    </div>
  );
};

export default Logout;