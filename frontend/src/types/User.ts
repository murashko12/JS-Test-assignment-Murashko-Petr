export interface IUser {
    id: number
    firstName: string
    lastName: string
    patronymic?: string
    email: string
    phone?: string
    position: string
    department: string
    groupId?: number
    groupName?: string
    hireDate: string
    birthDate?: string
    status: 'active' | 'inactive'
    avatar?: string
    notes?: string
    createdAt: string
    updatedAt: string
}