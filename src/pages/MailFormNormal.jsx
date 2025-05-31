import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, notification, Radio } from 'antd';
import Home from "./Home";
import MailEditor from "../components/Mails/MailEditor";
import { getRecipients, sendMail } from "../api/mailApi";
import MultiSelectRecipient from "../components/Mails/MultiSelectRecipient";
import { useToken } from "../hooks/useToken";
import * as ejs from 'ejs-browser';
import '../styles/Common.css'
import DynamicKeyValTable from "./DynamicKeyValTable";

const MailFormEJS = () => {
  const [form] = Form.useForm();
  const editorRef = useRef(null);
  const [recipient, setRecipient] = useState([]);
  const [sendMode, setSendMode] = useState('multiple');
  const [senders, setSenders] = useState([]);
  const tokenData = useToken();

  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const fetchRecipient = () => {
    getRecipients(100, 1).then((data) => {
      setRecipient(data.results.map((sender) => ({
        value: sender.email, label: `${sender.first_name} ${sender.last_name} (${sender.email})`, sender: sender
      })));
    }).catch(e => {
      notification.error({
        message: 'Lỗi', description: 'Có lỗi xảy ra khi lấy danh sách người nhận.'
      })
    })
  };
  const handleRecipients = (selected, options) => {
    setSenders(options);
  };

  function mergeText(template, data) {
    return template.replace(/{{(.*?)}}/g, (_, key) => data[key.trim()] || '');
  }

  const handleEJS = (values) => {
    try {
      if (sendMode === 'multiple') {
        const recipients = senders.map((item) => {
          return {...item.sender, email: item.value};
        });
        if (recipients?.length) {
          const payload = {
            user_id: tokenData.id,
            to: recipients.map(item => item.email),
            cc: values.cc || [],
            subject: values.subject,
            text: values.body,
          };
          payload.text = ejs.render(mergeText(payload.text, {}));
          return [payload];
        }
      }
      if (values['key_val']?.length) {
        const recipients = values['key_val'].map((item) => {
          return {...item, ...recipient.find(r => r.value === item.recipient)?.sender,};
        }).filter(item => item && item.email);
        return recipients.map((item) => {
          if (item) {
            item.full_name = `${item?.first_name} ${item?.last_name}`;
          }
          const payload = {
            user_id: tokenData.id,
            to: [item.email],
            cc: values.cc || [],
            subject: values.subject,
            text: values.body,
          };

          const params = {
            ...item,
            recipient: item.full_name || '',
          }
          payload.text = ejs.render(mergeText(payload.text, params));
          return payload;
        })
      }
    } catch (e) {
      console.error(e);
    }
  }
  const handleDynamicTableChange = (data) => {
    console.log('data', data);
  }
  const onFinish = (values) => {
    try {
      const payloads = handleEJS(values);
      payloads.forEach(t => send(t));
    } catch (e) {
      setLoading(false);
    }
  };
  const send = (payload) => {
    try {
      sendMail(payload).then(() => {
        notification.success({
          message: 'Thành công', description: 'Email đã được gửi thành công.',
        });
        form.resetFields();
        editorRef?.current?.editor?.setContents('');
        setLoading(false);
      }).catch((e) => {
        console.error(e);
        setLoading(false);
        notification.error({
          message: 'Lỗi', description: 'Có lỗi xảy ra khi gửi email.',
        });
      });
    } catch (e) {
      console.error(e);
      setLoading(false);
      notification.error({
        message: 'Lỗi', description: 'Có lỗi xảy ra khi gửi email.',
      })
    }
  };

  const handlePreview = () => {
    form.validateFields().then(values => {
      const payloads = handleEJS(values);
      console.log('payloads', payloads);
      setText(payloads[0]?.text);
    }).catch(e => {
      console.error(e);
    })
  }
  useEffect(() => {
    fetchRecipient();
  }, [])
  return (<Home>
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Radio.Group onChange={(e) => {
        setSendMode(e.target.value);
      }} value={sendMode} style={{marginBottom: "10px"}}>
        <Radio value="multiple">Gửi cùng 1 email cho nhiều người</Radio>
        <Radio value="separate">Gửi mỗi người 1 email riêng</Radio>
      </Radio.Group>
      {sendMode === 'separate' ? (
        <DynamicKeyValTable onDataChange={handleDynamicTableChange} form={form} recipient={recipient} />
      ) : (
        <>
          <Form.Item
            name="to"
            label="Đến"
            rules={[{required: true, message: 'Vui lòng chọn người nhận!'}]}
          >
            <MultiSelectRecipient ref={editorRef} newSender={false} onChange={handleRecipients} />
          </Form.Item>
        </>
      )}
      <Form.Item
        name="cc"
        label="Cc"
      >
        <MultiSelectRecipient ref={editorRef} />
      </Form.Item>
      <Form.Item
        name="subject"
        label="Chủ đề"
        rules={[{required: true, message: 'Vui lòng nhập chủ đề!'}]}
      >
        <Input style={{width: "50%"}} placeholder="Chủ đề email" />
      </Form.Item>

      <Form.Item
        name="body"
        label="Nội dung"
        rules={[{required: true, message: 'Vui lòng nhập nội dung!'}]}
      >
        <MailEditor ref={editorRef} />
      </Form.Item>

      {sendMode === 'separate' && (<>
        <div>
          <Button style={{marginRight: "10px"}} onClick={handlePreview} level={5}>Xem trước</Button>
          <Button onClick={() => setText('')} level={5}>Xóa xem trước</Button>
          <div dangerouslySetInnerHTML={{__html: text}} />
        </div>
        <div>
          <p className={'note'}>Để sử dụng dữ liệu động, hãy sử dụng cú
            pháp <code>{`{{key}}`}</code> trong nội dung email.</p>
        </div>
      </>)}
      <Form.Item style={{marginTop: "20px"}}>
        <Button type="primary" loading={loading} onClick={() => setLoading(true)}
                htmlType="submit">Gửi
        </Button>
      </Form.Item>
    </Form>
  </Home>);
};

export default MailFormEJS;