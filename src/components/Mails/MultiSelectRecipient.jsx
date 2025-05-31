import React, { forwardRef, useCallback, useEffect, useState } from "react";
import { Divider, notification, Select } from "antd";
import { getRecipients } from "../../api/mailApi";
import CreateRecipientButton from "../Recipients/CreateRecipientButton";

const MultiSelectRecipient = forwardRef((props) => {
  const [selected, setSelected] = useState([]);
  const [options, setOptions] = useState([]);
  const fetchData = useCallback(() => {
    // Fetch options
    getRecipients(100, 1).then((data) => {
      setOptions(data.results.map((sender) => ({
        value: sender.email, label: `${sender.first_name} ${sender.last_name} (${sender.email})`, sender: sender
      })));
    }).catch(e => {
      notification.error({
        message: 'Lỗi', description: 'Có lỗi xảy ra khi lấy danh sách người nhận.'
      })
    })
  }, []);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleSelect = (selected) => {
    setSelected(selected);
    props.onChange(selected, options);
  };

  return (<>
    <Select
      options={options}
      value={selected}
      onChange={handleSelect}
      mode="tags"
      style={{width: "50%"}}
      placeholder="Chọn người nhận"
      listHeight={400}
      dropdownRender={(menu) => (<div>
        <div style={{height: "200px", overflowY: "scroll", transition: "all 0.5s linear"}}>{menu}</div>
        <div style={{width: '100%'}}>
          <Divider style={{margin: '8px 0'}} />
          {props.newSender && <CreateRecipientButton fetchData={() => {
            fetchData();
          }} />}
        </div>
      </div>)}
      dropdownStyle={{
        maxHeight: 400, overflow: 'auto', zIndex: 1000
      }}
    />
  </>);
});
export default MultiSelectRecipient;