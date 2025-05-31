import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Input, notification, Select } from 'antd';
import Home from "./Home";
import MailEditor from "../components/Mails/MailEditor";
import { getRecipients, sendMail } from "../api/mailApi";
import MultiSelectRecipient from "../components/Mails/MultiSelectRecipient";
import { useToken } from "../hooks/useToken";
import * as ejs from 'ejs-browser';
import '../styles/Common.css'
import { getImages } from "../api/uploadAPI";
import DynamicKeyValTable from "./DynamicKeyValTable";

const MailFormEJS = () => {
  const [form] = Form.useForm();
  const editorRef = useRef(null);
  const [recipient, setRecipient] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const tokenData = useToken();
  const decodeHTML = (html) => {
    return html
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&');
  };
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
  const fetchFiles = () => {
    getImages(1000, 0).then((data) => {
      setAttachments(data.results.map((file) => ({
        value: file.full_url, label: file.key, file: file
      })));
    })
  }
  const handleEJS = (values) => {
    try {
      if (values['key_val']?.length) {
        const recipients = values['key_val'].map((item) => {
          return {...item, ...recipient.find(r => r.value === item.recipient)?.sender};
        }).filter(item => item && item.email);
        return recipients.map((item) => {
          const payload = {
            user_id: tokenData.id,
            to: [item.email],
            cc: values.cc || [],
            subject: values.subject,
            text: values.body,
          };
          const params = {
            full_name: '',
          }
          if (values['key_val']?.length) {
            values['key_val'].forEach((item) => {
              Object.assign(params, item);
            })
          }
          values['attachments']?.length && values['attachments'].forEach((item) => {
            Object.assign(params, {[item.replace(/uploads\/|\.\w+$/g, "")]: process.env.REACT_APP_API_URL + '/' + item})
          })
          payload.text = ejs.render(decodeHTML(payload.text), params);
          return payload;
        })
      }
    } catch
      (e) {
      console.error(e);
    }
  }
  const handleDynamicTableChange = (data) => {
  }
  const onFinish = (values) => {
    const payloads = handleEJS(values);
    payloads.forEach(t => send(t));
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
      setText(payloads?.length ? payloads[0].text : payloads?.text);
    }).catch(e => {
      console.error(e);
    })
  }
  useEffect(() => {
    fetchRecipient();
    fetchFiles();
  }, [])
  return (<Home>
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <DynamicKeyValTable onDataChange={handleDynamicTableChange} form={form} recipient={recipient} />
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
      <div>
        <Button style={{marginRight: "10px"}} onClick={handlePreview} level={5}>Xem trước</Button>
        <Button onClick={() => setText('')} level={5}>Xóa xem trước</Button>
        <div dangerouslySetInnerHTML={{__html: text}} />
      </div>
      <div>
        <p className={'note'}>Để sử dụng dữ liệu động, hãy sử dụng cú
          pháp <code>{`<%= key %>`}</code> trong nội dung email.</p>
        <p className={'note'}>Nếu bạn muốn thêm dữ liệu động là tệp tin, hãy sử dụng cú
          pháp <code>{`<img src="<%= <tên tệp> %>" />`}</code> trong nội dung email.</p>
      </div>
      <Form.Item
        name="attachments"
        label="Tệp đính kèm"
      >
        <Select
          mode="tags"
          placeholder="Chọn tệp đính kèm"
          style={{width: '50%'}}
          options={attachments}
        ></Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" loading={loading} onClick={() => setLoading(true)}
                htmlType="submit">Gửi
        </Button>
      </Form.Item>
    </Form>
  </Home>);
};

export default MailFormEJS;