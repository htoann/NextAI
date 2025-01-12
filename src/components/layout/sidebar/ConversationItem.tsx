import { CheckOutlined, CloseOutlined, EllipsisOutlined } from '@ant-design/icons';
import { Dropdown, Input, List, Menu, Popconfirm, Tooltip } from 'antd';
import { useState } from 'react';

interface ConversationItemProps {
  chatName: string;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
  onRename: (newName: string) => void;
}

export const ConversationItem = ({ chatName, isActive, onSelect, onDelete, onRename }: ConversationItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(chatName);

  const handleRename = () => {
    if (editValue.trim()) {
      onRename(editValue);
      setIsEditing(false);
    }
  };

  const menuItems = [
    {
      key: 'rename',
      label: 'Rename',
      onClick: () => setIsEditing(true),
    },
    {
      key: 'delete',
      label: (
        <Popconfirm
          title="Are you sure you want to delete this conversation?"
          onConfirm={onDelete}
          okText="Yes"
          cancelText="No"
        >
          <span>Delete</span>
        </Popconfirm>
      ),
    },
  ];

  return (
    <List.Item
      onClick={!isEditing ? onSelect : undefined}
      style={{
        cursor: isEditing ? 'default' : 'pointer',
        backgroundColor: isActive ? '#e6f7ff' : 'transparent',
        fontWeight: isActive ? 'bold' : 'normal',
        padding: '10px 15px',
        borderRadius: '8px',
        marginBottom: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      {isEditing ? (
        <Input
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onPressEnter={handleRename}
          style={{ marginRight: 10 }}
        />
      ) : (
        <span>{chatName}</span>
      )}

      {isEditing ? (
        <div>
          <Tooltip title="Save">
            <CheckOutlined onClick={handleRename} style={{ color: '#28a745', marginRight: 8, cursor: 'pointer' }} />
          </Tooltip>
          <Tooltip title="Cancel">
            <CloseOutlined onClick={() => setIsEditing(false)} style={{ color: '#dc3545', cursor: 'pointer' }} />
          </Tooltip>
        </div>
      ) : (
        <Dropdown menu={{ items: menuItems }} trigger={['click']}>
          <EllipsisOutlined style={{ fontSize: 20, marginLeft: 10 }} onClick={(e) => e.stopPropagation()} />
        </Dropdown>
      )}
    </List.Item>
  );
};
