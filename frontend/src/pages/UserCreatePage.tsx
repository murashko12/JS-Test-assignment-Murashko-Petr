import { DatePicker, Flex, Input, ConfigProvider, Select, Button, Card, Form, Space } from 'antd'
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

const { Option } = Select

const UserCreatePage = () => {
    const navigate = useNavigate()
    const [form] = Form.useForm()

    const onFinish = (values: any) => {
        console.log('Submitted values:', values)
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
                    >
                        Назад к списку
                    </Button>
                    <Space>
                        <Button
                            type="default" 
                            size="large" 
                            className="!bg-gray-200 !border-gray-200 hover:!bg-gray-300"   
                            onClick={() => navigate('/')} 
                        >
                            Отменить
                        </Button>
                        <Button
                            type="primary" 
                            size="large" 
                            icon={<UserAddOutlined />}
                            className="!bg-green-500 !border-green-500 hover:!bg-green-600"
                            onClick={() => form.submit()}
                        >
                            Создать пользователя
                        </Button>
                    </Space>
                </Flex>

                <Form form={form} onFinish={onFinish} layout="vertical" className="space-y-6">
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
                                    placeholder="+7 (999) 999-99-99" 
                                    prefix={<PhoneOutlined />} 
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
                                    />
                                </ConfigProvider>
                            </Form.Item>
                            <Form.Item
                                name="hireDate"
                                label="Дата приема"
                                rules={[{ required: true, message: 'Выберите дату приема' }]}
                                className="flex-1 mb-0"
                            >
                                <ConfigProvider locale={ruRU}>
                                    <DatePicker
                                        format="DD.MM.YYYY"
                                        placeholder="Дата приема"
                                        size="large"
                                        className="w-full"
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
                            <Select size="large">
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
                            />
                        </Form.Item>
                    </Card>
                </Form>
            </Flex>
        </div>
    )
}

export default UserCreatePage