import React from 'react';
import { Typography, Form, Button } from 'antd';

const {Title} = Typography;

const Login = () => {
  return (<div style={{maxWidth: 400, margin: '100px auto', textAlign: 'center'}}>
    <Title level={2}>Đăng nhập</Title>
    <Form layout="vertical">
      <Form.Item>
        <Button
          style={{marginTop: 100}}
          type="primary"
          title={"Đăng nhập bằng Google"}
          size={"large"}
          onClick={() => {
            window.location.href = `${process.env.REACT_APP_API_URL}/auth/google`;
          }}
        > Đăng nhập bằng Google
        </Button>
      </Form.Item>
    </Form>
  </div>);
};

export default Login;