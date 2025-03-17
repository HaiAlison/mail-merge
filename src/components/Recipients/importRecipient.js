import CustomModal from "../CustomModal";
import { Flex, Upload } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import React from "react";
import { uploadImportRecipient } from "../../api/uploadAPI";

const {Dragger} = Upload;

const ImportRecipient = ({visible, onClose}) => {
  const [file, setFile] = React.useState(null);
  const handleImportRecipient = (file) => {
    const formData = new FormData();
    formData.append("file", file.originFileObj || file);
    return uploadImportRecipient(formData).then(() => {
      onClose();
    });
  }
  const draggerProps = {
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
    maxCount: 1,
    accept: ".xlsx, .xls",
  }
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