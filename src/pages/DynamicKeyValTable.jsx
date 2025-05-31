import React, { useContext, useEffect, useRef, useState } from 'react';
import { Button, Form, Input, Popconfirm, Select, Table } from 'antd';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const EditableContext = React.createContext(null);

const EditableRow = ({index, ...props}) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
                        title,
                        editable,
                        children,
                        dataIndex,
                        record,
                        handleSave,
                        recipient,
                        isRecipientColumn,
                        ...restProps
                      }) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef(null);
  const form = useContext(EditableContext);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  // Fixed toggle function to directly set the state
  const toggleEdit = () => {
    setEditing(true);
    form.setFieldsValue({ [dataIndex]: record[dataIndex] });
  };

  const save = async () => {
    try {
      const values = await form.validateFields();
      setEditing(false); // Directly set to false instead of toggling
      handleSave({...record, ...values});
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    if (isRecipientColumn) {
      childNode = editing ? (
        <Form.Item
          style={{margin: 0}}
          name={dataIndex}
          rules={[{required: true, message: `${title} is required.`}]}
        >
          <Select
            ref={inputRef}
            options={recipient}
            onBlur={save}
            style={{width: '100%'}}
            placeholder="Select recipient"
          />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{paddingInlineEnd: 24, cursor: 'pointer'}}
          onClick={toggleEdit}
        >
          {record[dataIndex] ? recipient.find(r => r.value === record[dataIndex])?.label || record[dataIndex] : 'Click to select'}
        </div>
      );
    } else {
      childNode = editing ? (
        <Form.Item
          style={{margin: 0}}
          name={dataIndex}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{paddingInlineEnd: 24, cursor: 'pointer'}}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
  }

  return <td {...restProps}>{childNode}</td>;
};
const EditableTitle = ({title, dataIndex, handleTitleChange, handleDeleteColumn, canDelete = true}) => {
  const [editing, setEditing] = useState(false);
  const [titleValue, setTitleValue] = useState(title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const save = () => {
    toggleEdit();
    handleTitleChange(dataIndex, titleValue);
  };

  return (
    <div style={{display: 'flex', alignItems: 'center'}}>
      {editing ? (
        <Input
          ref={inputRef}
          value={titleValue}
          onChange={(e) => setTitleValue(e.target.value)}
          onPressEnter={save}
          onBlur={save}
          style={{margin: 0}}
        />
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{paddingRight: 24, cursor: 'pointer'}}
          onClick={toggleEdit}
        >
          {title}
        </div>
      )}
      {canDelete && (
        <Button
          type="text"
          icon={<DeleteOutlined />}
          size="small"
          onClick={() => handleDeleteColumn(dataIndex)}
          style={{marginLeft: 8}}
        />
      )}
    </div>
  );
};

