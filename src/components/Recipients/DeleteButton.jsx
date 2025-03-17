import { Button, notification } from "antd";
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
      <Button type="primary" size={"middle"}
              onClick={() => {
                handleDeleteButton(id);
              }}
              style={{backgroundColor: "#f5222d", borderColor: "#f5222d", marginRight: "2rem"}}
              icon={<DeleteOutlined />}></Button>
    </>);
}

export default DeleteButton;