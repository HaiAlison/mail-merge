import { Form, Input, notification } from "antd";
import '../../styles/Common.css'
import React, { useRef, useState } from "react";
import { createSender } from "../../api/mailApi";
import CustomModal from "../CustomModal";
import CustomButton from "../CustomButton";
import CustomFloatButton from "../CustomFloatButton";

function CreateSenderButton({fetchData, isFloatButton}) {
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
      <CustomModal
        title="Tạo người gửi"
        onClose={() => setModalVisible(false)}
        visible={modalVisible}
        onOk={() => handleModalOk()}
        onCancel={() => {
          setModalVisible(false);
          clearForm();
        }}
        children={
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
          </Form>}
      />
      {isFloatButton ? <CustomFloatButton onClick={() => setModalVisible(true)} title={"Tạo người gửi"} /> :
        <CustomButton onClick={() => setModalVisible(true)} title={"Tạo người gửi"} />}
    </div>
  );
}

export default CreateSenderButton;