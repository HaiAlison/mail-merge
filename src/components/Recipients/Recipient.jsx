import React, { useCallback, useEffect, useState } from 'react';
import Home from "../../pages/Home";
import InfiniteScroll from "react-infinite-scroll-component";
import { Avatar, Col, Divider, List, Row, Skeleton } from "antd";
import CreateRecipientButton from "./CreateRecipientButton";
import { getRecipients } from "../../api/mailApi";
import isha from "../../utils/images/isha.jpg";
import DeleteButton from "./DeleteButton";
import { DEFAULT_LIMIT } from "../../utils/constant";
import ScrollableList from "../ScrollableList";
import CustomButton from "../CustomButton";
import { ImportOutlined } from "@ant-design/icons";
import ImportRecipient from "./importRecipient";

const Recipient = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [importRecipientVisible, setImportRecipientVisible] = useState(false);
  const fetchData = useCallback(() => {
    if (loading) return;
    setLoading(true);
    getRecipients(DEFAULT_LIMIT, offset).then((data) => {
      setItems([...items, ...data.results]);
      setLoading(false);
      setTotalItems(data.totalItems);
    }).catch((err) => {
      setLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Home>
     <Row style={{marginBottom: "10px", marginRight: "10px"}}>
       <Col offset={22}>
         <CustomButton
           onClick={() => setImportRecipientVisible(true)}
           title="Nhập tệp"
           icon={<ImportOutlined  />}
         />
       </Col>
     </Row>
       <ImportRecipient visible={importRecipientVisible} onClose={() => setImportRecipientVisible(false)} />
      <ScrollableList
        children={
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
        }
        button={<CreateRecipientButton fetchData={fetchData} isFloatButton={true} />}
      />
    </Home>
  )
};

export default Recipient;