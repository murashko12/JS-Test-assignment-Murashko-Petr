import { Breadcrumb, Layout, theme, Button, Space, message, Modal, Upload, List, Spin } from 'antd'
import { useBreadcrumb } from '../hooks/useBreadcrumb'
import { 
    CloudDownloadOutlined, 
    CloudUploadOutlined, 
    FileTextOutlined,
    DownloadOutlined,
} from '@ant-design/icons'
import { useState } from 'react'
import { 
    useCreateBackupMutation, 
    useRestoreBackupFromFileMutation, 
    useGetBackupsListQuery,
    useDownloadBackupMutation,
    useRestoreBackupMutation
} from '../services/api'

const { Header, Content, Footer } = Layout
const { Dragger } = Upload

const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken()
    const breadcrumbItems = useBreadcrumb()
    const [isBackupModalOpen, setIsBackupModalOpen] = useState(false)
    const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false)

    const [createBackup, { isLoading: isCreatingBackup }] = useCreateBackupMutation()
    const [restoreFromFile, { isLoading: isRestoringFromFile }] = useRestoreBackupFromFileMutation()
    const [downloadBackup] = useDownloadBackupMutation()
    const [restoreBackup] = useRestoreBackupMutation()
    
    const { data: backupsData, refetch: refetchBackups } = useGetBackupsListQuery()

    const breadcrumbRenderItems = breadcrumbItems.map((item, index) => ({
        title: item.href ? <a href={item.href}>{item.title}</a> : item.title,
        key: index.toString()
    }))

    const handleCreateBackup = async () => {
        try {
            const result = await createBackup().unwrap()
            message.success(`Бэкап создан: ${result.filename}`)
            refetchBackups()
        } catch (error) {
            message.error('Ошибка при создании бэкапа')
        }
    }

    const handleRestoreFromFile = async (file: File) => {
        try {
            const formData = new FormData()
            formData.append('file', file)
            
            const result = await restoreFromFile(formData).unwrap()
            message.success(`Восстановлено пользователей: ${result.usersRestored}`)
            setIsRestoreModalOpen(false)
        } catch (error) {
            message.error('Ошибка при восстановлении из файла')
        }
    }

    const handleDownloadBackup = async (filename: string) => {
        try {
            const blob = await downloadBackup(filename).unwrap()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = filename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
            message.success('Файл скачан')
        } catch (error) {
            message.error('Ошибка при скачивании бэкапа')
        }
    }

    const handleRestoreFromBackup = async (filename: string) => {
        try {
            const result = await restoreBackup(filename).unwrap()
            message.success(`Восстановлено пользователей: ${result.usersRestored}`)
            setIsBackupModalOpen(false)
        } catch (error) {
            message.error('Ошибка при восстановлении из бэкапа')
        }
    }

    const uploadProps = {
        beforeUpload: (file: File) => {
            handleRestoreFromFile(file)
            return false // Prevent automatic upload
        },
        showUploadList: false,
        accept: '.csv'
    }

    return (
        <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header style={{ 
                display: 'flex', 
                alignItems: 'center', 
                flexShrink: 0,
                justifyContent: 'space-between',
                padding: '0 50px'
            }}>
                <Space>
                    <Button
                        type="primary"
                        icon={<CloudDownloadOutlined />}
                        onClick={() => setIsBackupModalOpen(true)}
                        loading={isCreatingBackup}
                    >
                        Бэкап
                    </Button>
                    
                    <Button
                        type="default"
                        icon={<CloudUploadOutlined />}
                        onClick={() => setIsRestoreModalOpen(true)}
                        style={{ color: 'blue', borderColor: 'white' }}
                    >
                        Восстановить
                    </Button>
                </Space>
            </Header>
        
            <Content style={{ 
                padding: '0 48px', 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                overflow: 'hidden'
            }}>
                <Breadcrumb
                    style={{ margin: '16px 0', flexShrink: 0 }}
                    items={breadcrumbRenderItems}
                />
                <div
                    style={{
                        background: colorBgContainer,
                        flex: 1,
                        padding: 24,
                        borderRadius: borderRadiusLG,
                        marginBottom: 24,
                        height: '100%'
                    }}
                >
                    {children}
                </div>
            </Content>
      
            <Footer style={{ textAlign: 'center', flexShrink: 0 }}>
                My App ©{new Date().getFullYear()} Created with Ant Design
            </Footer>

            <Modal
                title="Управление бэкапами"
                open={isBackupModalOpen}
                onCancel={() => setIsBackupModalOpen(false)}
                footer={[
                    <Button key="create" type="primary" onClick={handleCreateBackup} loading={isCreatingBackup}>
                        Создать новый бэкап
                    </Button>
                ]}
                width={600}
            >
                <div style={{ marginBottom: 16 }}>
                    <h4>Доступные бэкапы:</h4>
                    <List
                        size="small"
                        dataSource={backupsData?.backups || []}
                        renderItem={(filename) => (
                            <List.Item
                                actions={[
                                    <Button 
                                        key="download" 
                                        type="text" 
                                        icon={<DownloadOutlined />} 
                                        onClick={() => handleDownloadBackup(filename)}
                                        size="small"
                                    />,
                                    <Button 
                                        key="restore" 
                                        type="text" 
                                        icon={<CloudUploadOutlined />}
                                        onClick={() => handleRestoreFromBackup(filename)}
                                        size="small"
                                    />
                                ]}
                            >
                                <List.Item.Meta
                                    avatar={<FileTextOutlined />}
                                    title={filename}
                                />
                            </List.Item>
                        )}
                    />
                </div>
            </Modal>

            {/* Модальное окно восстановления */}
            <Modal
                title="Восстановление из файла"
                open={isRestoreModalOpen}
                onCancel={() => setIsRestoreModalOpen(false)}
                footer={null}
                width={400}
            >
                <Dragger {...uploadProps}>
                    <p className="ant-upload-drag-icon">
                        <CloudUploadOutlined />
                    </p>
                    <p className="ant-upload-text">Нажмите или перетащите CSV файл для восстановления</p>
                    <p className="ant-upload-hint">
                        Поддерживаются только CSV файлы
                    </p>
                </Dragger>
                
                {isRestoringFromFile && (
                    <div style={{ textAlign: 'center', marginTop: 16 }}>
                        <Spin tip="Восстановление данных..." />
                    </div>
                )}
            </Modal>
        </Layout>
    )
}

export default AppLayout