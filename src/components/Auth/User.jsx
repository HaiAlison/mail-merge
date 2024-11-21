import { Button, Dropdown, Space } from "antd";

const User = () => {
  return (
    <Space direction="vertical">
      <Dropdown menu={<div>Menu</div>}>
        <Button>Dropdown</Button>
      </Dropdown>
    </Space>
  );
}
export default User;