import { Button, Modal, Spin, Alert, Descriptions, Tag } from "antd"
import { DeleteOutlined } from '@ant-design/icons'
import { useState, useEffect } from "react"
import type { IUser } from "../../types/User"
import { getDepartmentLabel, getPositionLabel } from "../../config/enums.config"
import { useDeleteUserMutation, useLazyGetUserQuery } from "../../services/api"

interface IProps {
    id: number
    size: "sm" | "md"
    onSuccess?: () => void
    onError?: (error: any) => void
}

const ModalDelete = ({ id, size, onSuccess, onError }: IProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [getUser, { data: userData, isLoading: isUserLoading, error: userError }] = useLazyGetUserQuery()
    const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation()

    useEffect(() => {
        if (isModalOpen && id) {
            getUser(id)
        }
    }, [isModalOpen, id, getUser])

    const showModal = () => {
        setIsModalOpen(true)
    }

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const handleOk = async () => {
        try {
            await deleteUser(id).unwrap()
            setIsModalOpen(false)
            onSuccess?.()
        } catch (error) {
            onError?.(error)
        }
    }

    const formatUserName = (user: IUser) => {
        return `${user.lastName} ${user.firstName}${user.patronymic ? ' ' + user.patronymic : ''}`
    }

    return (
        <>
            {size === "sm" ? (
                <Button
                    danger 
                    size="small" 
                    icon={<DeleteOutlined />}
                    onClick={(e) => {
                        e.stopPropagation()
                        showModal()
                    }}
                    loading={isDeleting}
                />
            ) : (
                <Button
                    danger
                    size="large" 
                    icon={<DeleteOutlined />}
                    className="!text-white !bg-red-500 !border-red-500 hover:!bg-red-600"
                    onClick={showModal}
                    loading={isDeleting}
                >
                    Удалить
                </Button>
            )}
            
            <Modal
                title="Подтверждение удаления пользователя"
                open={isModalOpen}
                onCancel={handleCancel}
                onOk={handleOk}
                confirmLoading={isDeleting}
                okText="Удалить"
                cancelText="Отмена"
                okButtonProps={{
                    danger: true,
                    loading: isDeleting
                }}
            >
                {isUserLoading ? (
                    <div className="flex justify-center items-center py-4">
                        <Spin />
                    </div>
                ) : userError ? (
                    <Alert
                        message="Ошибка загрузки данных"
                        description="Не удалось загрузить информацию о пользователе"
                        type="error"
                        showIcon
                        className="mb-4"
                    />
                ) : userData ? (
                    <div className="py-4">
                        <Alert
                            message="Вы действительно хотите удалить этого пользователя?"
                            description="Это действие нельзя отменить."
                            type="warning"
                            showIcon
                            className="mb-4"
                        />
                        
                        <Descriptions column={1} size="small">
                            <Descriptions.Item label="ФИО">
                                {formatUserName(userData)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Должность">
                                {getPositionLabel(userData.position)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Отдел">
                                {getDepartmentLabel(userData.department)}
                            </Descriptions.Item>
                            <Descriptions.Item label="Email">
                                {userData.email || '—'}
                            </Descriptions.Item>
                            <Descriptions.Item label="Статус">
                                <Tag color={userData.status === 'active' ? 'green' : 'red'}>
                                    {userData.status === 'active' ? 'Активен' : 'Неактивен'}
                                </Tag>
                            </Descriptions.Item>
                        </Descriptions>
                    </div>
                ) : null}
            </Modal>
        </>
    )
}

export default ModalDelete