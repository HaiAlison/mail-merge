import React, { useState, useEffect, forwardRef, useCallback } from "react";
import { Divider, notification, Select } from "antd";
import { getSenders } from "../../api/mailApi";
import CreateSenderButton from "../Senders/CreateSenderButton";

const MultiSelectSender = forwardRef((props) => {
  const [selected, setSelected] = useState([]);
  const [options, setOptions] = useState([]);
  const fetchData = useCallback(() => {
    // Fetch options
    getSenders(100, 1).then((data) => {
      setOptions(
        data.results.map((sender) => ({
            value: sender.email,
            label: sender.email
          })
        )
      );
    }).catch(e => {
      notification.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi lấy danh sách người gửi.'
      })
    })
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelect = (selected) => {
    setSelected(selected);
    props.onChange(selected);
  };

  return (
    <Select
      options={options}
      value={selected}
      onChange={handleSelect}
      mode="tags"
      style={{width: "50%"}}
      placeholder="Chọn người gửi"
      listHeight={400}
      dropdownRender={(menu) => (
        <>
          {menu}
          <Divider style={{margin: '8px 0'}} />
          <CreateSenderButton fetchData={() => {
            fetchData();
          }} />
        </>
      )
      }
      dropdownStyle={
        {
          maxHeight: 400,
          overflow: 'auto',
          zIndex: 1000
        }
      }
    />
  )
    ;
});
export default MultiSelectSender;