import { Button, Form, Input, Modal, notification } from "antd";
import '../../styles/Common.css'
import React, { useRef, useState } from "react";
import { createSender } from "../../api/mailApi";

function CreateSenderButton({fetchData}) {
  const [modalVisible, setModalVisible] = useState(false);
  const editorRef = useRef(null);
  const [form] = Form.useForm();
  const clearForm = () => {
    form.resetFields();
    editorRef?.current?.editor?.setContents('')
  }
  const handleModalOk = () => {
    form.validateFields().then(values => {
      createSender(values).then(() => {
        setModalVisible(false);
        notification.success({
          message: 'Thành công', description: 'Người gửi đã được tạo thành công.',
        })
        fetchData();
      }).catch((err) => {
        notification.error({
          message: 'Lỗi', description: err.response.data.message,
        });
      })
    }).catch((err) => {
      console.error(err);
      notification.error({
        message: 'Lỗi', description: 'Vui lòng điền đầy đủ thông tin.',
      });
    })
  }

  return (
    <div>
      <Modal
        title="Tạo người gửi"
        placement="right"
        onClose={() => setModalVisible(false)}
        open={modalVisible}
        onOk={() => handleModalOk()}
        onCancel={() => {
          setModalVisible(false);
          clearForm();
        }}
      >
        <Form layout="vertical" form={form} name="createSender">
          <Form.Item label="Họ" name="last_name">
            <Input />
          </Form.Item>
          <Form.Item label="Tên" name="first_name">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{required: true, message: "Vui lòng nhập Email"}]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <Button type="primary" size={"large"}
              onClick={() => setModalVisible(true)}
      >Thêm mới</Button>
    </div>);
}

export default CreateSenderButton;