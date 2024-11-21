import { FloatButton } from "antd";
import '../../styles/Common.css'
import { PlusOutlined } from '@ant-design/icons'

function CreateButton({onClick}) {
  return (<div style={{position: "absolute", marginTop: '15px', right: '30px'}}>
    <FloatButton type="primary" size={"large"} style={{insetInlineEnd: 24, width: "80px", height: "80px"}}
                 onClick={onClick}
                 icon={<PlusOutlined />}></FloatButton>
  </div>);
}

export default CreateButton;