import { Space, Avatar, Tag, Button } from 'antd';
import { EditOutlined, DeleteOutlined, UserOutlined } from '@ant-design/icons';
import type { IUser } from '../types/User';

export const renderFullName = (_: unknown, record: IUser) => (
  <Space>
    <Avatar 
      size="small" 
      src={record.avatar} 
      icon={!record.avatar && <UserOutlined />}
    />
    <span>
      {record.lastName} {record.firstName.charAt(0)}.{record.patronymic ? record.patronymic.charAt(0) + '.' : ''}
    </span>
  </Space>
);

export const renderGroupName = (groupName: string | undefined) => groupName || '—';

export const renderEmail = (email: string) => <a href={`mailto:${email}`}>{email}</a>;

export const renderPhone = (phone: string | undefined) => phone || '—';

export const renderDate = (date: string | undefined) => 
  date ? new Date(date).toLocaleDateString('ru-RU') : '—';

export const renderStatus = (status: 'active' | 'inactive') => (
  <Tag color={status === 'active' ? 'green' : 'red'}>
    {status === 'active' ? 'Активен' : 'Неактивен'}
  </Tag>
);

export const renderActions = (handleEdit: (user: IUser) => void, handleDelete: (id: number) => void) => 
  (_: unknown, record: IUser) => (
    <Space>
      <Button 
        type="primary" 
        size="small" 
        icon={<EditOutlined />}
        onClick={() => handleEdit(record)}
      />
      <Button 
        danger 
        size="small" 
        icon={<DeleteOutlined />}
        onClick={() => handleDelete(record.id)}
      />
    </Space>
  );