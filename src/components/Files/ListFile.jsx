import Home from "../../pages/Home";
import { Card, Divider, Image, List, notification, Skeleton } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { getImages } from "../../api/uploadAPI";
import ScrollableList from "../ScrollableList";
import UploadFile from "./NewFile";
import { DEFAULT_LIMIT } from "../../utils/constant";
import InfiniteScroll from "react-infinite-scroll-component";

const {Meta} = Card;
const ListFile = () => {
  const [items, setItems] = useState([]);
  const [offset, setOffset] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const fetchFiles = useCallback(() => {
    getImages(DEFAULT_LIMIT, offset).then((data) => {
      setItems([...items, ...data.results]);
      setTotalItems(data.totalItems);
    }).catch((err) => {
      console.log(err)
      notification.error({message: 'Lỗi', description: 'Không thể tải danh sách tệp'});
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line
  }, [fetchFiles]);
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
              grid={{
                gutter: 16,
                xs: 1,
                sm: 2,
                md: 4,
                lg: 4,
                xl: 6,
                xxl: 3,
              }}
              dataSource={[...new Set(items)]}
              renderItem={(item) => (
                <List.Item>
                  <Card hoverable
                        cover={<Image style={{border: '1px solid #f0f0f0', borderRadius: '15px'}}
                                      alt={item.key} src={`${process.env.REACT_APP_API_URL}/${item.full_url}`} />}
                  >
                    <Meta description={item.key} />
                  </Card>
                </List.Item>
              )}
            />
          </InfiniteScroll>}
        button={<UploadFile onChange={fetchFiles}/>}
      />
    </Home>
  );
}
export default ListFile;