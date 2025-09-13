import { DatePicker, Flex, Input, ConfigProvider, Select, Button, Card, Form, Space, message, Spin } from 'antd'
import { 
    MailOutlined, 
    PhoneOutlined, 
    UserAddOutlined, 
    ArrowLeftOutlined,
    TeamOutlined,
    IdcardOutlined
} from '@ant-design/icons'
import ruRU from 'antd/lib/locale/ru_RU'
import { useNavigate } from 'react-router-dom'
import { Department, DepartmentLabels, Position, PositionLabels } from '../config/enums.config'
import { useCreateUserMutation } from '../services/api'
import type { IUser } from '../types/User'
import dayjs from 'dayjs'
import { useEffect } from 'react'

const { Option } = Select

const UserCreatePage = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm()
    const [createUser, { isLoading }] = useCreateUserMutation()

    useEffect(() => {}, [form])

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

            await createUser(cleanedData).unwrap()
            
            message.success('Пользователь успешно создан!')
            navigate('/')
        } catch (error: any) {
            console.error('Ошибка создания пользователя:', error)
            message.error(error.data?.message || 'Не удалось создать пользователя')
        }
    }

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo)
        message.warning('Пожалуйста, заполните все обязательные поля правильно')
    }

    return (
        <div className="max-w-4xl mx-auto py-6">
            <Flex vertical gap={24} className="w-full">
                <Flex justify="space-between" align="center" className="mb-6">
                    <Button 
                        type="text" 
                        icon={<ArrowLeftOutlined />} 
                        onClick={() => navigate('/')}
                        className="flex items-center"
                        disabled={isLoading}
                    >
                        Назад к списку
                    </Button>
                    <Space>
                        <Button
                            type="default" 
                            size="large" 
                            className="!bg-gray-200 !border-gray-200 hover:!bg-gray-300"   
                            onClick={() => navigate('/')} 
                            disabled={isLoading}
                        >
                            Отменить
                        </Button>
                        <Button
                            type="primary" 
                            size="large" 
                            icon={<UserAddOutlined />}
                            className="!bg-green-500 !border-green-500 hover:!bg-green-600"
                            onClick={() => form.submit()}
                            loading={isLoading}
                        >
                            Создать пользователя
                        </Button>
                    </Space>
                </Flex>

                <Form 
                    form={form} 
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    layout="vertical" 
                    className="space-y-6"
                    disabled={isLoading}
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
                                    disabled={isLoading}
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
                                    disabled={isLoading}
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
                                    disabled={isLoading}
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
                                    disabled={isLoading}
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
                                    disabled={isLoading}
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
                                    disabled={isLoading}
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
                                    disabled={isLoading}
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
                                        disabled={isLoading}
                                        onChange={(date) => {
                                            form.setFieldsValue({ birthDate: date })
                                        }}
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
                                        disabled={isLoading}
                                        onChange={(date) => {
                                            form.setFieldsValue({ hireDate: date })
                                        }}
                                    />
                                </ConfigProvider>
                            </Form.Item>
                        </Flex>
                    </Card>

                    <Card title="Статус" size="small" className="!shadow-sm">
                        <Form.Item
                            name="status"
                            label="Статус пользователя"
                            initialValue="active"
                            className="mb-0"
                        >
                            <Select size="large" disabled={isLoading}>
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
                                disabled={isLoading}
                            />
                        </Form.Item>
                    </Card>
                </Form>

                {isLoading && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <Spin size="large" tip="Создание пользователя..." />
                    </div>
                )}
            </Flex>
        </div>
    )
}

export default UserCreatePage