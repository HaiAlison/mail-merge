import React from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';

import ClassicEditor from "@ckeditor/ckeditor5-build-classic"; // Or use fetch API if you prefer

const MailEditor = () => {
  const handleEditorChange = (event, editor) => {
    const data = editor.getData();
    console.log('Content:', data);

    // Send the data to your backend
    //   axios.post('/api/save-email-content', { content: data })
    //     .then(response => {
    //       console.log('Content saved successfully:', response.data);
    //     })
    //     .catch(error => {
    //       console.error('Error saving content:', error);
    //     });
  };
  ClassicEditor
    .create(document.querySelector('#editor'), {
      fontFamily: {
        options:[],
        supportAllValues: true
      },
      toolbar: [
        'heading', 'bulletedList', 'numberedList', 'fontFamily', 'undo', 'redo'
      ]
    })
    .then(editor => {
      // You can access the editor instance here
      editor.setData('Hello, world!');
      console.log(editor);
    })
    .catch(error => {
      console.error('There was a problem initializing the editor:', error);
    });
  return (
    <div>
      <CKEditor
        id="editor"
        editor={ClassicEditor}
        data=""
        onChange={handleEditorChange}
        config={{
          toolbar: [
            'heading', '|',
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'fontSize', 'fontFamily', '|',
            'bulletedList', 'numberedList', '|',
            'link', 'blockQuote', 'undo', 'redo', '|',
            'alignment', 'indent', 'outdent', '|',
            'imageUpload', 'mediaEmbed', 'insertTable', '|',
            'code', 'codeBlock', 'removeFormat'
          ],
          fontSize: {
            options: ['tiny', 'small', 'default', 'big', 'huge']
          },
          fontFamily: {
            options: [
              'default',
              'Arial, Helvetica, sans-serif',
              'Courier New, Courier, monospace',
              'Georgia, serif',
              'Lucida Sans Unicode, Lucida Grande, sans-serif',
              'Tahoma, Geneva, sans-serif',
              'Times New Roman, Times, serif',
              'Trebuchet MS, Helvetica, sans-serif',
              'Verdana, Geneva, sans-serif'
            ]
          },
          alignment: {
            options: ['left', 'center', 'right', 'justify']
          }
        }}/>
    </div>
  );
};

export default MailEditor;