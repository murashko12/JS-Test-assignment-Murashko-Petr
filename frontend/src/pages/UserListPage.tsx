import { useState } from 'react'
import { Table, Tag, Button, Space, Input, Flex, Spin, Alert, Card, Grid } from 'antd'
import type { TableColumnsType } from 'antd'
import { EditOutlined, SearchOutlined, UserAddOutlined, MailOutlined, PhoneOutlined, TeamOutlined, IdcardOutlined, CalendarOutlined } from '@ant-design/icons'
import type { IUser } from '../types/User'
import { useTableStyles } from '../config/styles.config'
import { useNavigate } from 'react-router-dom'
import { useGetUsersQuery } from '../services/api'
import { getDepartmentLabel, getPositionLabel } from '../config/enums.config'
import ModalDelete from '../components/common/ModalDelete'

const { useBreakpoint } = Grid

const UserTable = () => {
    const navigate = useNavigate()
    const { styles } = useTableStyles()
    const screens = useBreakpoint()
    const isMobile = !screens.md
    
    const [searchText, setSearchText] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    const { data: usersData, error, isLoading, refetch } = useGetUsersQuery({
        search: searchText,
        page: currentPage,
        limit: pageSize
    })

    const handleRowClick = (record: IUser) => {
        return {
            onClick: (event: React.MouseEvent) => {
                const target = event.target as HTMLElement
                if (target.closest('button')) {
                    return
                }
                navigate(`/${record.id}`)
            },
            style: { cursor: 'pointer' }
        }
    }

    const handleTableChange = (pagination: any) => {
        setCurrentPage(pagination.current)
        setPageSize(pagination.pageSize)
    }

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
                        onClick={() => navigate(`/${record.id}/edit`)}
                    />
                    <ModalDelete 
                        id={record.id}
                        size="sm"
                        onSuccess={() => {
                            console.log('Пользователь удален')
                            refetch()
                        }}
                        onError={(error) => {
                            console.error('Ошибка удаления:', error)
                        }}
                    />
                </Space>
            )
        }
    ]

    const UserCard = ({ user }: { user: IUser }) => (
        <Card 
            key={user.id}
            className="mb-4 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => navigate(`/${user.id}`)}
            actions={[
                <Button 
                    type="primary" 
                    size="small" 
                    icon={<EditOutlined />}
                    onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/${user.id}/edit`)
                    }}
                />,
                <ModalDelete 
                    id={user.id}
                    size="sm"
                    onSuccess={() => {
                        console.log('Пользователь удален')
                        refetch()
                    }}
                    onError={(error) => {
                        console.error('Ошибка удаления:', error)
                    }}
                />
            ]}
        >
            <div className="space-y-3">
                <div className="flex justify-between items-start">
                    <div>
                        <h3 className="font-semibold text-lg">
                            {user.lastName} {user.firstName} {user.patronymic || ''}
                        </h3>
                        <Tag color={user.status === 'active' ? 'green' : 'red'} className="mt-1">
                            {user.status === 'active' ? 'Активен' : 'Неактивен'}
                        </Tag>
                    </div>
                    <span className="text-gray-500 text-sm">ID: {user.id}</span>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center text-sm">
                        <MailOutlined className="mr-2 text-blue-500" />
                        <a href={`mailto:${user.email}`} onClick={(e) => e.stopPropagation()}>
                            {user.email}
                        </a>
                    </div>
                    
                    {user.phone && (
                        <div className="flex items-center text-sm">
                            <PhoneOutlined className="mr-2 text-green-500" />
                            <span>{user.phone}</span>
                        </div>
                    )}

                    <div className="flex items-center text-sm">
                        <TeamOutlined className="mr-2 text-purple-500" />
                        <span>{getDepartmentLabel(user.department)}</span>
                    </div>

                    <div className="flex items-center text-sm">
                        <IdcardOutlined className="mr-2 text-orange-500" />
                        <span>{getPositionLabel(user.position)}</span>
                    </div>

                    {user.groupName && (
                        <div className="flex items-center text-sm">
                            <span className="mr-2">👥</span>
                            <span>Группа: {user.groupName}</span>
                        </div>
                    )}

                    <div className="flex items-center text-sm">
                        <CalendarOutlined className="mr-2 text-red-500" />
                        <span>Принят: {new Date(user.hireDate).toLocaleDateString('ru-RU')}</span>
                    </div>

                    {user.birthDate && (
                        <div className="flex items-center text-sm">
                            <CalendarOutlined className="mr-2 text-pink-500" />
                            <span>Родился: {new Date(user.birthDate).toLocaleDateString('ru-RU')}</span>
                        </div>
                    )}
                </div>
            </div>
        </Card>
    )

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
        <div className='flex flex-col gap-4'>
            <Flex justify="space-between" align="center" wrap="wrap" gap="middle">
                <Input 
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    size="large" 
                    placeholder="Поиск по всем полям..." 
                    prefix={<SearchOutlined />} 
                    className="!w-full md:!w-[300px]"
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

            {isMobile ? (
                <div className="space-y-3">
                    {usersData?.users.map(user => (
                        <UserCard key={user.id} user={user} />
                    ))}
                </div>
            ) : (
                <Table<IUser>
                    className={styles.customTable}
                    columns={columns}
                    dataSource={usersData?.users || []}
                    scroll={{ x: 1800 }}
                    pagination={{
                        current: currentPage,
                        pageSize: pageSize,
                        total: usersData?.pagination?.total || 0,
                        showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} пользователей`,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        responsive: true
                    }}
                    rowKey="id"
                    loading={isLoading}
                    onChange={handleTableChange}
                    onRow={handleRowClick}
                />
            )}

            {/* Пагинация для мобильной версии */}
            {isMobile && usersData && usersData.pagination.total > 0 && (
                <div className="flex justify-center mt-4">
                    <Space>
                        <Button
                            size="small"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(currentPage - 1)}
                        >
                            Назад
                        </Button>
                        <span className="text-sm">
                            Страница {currentPage} из {Math.ceil(usersData.pagination.total / pageSize)}
                        </span>
                        <Button
                            size="small"
                            disabled={currentPage * pageSize >= usersData.pagination.total}
                            onClick={() => setCurrentPage(currentPage + 1)}
                        >
                            Вперед
                        </Button>
                    </Space>
                </div>
            )}
        </div>
    )
}

export default UserTable