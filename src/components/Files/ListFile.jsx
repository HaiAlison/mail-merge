import Home from "../../pages/Home";
import { Card, List, notification } from "antd";
import { useEffect, useState } from "react";
import { getImages } from "../../api/uploadAPI";
import ScrollableList from "../ScrollableList";
import File from "./NewFile";

const ListFile = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getImages().then((res) => {
      setData(res);
      console.log(data)
    }).catch(e => {
      console.error('Error:', e);
      notification.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi lấy danh sách file.'
      })
    });
    // eslint-disable-next-line
  }, []);
  return (
    <Home>
      <ScrollableList
        children={<List
          grid={{
            gutter: 16,
            xs: 1,
            sm: 2,
            md: 4,
            lg: 4,
            xl: 6,
            xxl: 3,
          }}
          dataSource={new Array(100).fill({title: 'Title'})}
          renderItem={(item) => (
            <List.Item>
              <Card title={item.title}>Card content</Card>
            </List.Item>
          )}
        />}
        button={<File />}
      />
    </Home>
  );
}
export default ListFile;