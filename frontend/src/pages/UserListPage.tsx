import { useState } from 'react'
import { Table, Tag, Button, Space, Input, Flex } from 'antd'
import type { TableColumnsType } from 'antd'
import { EditOutlined, DeleteOutlined, SearchOutlined, UserAddOutlined } from '@ant-design/icons'
import type { IUser } from '../types/User'
import { useTableStyles } from '../config/styles.config'
import { useNavigate } from 'react-router-dom'
import { useGetUsersQuery } from '../services/api'

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
        sorter: (a, b) => a.position.localeCompare(b.position)
    },
    {
        title: 'Отдел',
        dataIndex: 'department',
        key: 'department',
        width: 150,
        sorter: (a, b) => a.department.localeCompare(b.department),
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
        render: () => (
            <Space>
                <Button 
                    type="primary" 
                    size="small" 
                    icon={<EditOutlined />}
                />
                <Button 
                    danger 
                    size="small" 
                    icon={<DeleteOutlined />}
                />
            </Space>
        )
    }
]

// Генерация тестовых данных
const generateTestData = (): IUser[] => {
    const groups = ['Руководство', 'Бухгалтерия', 'Отдел кадров', 'IT-отдел', 'Маркетинг', null]
    const statuses: ('active' | 'inactive')[] = ['active', 'inactive']
    const positions = ['Менеджер', 'Разработчик', 'Дизайнер', 'Аналитик', 'Тестировщик', 'Бухгалтер', 'HR']
    const departments = ['Отдел продаж', 'Технический отдел', 'Финансовый отдел', 'Отдел персонала']
    
    const firstNames = ['Иван', 'Петр', 'Сергей', 'Алексей', 'Дмитрий', 'Андрей', 'Михаил', 'Анна', 'Елена', 'Ольга', 'Мария', 'Наталья']
    const lastNames = ['Иванов', 'Петров', 'Сидоров', 'Смирнов', 'Кузнецов', 'Попов', 'Васильев', 'Новиков']
    const patronymics = ['Иванович', 'Петрович', 'Сергеевич', 'Алексеевич', 'Дмитриевич', null]
    
    return (Array.from({ length: 300 }, (_, i) => {
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const patronymic = patronymics[Math.floor(Math.random() * patronymics.length)];
        const groupIndex = Math.floor(Math.random() * groups.length);
    
        return {
            id: i + 1,
            firstName,
            lastName,
            patronymic:patronymic || undefined,
            email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${i}@company.com`,
            phone: Math.random() > 0.3 ? `+7${Math.floor(9000000000 + Math.random() * 1000000000)}` : undefined,
            position: positions[Math.floor(Math.random() * positions.length)],
            department: departments[Math.floor(Math.random() * departments.length)],
            groupId: groupIndex < 5 ? groupIndex + 1 : undefined,
            groupName: groups[groupIndex] || undefined,
            hireDate: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365 * 5)).toISOString(),
            birthDate: Math.random() > 0.2 ? new Date(1980 + Math.floor(Math.random() * 20), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28)).toISOString() : undefined,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            
            notes: Math.random() > 0.7 ? 'Дополнительные заметки' : undefined,
            createdAt: new Date(Date.now() - Math.floor(Math.random() * 1000 * 60 * 60 * 24 * 365 * 2)).toISOString(),
            updatedAt: new Date().toISOString()
        }
    }))
}

const UserTable = () => {
    const navigate = useNavigate()

    const { styles } = useTableStyles()
    const [ dataSource, setDataSource ] = useState<IUser[]>(generateTestData())
    const [ searchText, setSearchText ] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(10)

    // RTK Query hooks
    const { data, error, isLoading, refetch } = useGetUsersQuery({
        search: '',
        page: currentPage,
        limit: pageSize,
    })

    console.log(data)

    const handleEdit = (user: IUser) => {
        console.log('Редактирование пользователя:', user)
    }

    const handleDelete = (id: number) => {
        console.log('Удаление пользователя:', id)
        setDataSource(prev => prev.filter(user => user.id !== id))
    }

    const filteredData = dataSource.filter(user =>
        Object.values(user).some((value) => (
            value?.toString().toLowerCase().includes(searchText.toLowerCase())
        ))
    )

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
                dataSource={filteredData}
                scroll={{ x: 1800, y: 380 }}
                pagination={{
                    //   showSizeChanger: true,
                    //   showQuickJumper: true,
                    showTotal: (total, range) => `${range[0]}-${range[1]} из ${total} пользователей`,
                }}
                rowKey="id"
            />
        </div>
    )
}

export default UserTable