import CustomModal from "../CustomModal";
import { Flex, notification, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import React, { useEffect } from "react";
import { uploadImportRecipient } from "../../api/uploadAPI";

const {Dragger} = Upload;

const ImportRecipient = ({visible, onClose, onComplete}) => {
  const [file, setFile] = React.useState(null);
  const handleImportRecipient = (file) => {
    try {

      const formData = new FormData();
      formData.append("file", file.originFileObj || file);
      formData.append("type", "recipient");
      return uploadImportRecipient(formData).then(() => {
        if (onComplete) onComplete();
        notification.success({message: "Nhập danh sách người nhận thành công"});
        setFile(null);
        onClose();
      });
    }catch (e){
      console.error("Error importing recipient:", e);
      notification.error({message: "Lỗi khi nhập danh sách người nhận"});
    }
  }
  const draggerProps = {
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
    maxCount: 1,
    accept: ".xlsx, .xls",
    onRemove: () => {
      setFile(null);
    }
  }
  useEffect(() => {
    if (!visible) {
      setFile(null);
    }
  }, [visible]);
  return (
    <CustomModal
      children={
        <Flex align={"center"} justify={"center"} vertical={true}>
          <Dragger {...draggerProps}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from uploading company data or other
              banned files.
            </p>
          </Dragger>
        </Flex>}
      title="Import Recipient"
      okText="Import"
      visible={visible}
      onClose={onClose}
      onOk={() => handleImportRecipient(file)}
    />
  );
}

export default ImportRecipient;