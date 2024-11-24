import { Avatar, Dropdown, Image, Space } from "antd";
import Logout from "./Logout";
import { useToken } from "../../hooks/useToken";
import isha from "../../utils/images/isha.jpg";

const User = () => {
  const items = [
    {
      key: '1',
      label: 'Profile',
    },
    {key: 'logout', label: (<Logout />)},
  ]
  const tokenData = useToken();
  return (
    <Space direction="vertical">
      <Space wrap>
        <Dropdown menu={{items}} placement="bottom" trigger={['click']}>
          <Avatar type={"primary"}
                  style={{position: "absolute", right: "10px", top: "5px", marginRight: "20px", cursor: "pointer"}}
                  size={48}
                  icon={<Image preview={false} src={tokenData?.avatar || isha} alt={"avatar"} />} />
        </Dropdown>
      </Space>
    </Space>
  );
}
export default User;