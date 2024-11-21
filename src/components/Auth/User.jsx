import { Dropdown, FloatButton, Space } from "antd";
import Logout from "./Logout";
import { UserOutlined } from "@ant-design/icons";

const User = () => {
  const items = [
    {
      key: '1',
      label: 'Profile',
    },
    {key: 'logout', label: (<Logout />)},
  ]
  return (
    <Space direction="vertical">
      <Space wrap>
        <Dropdown menu={{items}} placement="bottom" trigger={['click']}>
          <FloatButton type={"primary"} style={{top: "10px", marginRight: "20px"}} icon={<UserOutlined />} />
        </Dropdown>
      </Space>
    </Space>
  );
}
export default User;