const DynamicKeyValTable = ({form, recipient = [], onDataChange}) => {
  const [count, setCount] = useState(1);
  const [dataSource, setDataSource] = useState([{
    rowKey: 0,
    recipient: '',
    key: 'value',
  }]);
  const [columnCount, setColumnCount] = useState(1);

  const [columns, setColumns] = useState([
    {
      title: 'Recipient',
      dataIndex: 'recipient',
      width: '30%',
      editable: true,
      isRecipientColumn: true,
    },
    {
      title: 'key',
      dataIndex: 'key',
      editable: true,
    },
    {
      title: 'operation',
      dataIndex: 'operation',
      render: (_, record) => {
       return  dataSource.length >= 1 ? (
          <Popconfirm title="Sure to delete?" onConfirm={() => {
            handleDelete(record.rowKey);
          }}>
            <a>Xoá</a>
          </Popconfirm>
        ) : null
      },
    },
  ]);

  useEffect(() => {
    if (onDataChange) {
      // Prepare data for parent component
      const formattedData = dataSource.map(item => {
        const {rowKey, recipient, ...rest} = item;
        return {recipient, ...rest};
      });

      // Update form values
      form.setFieldsValue({key_val: formattedData});

      // Call the callback
      onDataChange(formattedData);
    }
  }, [dataSource, onDataChange]);

 const handleDelete = (rowKey) => {
    const newData = dataSource.filter(item => item.rowKey !== rowKey);
    setDataSource(newData);
 }
  const handleAdd = () => {
    setCount(count + 1);
    const newData = {
      rowKey: count,
      recipient: '',
      key: 'value',
      // Add default values for new columns
      ...Object.fromEntries(columns.filter(col => col.dataIndex !== 'recipient' && col.dataIndex !== 'operation').map(col => [col.dataIndex, 'value']))
    };
    setDataSource([...dataSource, newData]);
  };
  const handleAddColumn = () => {
    const newColumnName = `column${columnCount}`;

    // Add the field to all existing data
    const newData = dataSource.map(item => ({
      ...item,
      [newColumnName]: 'value'
    }));

    // Add the new column definition
    const newColumn = {
      title: `Column ${columnCount}`,
      dataIndex: newColumnName,
      editable: true,
    };

    // Insert before operation column
    const newColumns = [...columns];
    newColumns.splice(newColumns.length - 1, 0, newColumn);

    setDataSource(newData);
    setColumns(newColumns);
    setColumnCount(columnCount + 1);
  };

  const handleDeleteColumn = (dataIndex) => {
    // Cannot delete recipient, key, value or operation column
    if (dataIndex === 'recipient' || dataIndex === 'operation') {
      return;
    }

    const newColumns = columns.filter(col => col.dataIndex !== dataIndex);
    setColumns(newColumns);

    // Remove the field from all data items
    const newData = dataSource.map(item => {
      const newItem = {...item};
      delete newItem[dataIndex];
      return newItem;
    });

    setDataSource(newData);
  };

  const handleTitleChange = (dataIndex, newTitle) => {
    // Skip changes to reserved columns
    if (dataIndex === 'recipient' || dataIndex === 'operation') {
      const newColumns = columns.map(col => {
        if (col.dataIndex === dataIndex) {
          return { ...col, title: newTitle };
        }
        return col;
      });
      setColumns(newColumns);
      return;
    }

    // Create a new dataIndex from the new title
    const newDataIndex = newTitle.toLowerCase().replace(/\s+/g, '_');

    // Update columns
    const newColumns = columns.map(col => {
      if (col.dataIndex === dataIndex) {
        return { ...col, title: newTitle, dataIndex: newDataIndex };
      }
      return col;
    });

    // Update data objects - transfer values from old key to new key
    const newData = dataSource.map(item => {
      const newItem = { ...item };
      // Only if the dataIndex has changed
      if (dataIndex !== newDataIndex) {
        newItem[newDataIndex] = item[dataIndex];
        delete newItem[dataIndex];
      }
      return newItem;
    });

    setColumns(newColumns);
    setDataSource(newData);
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.rowKey === item.rowKey);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const getColumns = columns.map((col) => {
    // Create a title renderer for all columns
    const titleRender = () => (
      <EditableTitle
        title={col.title}
        dataIndex={col.dataIndex}
        handleTitleChange={handleTitleChange}
        handleDeleteColumn={handleDeleteColumn}
        canDelete={col.dataIndex !== 'recipient' && col.dataIndex !== 'operation'}
      />
    );

    if (!col.editable) {
      return {
        ...col,
        title: titleRender,
      };
    }

    return {
      ...col,
      title: titleRender,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        recipient,
        isRecipientColumn: col.isRecipientColumn,
      }),
    };
  });

  return (
    <Form.Item name="key_val" label="Dynamic Fields">
      <div>
        <Button onClick={handleAdd} type="primary" style={{marginRight: 16, marginBottom: 16}}>
          Add a row
        </Button>
        <Button onClick={handleAddColumn} type="primary" style={{marginBottom: 16}}>
          Add a column
        </Button>
        <Table
            components={components}
            rowClassName={() => 'editable-row'}
            bordered
            dataSource={dataSource}
            columns={getColumns}
            rowKey="rowKey"
            scroll={{ x: 'max-content' }}
          />
      </div>
    </Form.Item>
  );
};

export default DynamicKeyValTable;