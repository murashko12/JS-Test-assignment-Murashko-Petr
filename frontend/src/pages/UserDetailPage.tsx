import { Button, Flex, Card, Descriptions, Tag, Spin, Alert } from 'antd'
import { useParams, useNavigate } from "react-router-dom"

import { 
    MailOutlined, 
    PhoneOutlined, 
    TeamOutlined, 
    IdcardOutlined,
    CalendarOutlined,
    EditOutlined
} from '@ant-design/icons'

import { useGetUserQuery } from '../services/api'
import { getDepartmentLabel, getPositionLabel } from '../config/enums.config'
import ModalDelete from '../components/common/ModalDelete'

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

    const handleDeleteSuccess = () => {
        console.log('Пользователь удален')
        // Перенаправляем на главную страницу после удаления
        navigate('/')
    }

    const handleDeleteError = (error: any) => {
        console.error('Ошибка удаления:', error)
    }

    return (
        <div className="max-w-4xl mx-auto py-6">
            <Flex vertical gap={24} className="w-full">
                <Flex justify="space-between" align="center">
                    <Flex gap="middle">
                        <Button
                            type="primary" 
                            size="large" 
                            icon={<EditOutlined />}
                            className="!text-white !bg-blue-500 !border-blue-500 hover:!bg-blue-600"
                            onClick={() => navigate(`/${user.id}/edit`)}
                        >
                            Редактировать
                        </Button>
                        <ModalDelete 
                            id={Number(id)} // Исправлено: передаем число вместо строки
                            size="md"
                            onSuccess={handleDeleteSuccess}
                            onError={handleDeleteError}
                        />
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
                            {new Date(user.hireDate).toLocaleDateString('ru-RU')}
                        </Descriptions.Item>
                    </Descriptions>
                </Card>

                <Card title="Личная информация" size="small">
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Дата рождения">
                            {user.birthDate ? (
                                new Date(user.birthDate).toLocaleDateString('ru-RU')
                            ) : (
                                <span className="text-gray-400">—</span>
                            )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Дата создания">
                            {new Date(user.createdAt).toLocaleDateString('ru-RU')}
                        </Descriptions.Item>
                        <Descriptions.Item label="Последнее обновление">
                            {user.updatedAt ? (
                                new Date(user.updatedAt).toLocaleDateString('ru-RU')
                            ) : (
                                <span className="text-gray-400">—</span>
                            )}
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