import { DatePicker, Flex, Input, ConfigProvider, Select, Button, Card, Form, Space, message, Spin, Alert, Tag } from 'antd'
import { 
    MailOutlined, 
    PhoneOutlined, 
    SaveOutlined, 
    ArrowLeftOutlined,
    TeamOutlined,
    IdcardOutlined
} from '@ant-design/icons'
import ruRU from 'antd/lib/locale/ru_RU'
import { useParams, useNavigate } from 'react-router-dom'
import { Department, DepartmentLabels, Position, PositionLabels } from '../config/enums.config'
import { useGetUserQuery, useUpdateUserMutation } from '../services/api'
import type { IUser } from '../types/User'
import dayjs from 'dayjs'
import { useEffect } from 'react'

const { Option } = Select

const UserEditPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [form] = Form.useForm()
    
    const { data: user, error, isLoading: isUserLoading } = useGetUserQuery(Number(id))
    const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation()

    useEffect(() => {
        if (user) {
            form.setFieldsValue({
                ...user,
                birthDate: user.birthDate ? dayjs(user.birthDate) : undefined,
                hireDate: user.hireDate ? dayjs(user.hireDate) : undefined
            })
        }
    }, [user, form])

    const onFinish = async (values: any) => {
        try {
            const userData: Partial<IUser> = {
                ...values,
                birthDate: values.birthDate && dayjs.isDayjs(values.birthDate) 
                    ? values.birthDate.toISOString() 
                    : undefined,
                hireDate: values.hireDate && dayjs.isDayjs(values.hireDate)
                    ? values.hireDate.toISOString()
                    : undefined
            }

            const cleanedData = Object.fromEntries(
                Object.entries(userData).filter(([_, value]) => value !== undefined)
            )

            await updateUser({ id: Number(id), data: cleanedData }).unwrap()
            
            message.success('Пользователь успешно обновлен!')
            navigate(`/${id}`)
        } catch (error: any) {
            console.error('Ошибка обновления пользователя:', error)
            message.error(error.data?.message || 'Не удалось обновить пользователя')
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo)
        message.warning('Пожалуйста, заполните все обязательные поля правильно')
    }

    if (isUserLoading) {
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
        <div className="max-w-4xl mx-auto py-6">
            <Flex vertical gap={24} className="w-full">
                <Flex justify="space-between" align="center" className="mb-6">
                    <Button 
                        type="text" 
                        icon={<ArrowLeftOutlined />} 
                        onClick={() => navigate(`/${id}`)}
                        className="flex items-center"
                        disabled={isUpdating}
                    >
                        Назад к профилю
                    </Button>
                    <Space>
                        <Button
                            type="default" 
                            size="large" 
                            className="!bg-gray-200 !border-gray-200 hover:!bg-gray-300"   
                            onClick={() => navigate(`/${id}`)} 
                            disabled={isUpdating}
                        >
                            Отменить
                        </Button>
                        <Button
                            type="primary" 
                            size="large" 
                            icon={<SaveOutlined />}
                            className="!bg-blue-500 !border-blue-500 hover:!bg-blue-600"
                            onClick={() => form.submit()}
                            loading={isUpdating}
                        >
                            Сохранить изменения
                        </Button>
                    </Space>
                </Flex>

                <Card className="!shadow-sm mb-4">
                    <Flex vertical gap="small" className="flex-1">
                        <h1 className="text-2xl font-bold mb-2">Редактирование: {fullName}</h1>
                        <Tag color={user.status === 'active' ? 'green' : 'red'} className="!text-sm">
                            {user.status === 'active' ? 'Активен' : 'Неактивен'}
                        </Tag>
                        <p className="text-gray-500">ID: {user.id}</p>
                    </Flex>
                </Card>

                <Form 
                    form={form} 
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    layout="vertical" 
                    className="space-y-6"
                    disabled={isUpdating}
                    initialValues={{
                        status: user.status
                    }}
                >
                    <Card title="Основная информация" className="!shadow-sm">
                        <Flex gap={16} className="w-full">
                            <Form.Item
                                name="lastName"
                                label="Фамилия"
                                rules={[{ required: true, message: 'Введите фамилию' }]}
                                className="flex-1 mb-0"
                            >
                                <Input
                                    size="large" 
                                    placeholder="Фамилия" 
                                    disabled={isUpdating}
                                />
                            </Form.Item>
                            <Form.Item
                                name="firstName"
                                label="Имя"
                                rules={[{ required: true, message: 'Введите имя' }]}
                                className="flex-1 mb-0"
                            >
                                <Input
                                    size="large" 
                                    placeholder="Имя" 
                                    disabled={isUpdating}
                                />
                            </Form.Item>
                            <Form.Item
                                name="patronymic"
                                label="Отчество"
                                className="flex-1 mb-0"
                            >
                                <Input
                                    size="large" 
                                    placeholder="Отчество" 
                                    disabled={isUpdating}
                                />
                            </Form.Item>
                        </Flex>
                    </Card>

                    <Card title="Контактная информация" size="small" className="!shadow-sm">
                        <Flex gap={16} className="w-full">
                            <Form.Item
                                name="phone"
                                label="Телефон"
                                className="flex-1 mb-0"
                            >
                                <Input 
                                    size="large" 
                                    placeholder="+7(999)999-99-99" 
                                    prefix={<PhoneOutlined />} 
                                    disabled={isUpdating}
                                />
                            </Form.Item>
                            <Form.Item
                                name="email"
                                label="Email"
                                rules={[
                                    { required: true, message: 'Введите email' },
                                    { type: 'email', message: 'Введите корректный email' }
                                ]}
                                className="flex-1 mb-0"
                            >
                                <Input 
                                    size="large" 
                                    placeholder="email@example.com" 
                                    prefix={<MailOutlined />} 
                                    disabled={isUpdating}
                                />
                            </Form.Item>
                        </Flex>
                    </Card>

                    <Card title="Рабочая информация" size="small" className="!shadow-sm">
                        <Flex gap={16} className="w-full">
                            <Form.Item
                                name="department"
                                label="Отдел"
                                rules={[{ required: true, message: 'Выберите отдел' }]}
                                className="flex-1 mb-0"
                            >
                                <Select
                                    size="large"
                                    showSearch
                                    placeholder={
                                        <span>
                                            <TeamOutlined /> Выберите отдел
                                        </span>
                                    }
                                    filterOption={(input, option) => 
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={Object.values(Department).map(value => ({
                                        value,
                                        label: DepartmentLabels[value]
                                    }))}
                                    disabled={isUpdating}
                                />
                            </Form.Item>
                            <Form.Item
                                name="position"
                                label="Должность"
                                rules={[{ required: true, message: 'Выберите должность' }]}
                                className="flex-1 mb-0"
                            >
                                <Select
                                    size="large"
                                    showSearch
                                    placeholder={
                                        <span>
                                            <IdcardOutlined /> Выберите должность
                                        </span>
                                    }
                                    filterOption={(input, option) => 
                                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                    }
                                    options={Object.values(Position).map(value => ({
                                        value,
                                        label: PositionLabels[value]
                                    }))}
                                    disabled={isUpdating}
                                />
                            </Form.Item>
                        </Flex>
                    </Card>

                    <Card title="Личная информация" size="small" className="!shadow-sm">
                        <Flex gap={16} className="w-full">
                            <Form.Item
                                name="birthDate"
                                label="Дата рождения"
                                className="flex-1 mb-0"
                            >
                                <ConfigProvider locale={ruRU}>
                                    <DatePicker
                                        format="DD.MM.YYYY"
                                        placeholder="Дата рождения"
                                        size="large"
                                        className="w-full"
                                        disabled={isUpdating}
                                    />
                                </ConfigProvider>
                            </Form.Item>
                            <Form.Item
                                name="hireDate"
                                label="Дата приема"
                                className="flex-1 mb-0"
                            >
                                <ConfigProvider locale={ruRU}>
                                    <DatePicker
                                        format="DD.MM.YYYY"
                                        placeholder="Дата приема"
                                        size="large"
                                        className="w-full"
                                        disabled={isUpdating}
                                    />
                                </ConfigProvider>
                            </Form.Item>
                        </Flex>
                    </Card>

                    <Card title="Статус" size="small" className="!shadow-sm">
                        <Form.Item
                            name="status"
                            label="Статус пользователя"
                            className="mb-0"
                        >
                            <Select size="large" disabled={isUpdating}>
                                <Option value="active">Активен</Option>
                                <Option value="inactive">Неактивен</Option>
                            </Select>
                        </Form.Item>
                    </Card>

                    <Card title="Дополнительная информация" size="small" className="!shadow-sm">
                        <Form.Item
                            name="notes"
                            label="Заметки"
                            className="mb-0"
                        >
                            <Input.TextArea 
                                placeholder="Дополнительная информация о пользователе..."
                                rows={4}
                                disabled={isUpdating}
                            />
                        </Form.Item>
                    </Card>
                </Form>

                {isUpdating && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <Spin size="large" tip="Сохранение изменений..." />
                    </div>
                )}
            </Flex>
        </div>
    )
}

export default UserEditPage