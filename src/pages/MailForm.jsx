import React, { useRef, useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import Home from "./Home";
import MailEditor from "./MailEditor";
import { sendMail } from "../api/mailApi";

const MailForm = () => {
  const [form] = Form.useForm();
  const editorRef = useRef(null);

  const onFinish = (values) => {
    try {
      const payload = {
        user_id: '7c29d409-c134-44fb-b171-4d942006979a',
        to: values.to,
        subject: values.subject,
        text: values.body,
      };
      console.log(payload)
      sendMail(payload).then(() => {
        notification.success({
          message: 'Thành công',
          description: 'Email đã được gửi thành công.',
        });
        form.resetFields();
        editorRef?.current?.editor?.setContents('');
      });
    } catch (e) {
      console.error(e);
      notification.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi gửi email.',
      })
    }
  };
  const [loadings, setLoadings] = useState([]);
  const enterLoading = (index) => {
    setLoadings((prevLoadings) => {
      const newLoadings = [...prevLoadings];
      newLoadings[index] = true;
      return newLoadings;
    });

    setTimeout(() => {
      setLoadings((prevLoadings) => {
        const newLoadings = [...prevLoadings];
        newLoadings[index] = false;
        return newLoadings;
      });
    }, 1000);
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
          <MailEditor ref={editorRef}/>
        </Form.Item>
        <Form.Item>
          <Button type="primary" loading={loadings[1]} onClick={() => enterLoading(1)} htmlType="submit">
            Gửi
          </Button>
        </Form.Item>
      </Form>
    </Home>
  );
};

export default MailForm;