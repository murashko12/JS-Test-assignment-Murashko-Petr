import type { Department, Position } from "../config/enums.config"

export interface IUser {
    id: number
    firstName: string
    lastName: string
    patronymic?: string
    email: string
    phone?: string
    position: Position
    department: Department
    groupId?: number
    groupName?: string
    hireDate: string
    birthDate?: string
    status: 'active' | 'inactive'
    notes?: string
    createdAt: string
    updatedAt: string
}