import { useState } from 'react'
import { Table, Tag, Button, Space, Input, Flex, Spin, Alert } from 'antd'
import type { TableColumnsType } from 'antd'
import { EditOutlined, DeleteOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons'
import type { IUser } from '../types/User'
import { useTableStyles } from '../config/styles.config'
import { useNavigate } from 'react-router-dom'
import { useGetUsersQuery } from '../services/api'
import { getDepartmentLabel, getPositionLabel, } from '../config/enums.config'

const columns: TableColumnsType<IUser> = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        fixed: 'left',
        sorter: (a, b) => a.id - b.id,
    },
    {
        title: 'ФИО',
        dataIndex: 'fullName',
        key: 'fullName',
        width: 200,
        fixed: 'left',
        render: (_, record) => (
            <span>
                {record.lastName} {record.firstName.charAt(0)}.{record.patronymic ? record.patronymic.charAt(0) + '.' : ''}
            </span>
        ),
        sorter: (a, b) => `${a.lastName}${a.firstName}`.localeCompare(`${b.lastName}${b.firstName}`)
    },
    {
        title: 'Группа',
        dataIndex: 'groupName',
        key: 'groupName',
        width: 150,
        fixed: 'left',
        render: (groupName) => groupName || '—',
        sorter: (a, b) => (a.groupName || '').localeCompare(b.groupName || '')
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
        width: 200,
        render: (email) => <a href={`mailto:${email}`}>{email}</a>
    },
    {
        title: 'Телефон',
        dataIndex: 'phone',
        key: 'phone',
        width: 150,
        render: (phone) => phone || '—'
    },
    {
        title: 'Должность',
        dataIndex: 'position',
        key: 'position',
        width: 180,
        render: (position) => getPositionLabel(position),
        sorter: (a, b) => getPositionLabel(a.position).localeCompare(getPositionLabel(b.position))
    },
    {
        title: 'Отдел',
        dataIndex: 'department',
        key: 'department',
        width: 150,
        render: (department) => getDepartmentLabel(department),
        sorter: (a, b) => getDepartmentLabel(a.department).localeCompare(getDepartmentLabel(b.department)),
    },
    {
        title: 'Дата приема',
        dataIndex: 'hireDate',
        key: 'hireDate',
        width: 120,
        render: (date) => new Date(date).toLocaleDateString('ru-RU'),
        sorter: (a, b) => new Date(a.hireDate).getTime() - new Date(b.hireDate).getTime(),
    },
    {
        title: 'Дата рождения',
        dataIndex: 'birthDate',
        key: 'birthDate',
        width: 120,
        render: (date) => date ? new Date(date).toLocaleDateString('ru-RU') : '—'
    },
    {
        title: 'Статус',
        dataIndex: 'status',
        key: 'status',
        width: 100,
        render: (status) => (
            <Tag color={status === 'active' ? 'green' : 'red'}>
                {status === 'active' ? 'Активен' : 'Неактивен'}
            </Tag>
        ),
        filters: [
            { text: 'Активен', value: 'active' },
            { text: 'Неактивен', value: 'inactive' },
        ],
        onFilter: (value, record) => record.status === value
    },
    {
        title: 'Создан',
        dataIndex: 'createdAt',
        key: 'createdAt',
        width: 120,
        render: (date) => new Date(date).toLocaleDateString('ru-RU'),
        sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
        title: 'Действия',
        key: 'actions',
        fixed: 'right',
        width: 120,
        render: (_, record) => (
            <Space>
                <Button 
                    type="primary" 
                    size="small" 
                    icon={<EditOutlined />}
                    // onClick={() => handleEdit(record)}
                />
                <Button 
                    danger 
                    size="small" 
                    icon={<DeleteOutlined />}
                    // onClick={() => handleDelete(record.id)}
                />
            </Space>
        )
    }
]

const UserTable = () => {
    const navigate = useNavigate()
    const { styles } = useTableStyles()
    
    const [searchText, setSearchText] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const { data: usersData, error, isLoading, refetch } = useGetUsersQuery({
        search: searchText,
        page: currentPage,
        limit: pageSize,
    })

    // const handleEdit = (user: IUser) => {
    //     console.log('Редактирование пользователя:', user)
    //     navigate(`/edit/${user.id}`)
    // }

    // const handleDelete = (id: number) => {
    //     console.log('Удаление пользователя:', id)
    //     // Здесь будет логика удаления через RTK Mutation
    // }

    const handleTableChange = (pagination: any, filters: any, sorter: any) => {
        setCurrentPage(pagination.current)
        setPageSize(pagination.pageSize)
    }

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        )
    }

    if (error) {
        return (
            <Alert
                message="Ошибка загрузки данных"
                description="Не удалось загрузить список пользователей. Попробуйте обновить страницу."
                type="error"
                showIcon
                className="mb-4"
            />
        )
    }

    return (
        <div className='flex flex-col gap-2'>
            <Flex justify={"space-between"} align={"center"}>
                <Input 
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    size="large" 
                    placeholder="Поиск по всем полям..." 
                    prefix={<SearchOutlined />} 
                    className="!w-[300px]"
                />
                <Button 
                    type="primary" 
                    size="large" 
                    icon={<UserAddOutlined />} 
                    className="!bg-green-500 !border-green-500 hover:!bg-green-600"
                    onClick={() => navigate('/create')}
                >
                    Добавить пользователя
                </Button>
            </Flex>
      
            <Table<IUser>
                className={styles.customTable}
                columns={columns}
                dataSource={usersData?.users || []}
                scroll={{ x: 1800, y: 380 }}
                pagination={{
                    current: currentPage,
                    pageSize: pageSize,
                    total: usersData?.pagination?.total || 0,
                    showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} пользователей`,
                    showSizeChanger: true,
                    showQuickJumper: true
                }}
                rowKey="id"
                loading={isLoading}
                onChange={handleTableChange}
            />
        </div>
    )
}

export default UserTable