import React, { useRef, useState } from 'react';
import { Form, Input, notification, Button } from 'antd';
import Home from "./Home";
import MailEditor from "../components/Mails/MailEditor";
import { sendMail } from "../api/mailApi";
import MultiSelectSender from "../components/Mails/MultiSelectSender";
import { useToken } from "../hooks/useToken";

const MailForm = () => {
  const [form] = Form.useForm();
  const editorRef = useRef(null);
  const tokenData = useToken();
  const onFinish = (values) => {
    try {
      const payload = {
        user_id: tokenData.id,
        to: values.to,
        subject: values.subject,
        text: values.body,
      };
      sendMail(payload).then(() => {
        notification.success({
          message: 'Thành công',
          description: 'Email đã được gửi thành công.',
        });
        form.resetFields();
        editorRef?.current?.editor?.setContents('');
        setLoading(false);
      }).catch((e) => {
        console.error(e);
        setLoading(false);
        notification.error({
          message: 'Lỗi',
          description: 'Có lỗi xảy ra khi gửi email.',
        });
      });
    } catch (e) {
      console.error(e);
      setLoading(false);
      notification.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi gửi email.',
      })
    }
  };
  const [loading, setLoading] = useState(false);


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
          <MultiSelectSender ref={editorRef} />
        </Form.Item>

        <Form.Item
          name="subject"
          label="Chủ đề"
          rules={[{required: true, message: 'Vui lòng nhập chủ đề!'}]}
        >
          <Input style={{width: "50%"}} placeholder="Chủ đề email" />
        </Form.Item>

        <Form.Item
          name="body"
          label="Nội dung"
          rules={[{required: true, message: 'Vui lòng nhập nội dung!'}]}
        >
          <MailEditor ref={editorRef} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" loading={loading} onClick={() => setLoading(true)}
                  htmlType="submit">Gửi
          </Button>
        </Form.Item>
      </Form>
    </Home>
  );
};

export default MailForm;