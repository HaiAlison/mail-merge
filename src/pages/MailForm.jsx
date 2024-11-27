import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Form, Input, notification, Button, Space, Select } from 'antd';
import Home from "./Home";
import MailEditor from "../components/Mails/MailEditor";
import { sendMail } from "../api/mailApi";
import MultiSelectSender from "../components/Mails/MultiSelectSender";
import { useToken } from "../hooks/useToken";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import * as ejs from 'ejs-browser';
import '../styles/Common.css'
import { getImages } from "../api/uploadAPI";

const MailForm = () => {
  const [form] = Form.useForm();
  const editorRef = useRef(null);
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
  const [senders, setSenders] = useState([]);
  const handleSenders = (selected, options) => {
    setSenders(options);
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
      console.log(values)
      const responses = senders.filter((t) => values.to.includes(t.value));
      return responses.map(({sender}) => {
        const payload = {
          user_id: tokenData.id,
          to: [sender.email],
          cc: values.cc|| [],
          subject: values.subject,
          text: values.body,
        };
        const params = {
          full_name: sender.first_name + ' ' + sender.last_name, email: sender.email,
        }
        values['key_val']?.length && values['key_val'].forEach((item) => {
          Object.assign(params, {[item.key]: item.value})
        });
        values['attachments']?.length && values['attachments'].forEach((item) => {
          Object.assign(params, {[item.replace(/uploads\/|\.\w+$/g, "")]: process.env.REACT_APP_API_URL + '/' + item})
        })
        console.log(params)
        payload.text = ejs.render(decodeHTML(payload.text), params);
        console.log(payload)
        return payload;
      });
    } catch (e) {
      console.error(e);
    }
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
      setText(payloads[0].text);
    }).catch(e => {
      console.error(e);
    })
  }
  useEffect(() => {
    fetchFiles()
  }, [])
  return (<Home>
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
    >
      <Form.Item
        name="to"
        label="Đến"
        rules={[{required: true, message: 'Vui lòng nhập email người nhận!'}]}
      >
        <MultiSelectSender ref={editorRef} newSender={true} onChange={handleSenders} />
      </Form.Item>

      <Form.Item
        name="cc"
        label="cc"
      >
        <MultiSelectSender ref={editorRef} />
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
        <Button onClick={() => setText('')} level={5}>Xóa nội dung</Button>
        <div dangerouslySetInnerHTML={{__html: text}} />
      </div>
      <div>
        <p className={'note'}>Để sử dụng dữ liệu động, hãy sử dụng cú
          pháp <code>{`
          <%= key %>
          `}</code> trong nội dung email.</p>
        <p className={'note'}>Mặc định sẽ có các key
          là <code>{`email`}</code>, <code>{`full_name`}</code> nên bạn có thể sử dụng
          chúng.</p>
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
      <Form.List name="key_val" label="Dữ liệu động">
        {(fields, {add, remove}) => (<>
          {fields.map(({key, name, ...restField}) => (
            <Space key={key} style={{display: 'flex', marginBottom: 8}} align="baseline">
              <Form.Item
                {...restField}
                name={[name, 'key']}
                rules={[{required: true, message: 'Missing key'}]}
              >
                <Input placeholder="Key" />
              </Form.Item>
              <Form.Item
                {...restField}
                name={[name, 'value']}
                // rules={[{required: true, message: 'Missing last name'}]}
              >
                <Input placeholder="Value" />
              </Form.Item>
              <MinusCircleOutlined onClick={() => remove(name)} />
            </Space>))}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              Thêm dữ liệu động
            </Button>
          </Form.Item>
        </>)}
      </Form.List>
      <Form.Item>
        <Button type="primary" loading={loading} onClick={() => setLoading(true)}
                htmlType="submit">Gửi
        </Button>
      </Form.Item>
    </Form>
  </Home>);
};

export default MailForm;