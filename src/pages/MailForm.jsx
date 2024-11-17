import React from 'react';
import { Form, Input, Button } from 'antd';
import Home from "./Home";
import MailEditor from "./MailEditor";

const MailForm = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log('Gửi dữ liệu:', values);
    // Gửi yêu cầu email của bạn tại đây, ví dụ với axios hoặc fetch
  };

  return (
    <Home>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="to"
          label="Đến"
          rules={[{required: true, message: 'Vui lòng nhập email người nhận!'}]}
        >
          <Input placeholder="Email người nhận"/>
        </Form.Item>

        <Form.Item
          name="subject"
          label="Chủ đề"
          rules={[{required: true, message: 'Vui lòng nhập chủ đề!'}]}
        >
          <Input placeholder="Chủ đề email"/>
        </Form.Item>

        <Form.Item
          name="body"
          label="Nội dung"
          rules={[{required: true, message: 'Vui lòng nhập nội dung!'}]}
        >

          <MailEditor/>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Gửi
          </Button>
        </Form.Item>
      </Form>
    </Home>
  );
};

export default MailForm;