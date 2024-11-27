import React, { useCallback, useEffect, useState } from 'react';
import Home from "../../pages/Home";
import InfiniteScroll from "react-infinite-scroll-component";
import { Avatar, Divider, List, Skeleton } from "antd";
import { getSenders } from "../../api/mailApi";
import isha from "../../utils/images/isha.jpg";
import DeleteButton from "./DeleteButton";
import { DEFAULT_LIMIT } from "../../utils/constant";
import ScrollableList from "../ScrollableList";
import CreateSenderButton from "./CreateSenderButton";

const Sender = () => {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
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
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Home>
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
        button={<CreateSenderButton fetchData={fetchData} isFloatButton={true} />}
      />
    </Home>
  )
};

export default Sender;