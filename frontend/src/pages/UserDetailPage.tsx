import { Button, Flex, Card, Descriptions, Tag, Spin, Alert, Grid } from 'antd'
import { useParams, useNavigate } from "react-router-dom"

import { 
    MailOutlined, 
    PhoneOutlined, 
    TeamOutlined, 
    IdcardOutlined,
    CalendarOutlined,
    EditOutlined,
    UserOutlined,
    ClockCircleOutlined
} from '@ant-design/icons'

import { useGetUserQuery } from '../services/api'
import { getDepartmentLabel, getPositionLabel } from '../config/enums.config'
import ModalDelete from '../components/common/ModalDelete'

const { useBreakpoint } = Grid

const UserDetailPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const screens = useBreakpoint()
    const isMobile = !screens.md
    
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
                className="mb-4 mx-4"
            />
        )
    }

    const fullName = `${user.lastName} ${user.firstName} ${user.patronymic || ''}`.trim()

    const handleDeleteSuccess = () => {
        console.log('Пользователь удален')
        navigate('/')
    }

    const handleDeleteError = (error: any) => {
        console.error('Ошибка удаления:', error)
    }

    return (
        <div className="max-w-4xl mx-auto py-4 px-2 md:py-6 md:px-0">
            <Flex vertical gap={20} className="w-full">
                {/* Кнопки действий */}
                <Flex 
                    vertical={isMobile} 
                    gap="middle" 
                    justify="space-between" 
                    align={isMobile ? "stretch" : "center"}
                    className="mb-4"
                >
                    <Button 
                        type="text" 
                        icon={<EditOutlined />} 
                        onClick={() => navigate(`/${user.id}/edit`)}
                        size={isMobile ? "middle" : "large"}
                        className="self-start"
                    >
                        Редактировать
                    </Button>
                    
                    <ModalDelete 
                        id={Number(id)}
                        size={isMobile ? "sm" : "md"}
                        onSuccess={handleDeleteSuccess}
                        onError={handleDeleteError}
                    />
                </Flex>

                {/* Основная информация */}
                <Card className="!shadow-sm">
                    <Flex vertical gap="small" className="flex-1">
                        <h1 className="text-xl md:text-2xl font-bold mb-2">{fullName}</h1>
                        <Flex gap="small" align="center">
                            <Tag color={user.status === 'active' ? 'green' : 'red'} className="!text-sm">
                                {user.status === 'active' ? 'Активен' : 'Неактивен'}
                            </Tag>
                            <span className="text-gray-500 text-sm md:text-base">ID: {user.id}</span>
                        </Flex>
                    </Flex>
                </Card>

                {/* Контактная информация */}
                <Card title="Контактная информация" size="small" className="!shadow-sm">
                    {isMobile ? (
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <MailOutlined className="mr-2 text-blue-500" />
                                <div>
                                    <div className="text-xs text-gray-500">Email</div>
                                    {user.email ? (
                                        <a href={`mailto:${user.email}`} className="text-blue-500 hover:text-blue-700 text-sm">
                                            {user.email}
                                        </a>
                                    ) : (
                                        <span className="text-gray-400 text-sm">—</span>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <PhoneOutlined className="mr-2 text-green-500" />
                                <div>
                                    <div className="text-xs text-gray-500">Телефон</div>
                                    <span className="text-sm">{user.phone || <span className="text-gray-400">—</span>}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Descriptions column={1} bordered size="small">
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
                    )}
                </Card>

                {/* Рабочая информация */}
                <Card title="Рабочая информация" size="small" className="!shadow-sm">
                    {isMobile ? (
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <TeamOutlined className="mr-2 text-purple-500" />
                                <div>
                                    <div className="text-xs text-gray-500">Отдел</div>
                                    <span className="text-sm">{getDepartmentLabel(user.department)}</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <IdcardOutlined className="mr-2 text-orange-500" />
                                <div>
                                    <div className="text-xs text-gray-500">Должность</div>
                                    <span className="text-sm">{getPositionLabel(user.position)}</span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <CalendarOutlined className="mr-2 text-red-500" />
                                <div>
                                    <div className="text-xs text-gray-500">Дата приема</div>
                                    <span className="text-sm">{new Date(user.hireDate).toLocaleDateString('ru-RU')}</span>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Descriptions column={1} bordered size="small">
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
                    )}
                </Card>

                {/* Личная информация */}
                <Card title="Личная информация" size="small" className="!shadow-sm">
                    {isMobile ? (
                        <div className="space-y-3">
                            <div className="flex items-center">
                                <UserOutlined className="mr-2 text-pink-500" />
                                <div>
                                    <div className="text-xs text-gray-500">Дата рождения</div>
                                    <span className="text-sm">
                                        {user.birthDate ? (
                                            new Date(user.birthDate).toLocaleDateString('ru-RU')
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <ClockCircleOutlined className="mr-2 text-gray-500" />
                                <div>
                                    <div className="text-xs text-gray-500">Дата создания</div>
                                    <span className="text-sm">{new Date(user.createdAt).toLocaleDateString('ru-RU')}</span>
                                </div>
                            </div>
                            {user.updatedAt && (
                                <div className="flex items-center">
                                    <ClockCircleOutlined className="mr-2 text-gray-500" />
                                    <div>
                                        <div className="text-xs text-gray-500">Последнее обновление</div>
                                        <span className="text-sm">{new Date(user.updatedAt).toLocaleDateString('ru-RU')}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Descriptions column={1} bordered size="small">
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
                    )}
                </Card>

                {/* Заметки */}
                {user.notes && (
                    <Card title="Дополнительные заметки" size="small" className="!shadow-sm">
                        <p className="text-gray-700 text-sm md:text-base">{user.notes}</p>
                    </Card>
                )}
            </Flex>
        </div>
    )
}

export default UserDetailPage