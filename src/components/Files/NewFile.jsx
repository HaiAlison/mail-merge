import React, { useState } from 'react';
import { Button, Flex, Form, Image, Input, Modal, notification, Space, Upload } from "antd";
import { DeleteOutlined, EditOutlined, InboxOutlined, } from "@ant-design/icons";
import CustomFloatButton from "../CustomFloatButton";
import CustomModal from "../CustomModal";
import { uploadImages } from "../../api/uploadAPI";

const {Dragger} = Upload;

const UploadFile = () => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");
  const handleUpload = () => {
    const formData = new FormData();
    fileList.forEach((file) => {
      console.log(file)
      formData.append("images", file?.originFileObj || file); // Add files to formData
    });
    setUploading(true);
    uploadImages(formData).then((res) => {
      setOpenModal(false);
      notification.success({message: 'Thành công', description: 'Tải lên tệp thành công'});
      setFileList([]);
    }).catch(e => {
      console.error('Error:', e);
      Modal.error({
        title: 'Lỗi', content: 'Đã xảy ra lỗi khi tải lên tệp'
      });
    }).finally(() => {
      setUploading(false);
      setValue("");
    });
  }
  const handleRename = (file, newName) => {
    console.log(fileList)
    const updatedFileList = fileList.map((item) => {
      if (item.uid === file.uid) {
        const renamedFile = new File([item.originFileObj || item], newName, {
          type: item.type, lastModified: item.lastModified,
        });
        return {...item, originFileObj: renamedFile, name: newName};

      }
      return item;
    });
    console.log(updatedFileList)
    setFileList(updatedFileList);
  };
  const deleteFile = (file) => {
    const index = fileList.indexOf(file);
    const newFileList = fileList.slice();
    newFileList.splice(index, 1);
    setFileList(newFileList);
    setUploading(false);
  }
  const props = {
    beforeUpload: (file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Convert file to base64
      reader.onload = () => {
        file.url = reader.result;
        setFileList([...fileList, file]);
      };
      return false;
    }, fileList: [], listType: "picture"
  };
  return (<>
    <CustomModal
      children={<>

        <Flex align={"center"} justify={"center"} vertical={true}>
          <Dragger {...props}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for a single or bulk upload. Strictly prohibited from uploading company data or other
              banned files.
            </p>
          </Dragger>
        </Flex>
        <Form>
          {fileList.length > 0 && (<Form.List label="Rename File" name='list'>
            {() => (<div style={{
              height: "200px", overflowY: "scroll", border: '1px solid rgba(140, 140, 140, 0.35)',
            }}>

              {fileList.map((field, index) => (<Form.Item
                name={[field.name, 'name']}
                key={index}
                // rules={[{required: true, message: 'Missing name'}]}
              >
                <Space>
                  <Image src={field.url} width={80} height={80} />
                  <div>
                    {isEditing ? (<Input
                      style={{width: "300px"}}
                      defaultValue={field.name}
                      value={value || field.name}
                      onBlur={() => setIsEditing(false)}
                      onChange={(e) => setValue(e.target.value)}
                      onPressEnter={() => {
                        handleRename(field, value);
                        setIsEditing(false);
                      }}
                    />) : (<div onClick={() => setIsEditing(true)}
                                style={{display: "flex", alignItems: "center"}}>
                      {field.name} <EditOutlined style={{marginLeft: 8, cursor: "pointer"}} />
                    </div>)}
                  </div>
                  <Button type="primary" size={"middle"}
                          onClick={() => {
                            deleteFile(field);
                          }}
                          disabled={uploading}
                          style={{backgroundColor: "#f5222d", borderColor: "#f5222d"}}
                          icon={<DeleteOutlined />}></Button>
                </Space>
              </Form.Item>))}
            </div>)}
          </Form.List>)}
        </Form>
      </>}
      title={"Upload File"}
      onOk={handleUpload}
      onClose={() => {
        setFileList([]);
        setOpenModal(false);
        setUploading(false)
      }}
      visible={openModal}
      okText={uploading ? "Uploading" : "Upload"}
      okButtonProps={{disabled: fileList.length === 0, loading: uploading}}
    />
    <CustomFloatButton
      onClick={() => setOpenModal(true)}
      loading={uploading}
    />
  </>);
};

export default UploadFile;