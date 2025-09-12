import { DatePicker, Flex, Input, ConfigProvider, Select, Button } from 'antd'
import { MailOutlined, PhoneOutlined, UserAddOutlined } from '@ant-design/icons'
import ruRU from 'antd/lib/locale/ru_RU'
import { useNavigate } from 'react-router-dom'
import { Department, DepartmentLabels, Position, PositionLabels } from '../config/enums.config'

const UserCreatePage = () => {
    
    const navigate = useNavigate()
    
    return (
        <Flex vertical gap={"large"}>
            <Flex gap={"large"} justify="space-between">
                <Flex gap={"large"}>
                    
                    <Flex vertical gap={"large"}>
                        <Input
                            size="large" 
                            placeholder="Фамилия" 
                            className="!w-[250px]"
                        />
                        <Input
                            size="large" 
                            placeholder="Имя" 
                            className="!w-[250px]"
                        />
                        <Input
                            size="large" 
                            placeholder="Отчество" 
                            className="!w-[250px]"
                        />
                        <ConfigProvider locale={ruRU}>
                            <DatePicker
                                format="DD-MM-YYYY"
                                placeholder="Дата рождения"
                                size="large"
                                className="!w-[250px]"
                            />
                        </ConfigProvider>
                    </Flex>
                </Flex>
                <Flex vertical gap={"large"}>
                    <Button
                        type="primary" 
                        size="large" 
                        icon={<UserAddOutlined />} 
                        className="!bg-green-500 !border-green-500 hover:!bg-green-600"
                    >
                        Добавить пользователя
                    </Button>
                    <Button
                        type="primary" 
                        size="large" 
                        className="!bg-gray-500 !border-gray-500 hover:!bg-gray-600"   
                        onClick={() => navigate('/')} 
                    >
                        Отменить
                    </Button>
                </Flex>
            </Flex>
            <Flex gap={"large"} className=''>
                <Input size="large" placeholder="тел." prefix={<PhoneOutlined />} className="!w-[250px]" />
                <Input size="large" placeholder="email" prefix={<MailOutlined />} className="!w-[250px]" />
            </Flex>
            <Flex gap={"large"} className=''>
                <Select
                    size="large"
                    showSearch
                    placeholder="Отдел"
                    filterOption={(input, option) => 
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={Object.values(Department).map(value => ({
                        value,
                        label: DepartmentLabels[value]
                    }))}
                    className="!w-[250px]"
                />
                <Select
                    size="large"
                    showSearch
                    placeholder="Должность"
                    filterOption={(input, option) => 
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={Object.values(Position).map(value => ({
                        value,
                        label: PositionLabels[value]
                    }))}
                    className="!w-[250px]"
                />
            </Flex>
        </Flex>
    )
}

export default UserCreatePage;