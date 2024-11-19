import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import SunEditor from "suneditor-react"; // Or use fetch API if you prefer
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import { notification } from "antd";

const MailEditor = forwardRef((props, ref) => {
    const editorRef = useRef(null);
    useImperativeHandle(ref, () => ({
      getContent: () => {
        return editorRef.current.editor.getContents();
      }
    }));
    const options = {
      buttonList: [
        ['undo', 'redo'],
        ['font', 'fontSize', 'formatBlock'],
        ['bold', 'italic', 'underline'],
        ['fontColor', 'hiliteColor'],
        ['removeFormat'],
        ['outdent', 'indent'],
        ['align', 'list', 'lineHeight'],
        ['link', 'image'],
        ['fullScreen', 'codeView'],
        ['preview', 'print'],
        ['save']
      ],
      callBackSave: (contents) => {
        console.log('Save:', contents);
        notification.success({
          message: 'Nội dung đã được lưu',
          description: 'Nội dung email đã được lưu thành công.',
        });
      },
      width: '100%',
      height: '200px',
      stickyToolbar: '0',
      maxHeight: '250px',
    }
    return (
      <div>
        <SunEditor ref={editorRef} onChange={props.onChange} setOptions={options}/>
      </div>
    );
  })
;

export default MailEditor;