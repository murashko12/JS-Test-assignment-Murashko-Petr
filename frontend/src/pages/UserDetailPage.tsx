import { Button, Flex, Card, Descriptions, Tag, Spin, Alert } from 'antd'
import { useParams, useNavigate } from "react-router-dom"

import { 
    MailOutlined, 
    PhoneOutlined, 
    TeamOutlined, 
    IdcardOutlined,
    CalendarOutlined,
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons'

import { useGetUserQuery } from '../services/api'
import { getDepartmentLabel, getPositionLabel } from '../config/enums.config'


const UserDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { data: user, error, isLoading } = useGetUserQuery(Number(id))

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Spin size="large" />
            </div>
        )
    }

    if (error || !user) {
        return (
            <Alert
                message="Ошибка загрузки данных"
                description="Не удалось загрузить данные пользователя. Попробуйте обновить страницу."
                type="error"
                showIcon
                className="mb-4"
            />
        )
    }

    const fullName = `${user.lastName} ${user.firstName} ${user.patronymic || ''}`.trim()

    return (
        <div className="max-w-4xl mx-auto py-6"> {/* Добавляем вертикальный padding */}
            <Flex vertical gap={24} className="w-full"> {/* Явно указываем размер gap */}
            <Flex justify="space-between" align="center">
                <Flex gap="middle">
                    <Button
                        type="primary" 
                        size="large" 
                        icon={<EditOutlined />}
                        className="!text-white !bg-blue-500 !border-blue-500 hover:!bg-blue-600"
                        onClick={() => navigate(`/edit/${user.id}`)}
                    >
                        Редактировать
                    </Button>
                    <Button
                        danger
                        size="large" 
                        icon={<DeleteOutlined />}
                        className="!text-white !bg-red-500 !border-red-500 hover:!bg-red-600"   
                    >
                        Удалить
                    </Button>
                </Flex>
            </Flex>

            <Card>
                <Flex vertical gap="small" className="flex-1">
                    <h1 className="text-2xl font-bold mb-2">{fullName}</h1>
                    <Tag color={user.status === 'active' ? 'green' : 'red'} className="!text-sm">
                        {user.status === 'active' ? 'Активен' : 'Неактивен'}
                    </Tag>
                    <p className="text-gray-500">ID: {user.id}</p>
                </Flex>
            </Card>

            <Card title="Контактная информация" size="small">
                <Descriptions column={1} bordered>
                    <Descriptions.Item label={<><MailOutlined /> Email</>}>
                        {user.email ? (
                            <a href={`mailto:${user.email}`} className="text-blue-500 hover:text-blue-700">
                                {user.email}
                            </a>
                        ) : (
                            <span className="text-gray-400">—</span>
                        )}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><PhoneOutlined /> Телефон</>}>
                        {user.phone || <span className="text-gray-400">—</span>}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Card title="Рабочая информация" size="small">
                <Descriptions column={1} bordered>
                    <Descriptions.Item label={<><TeamOutlined /> Отдел</>}>
                        {getDepartmentLabel(user.department)}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><IdcardOutlined /> Должность</>}>
                        {getPositionLabel(user.position)}
                    </Descriptions.Item>
                    <Descriptions.Item label={<><CalendarOutlined /> Дата приема</>}>
                        {new Date(user?.birthDate || '').toLocaleDateString('ru-RU')}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            <Card title="Личная информация" size="small">
                <Descriptions column={1} bordered>
                    <Descriptions.Item label="Дата рождения">
                        {new Date(user?.birthDate || '').toLocaleDateString('ru-RU') || <span className="text-gray-400">—</span>}
                    </Descriptions.Item>
                    <Descriptions.Item label="Дата создания">
                        {new Date(user?.createdAt || '').toLocaleDateString('ru-RU')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Последнее обновление">
                        {new Date(user?.updatedAt || '').toLocaleDateString('ru-RU')}
                    </Descriptions.Item>
                </Descriptions>
            </Card>

            {user.notes && (
                <Card title="Дополнительные заметки" size="small">
                    <p className="text-gray-700">{user.notes}</p>
                </Card>
            )}
        </Flex>
        </div>
    )
}

export default UserDetailPage