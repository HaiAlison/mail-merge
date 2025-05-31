import React, { useCallback, useEffect, useState } from 'react';
import Home from "./Home";
import { getSentList } from "../api/mailApi";
import InfiniteScroll from "react-infinite-scroll-component";
import { Divider, List, Modal, notification, Skeleton, Typography, } from "antd";
import CreateRecipientButton from "../components/Recipients/CreateRecipientButton";
import ScrollableList from "../components/ScrollableList";
import { DEFAULT_LIMIT } from "../utils/constant";

const { Text } = Typography;


const Inbox = () => {
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const fetchData = useCallback(() => {
    if (loading) return;
    setLoading(true);
    getSentList(DEFAULT_LIMIT, offset).then((data) => {
      setItems([...items, ...data.results]);
      setLoading(false);
      setTotalItems(data.totalItems);
    }).catch((err) => {
      notification.error({
        message: 'Lỗi',
        description: 'Không thể tải danh sách đã gửi'
      })
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);
  const handleEmailClick = (email) => {
    setSelectedEmail(email);
    setModalVisible(true);
  };
  const handleModalClose = () => {
    setSelectedEmail(null);
    setModalVisible(false);
  }
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  return (<Home>
    <ScrollableList
      children={<InfiniteScroll
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
            <List.Item key={item.email}
                       onClick={() => handleEmailClick(item)}
                       style={{cursor: 'pointer'}}
            >
              <List.Item.Meta
                title={<span>{item.subject}</span>}
                description={<p>Danh sách đã gửi
                  đến: {item.recipients.join(', ').length > 50 ? item.recipients.join(', ').slice(0, 50) + '...' : item.recipients.join(', ')}</p>} />
            </List.Item>
          )}
        />
      </InfiniteScroll>}
    />
    <Modal
      title={selectedEmail?.subject}
      open={modalVisible}
      onCancel={handleModalClose}
      footer={null}
      width={800}
    >
      {selectedEmail && (
        <div>
          <div style={{marginBottom: 16}}>
            <Text strong>To: </Text>
            <Text>{selectedEmail.recipients.join(', ')}</Text>
          </div>

          <div style={{marginBottom: 16}}>
            <Text strong>Date: </Text>
            <Text>{new Date(selectedEmail.send_time).toLocaleString('fr-FR')}</Text>
          </div>

          <Divider />

          <div
            className="email-body"
            dangerouslySetInnerHTML={{__html: selectedEmail.body || selectedEmail.content}}
          />
        </div>
      )}
    </Modal>
  </Home>);
};

export default Inbox;