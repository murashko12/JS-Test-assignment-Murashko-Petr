import { DatePicker, Flex, Input, ConfigProvider, Select, Button } from 'antd'
import { MailOutlined, PhoneOutlined, UserAddOutlined } from '@ant-design/icons'
import ruRU from 'antd/lib/locale/ru_RU'
import { useState } from 'react'
import type { GetProp, UploadFile, UploadProps } from 'antd'
import { Upload, message } from 'antd'
import ImgCrop from 'antd-img-crop'
import { useNavigate } from 'react-router-dom'

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0]

const UserCreatePage = () => {
    const navigate = useNavigate()
    const [fileList, setFileList] = useState<UploadFile[]>([])
    
    const onChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList.slice(-1))
    }

    const onPreview = async (file: UploadFile) => {
        let src = file.url as string;
        if (!src) {
            src = await new Promise((resolve) => {
                const reader = new FileReader()
                reader.readAsDataURL(file.originFileObj as FileType)
                reader.onload = () => resolve(reader.result as string)
            })
        }
        const image = new Image()
        image.src = src
        const imgWindow = window.open(src)
        imgWindow?.document.write(image.outerHTML)
    }

    const beforeUpload = (file: FileType) => {
        if (fileList.length >= 1) {
            message.error('Можно загрузить только одно фото');
            return Upload.LIST_IGNORE   
        }

        // Проверяем тип файла (только изображения)
        const isImage = file.type.startsWith('image/')
        if (!isImage) {
            message.error('Можно загружать только изображения!')
            return Upload.LIST_IGNORE
        }

        // Проверяем размер файла (максимум 2MB)
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isLt2M) {
            message.error('Изображение должно быть меньше 2MB!')
            return Upload.LIST_IGNORE
        }
        
        return true
    }

    return (
        <Flex vertical gap={"large"}>
            <Flex gap={"large"} justify="space-between">
                <Flex gap={"large"}>
                    <ImgCrop rotationSlider>
                        <Upload
                            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                            listType="picture-card"
                            fileList={fileList}
                            onChange={onChange}
                            onPreview={onPreview}
                            beforeUpload={beforeUpload}
                            maxCount={1}
                            style={{ width: 250, height: 250 }}
                        >
                            {fileList.length < 1 && (
                                <div style={{ 
                                    width: 300, 
                                    height: 300, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center' 
                                }}>
                                    + Загрузить фото
                                </div>
                            )}
                        </Upload>
                    </ImgCrop>
                    <Flex vertical justify="space-between">
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
                    placeholder="Select a person"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={[
                        { value: '1', label: 'Jack' },
                        { value: '2', label: 'Lucy' },
                        { value: '3', label: 'Tom' },
                    ]}
                    className="!w-[250px]"
                />
                <Select
                    size="large"
                    showSearch
                    placeholder="Select a person"
                    filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                    }
                    options={[
                        { value: '1', label: 'Jack' },
                        { value: '2', label: 'Lucy' },
                        { value: '3', label: 'Tom' },
                    ]}
                    className="!w-[250px]"
                />
            </Flex>
        </Flex>
    )
}

export default UserCreatePage;