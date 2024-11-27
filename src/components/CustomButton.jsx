import React from 'react';
import { Button } from "antd";

const CustomButton = ({onClick, title}) => {

  return (
    <div>
      <Button type="primary" size={"large"} onClick={onClick}>{title}</Button>
    </div>
  );
};

export default CustomButton;