import React from 'react';
import { FloatButton } from "antd";
import { PlusOutlined } from "@ant-design/icons";

const CustomFloatButton = ({onClick, loading}) => {
  return (
    <div>
      <FloatButton type="primary" icon={<PlusOutlined />} style={{width: "5rem", height: "5rem",}}
                   size={"large"}
                   onClick={onClick} loading={loading} />
    </div>
  );
};

export default CustomFloatButton;