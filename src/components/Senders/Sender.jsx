import React, { useCallback, useEffect, useRef, useState } from 'react';
import Home from "../../pages/Home";
import InfiniteScroll from "react-infinite-scroll-component";
import { Avatar, Divider, Form, Input, List, Modal, notification, Skeleton } from "antd";
import CreateButton from "./CreateButton";
import { createSender, getSenders } from "../../api/mailApi";
import isha from "../../utils/images/isha.jpg";
import DeleteButton from "./DeleteButton";
import { DEFAULT_LIMIT } from "../../utils/constant";

const Sender = () => {
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [offset, setOffset] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const fetchData = useCallback(() => {
    if (loading) return;
    setLoading(true);
    getSenders(DEFAULT_LIMIT, offset).then((data) => {
      setItems([...items, ...data.results]);
      setLoading(false);
      setTotalItems(data.totalItems);
    }).catch((err) => {
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);
  const handleModalOk = () => {
    form.validateFields().then(values => {
      createSender(values).then(() => {
        setModalVisible(false);
        setLoading(false);
        fetchData();
        notification.success({
          message: 'Thành công',
          description: 'Người gửi đã được tạo thành công.',
        })
        form.resetFields();
        editorRef?.current?.editor?.setContents('')
      }).catch((err) => {
        notification.error({
          message: 'Lỗi',
          description: err.response.data.message,
        });
      })
    }).catch((err) => {
      console.error(err);
      notification.error({
        message: 'Lỗi',
        description: 'Vui lòng điền đầy đủ thông tin.',
      });
    })
  }
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (
    <Home>
      <div
        id="scrollableDiv"
        style={{
          marginRight: 'auto',
          height: 400,
          overflow: 'auto',
          padding: '0 16px',
          border: '1px solid rgba(140, 140, 140, 0.35)',
        }}
      >
        <InfiniteScroll
          dataLength={items.length}
          next={() => {
            setOffset((prevState) => prevState + 1);
          }}
          hasMore={items.length < totalItems}
          loader={<Skeleton avatar paragraph={{rows: 1}} active />}
          endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
          scrollableTarget="scrollableDiv"
        >
          <List
            dataSource={[...new Set(items)]}
            renderItem={(item) => (
              <List.Item key={item.email}>
                <List.Item.Meta
                  avatar={<Avatar src={isha} size={"large"} />}
                  title={<span>{item.first_name} {item.last_name}</span>}
                  description={item.email}
                />
                <DeleteButton id={item.id} fetchData={fetchData} />
              </List.Item>
            )}
          />
        </InfiniteScroll>
      </div>
      <CreateButton onClick={() => setModalVisible(true)} />
      <Modal
        title="Create Sender"
        placement="right"
        onClose={() => setModalVisible(false)}
        visible={modalVisible}
        onOk={() => handleModalOk()}
        onCancel={() => setModalVisible(false)}
      >
        <Form layout="vertical" form={form} name="createSender">
          <Form.Item label="First Name" name="first_name">
            <Input />
          </Form.Item>
          <Form.Item label="Last Name" name="last_name">
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{required: true, message: "Vui lòng nhập Email"}]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Home>
  );
};

export default Sender;