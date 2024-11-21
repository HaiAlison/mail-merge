import React, { useState, useEffect, useRef } from "react";
import { Button, Divider, Input, Select, Space } from "antd";
import { getSenders } from "../../api/mailApi";
import { PlusOutlined } from "@ant-design/icons";

const MultiSelectSender = () => {
  const [selected, setSelected] = useState([]);
  const [options, setOptions] = useState([]);
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  const addItem = () => {

  }
  const onNameChange = (event) => {
    setName(event.target.value);
  };
  useEffect(() => {
    // Fetch options
    getSenders(10, 1).then((data) => {
      setOptions(
        data.results.map((sender) => ({
            value: sender.email,
            label: sender.email
          })
        )
      );
    });
  }, []);

  const handleSelect = (selected) => {
    setSelected(selected);
  };

  return (
    <Select
      options={options}
      value={selected}
      onChange={handleSelect}
      mode="tags"
      style={{width: "50%"}}
      placeholder="Chọn người gửi"
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{margin: '8px 0'}} />
          <Space style={{padding: '0 8px 4px'}}>
            <Input
              placeholder="Please enter item"
              ref={inputRef}
              value={name}
              onChange={onNameChange}
              onKeyDown={(e) => e.stopPropagation()}
            />
            <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
              Add item
            </Button>
          </Space>
        </>
      )}
    />
  );
};
export default MultiSelectSender;