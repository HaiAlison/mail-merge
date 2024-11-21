import React from 'react';
import { FloatButton } from 'antd';
import { UserOutlined } from '@ant-design/icons';

const Logout = () => {
  const removeToken = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  }
  return (
    <div>
      <FloatButton type="primary" title={"Đăng xuất"} size={"large"} icon={<UserOutlined />}
                   style={{top: '10px'}} onClick={() => removeToken()} />
    </div>
  );
};

export default Logout;