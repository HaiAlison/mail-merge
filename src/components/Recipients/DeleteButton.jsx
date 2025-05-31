import { Button, notification, Popconfirm } from "antd";
import '../../styles/Common.css'
import { DeleteOutlined } from '@ant-design/icons'
import { deleteRecipient } from "../../api/mailApi";
import { DEFAULT_ERROR_MESSAGE } from "../../utils/constant";

function DeleteButton({id, fetchData}) {
  const handleDeleteButton = (id) => {
    deleteRecipient(id).then((res) => {
      fetchData();
      notification.success({
        message: "Xoá thành công",
        description: `Đã xoá ${res.email}`
      })
    }).catch(e => {
      console.error(e);
      notification.error({
        message: "Lỗi",
        description: DEFAULT_ERROR_MESSAGE
      })
    })
  }

  return (
    <>
      <Popconfirm
        title="Are you sure you want to delete this recipient?"
        onConfirm={() => handleDeleteButton(id)}
        okText="Yes"
        cancelText="No"
      >
        <Button type="primary" size={"middle"}
                style={{backgroundColor: "#f5222d", borderColor: "#f5222d", marginRight: "2rem"}}
                icon={<DeleteOutlined />}></Button>
      </Popconfirm>
    </>);
}

export default DeleteButton;