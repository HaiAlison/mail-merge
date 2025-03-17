import React from 'react';
import { Button } from "antd";

const CustomButton = ({onClick, title, icon, style }) => {

  return (
    <div>
      <Button type="primary" size={"large"} style={style} onClick={onClick} icon={icon}>{title}</Button>
    </div>
  );
};

export default CustomButton;