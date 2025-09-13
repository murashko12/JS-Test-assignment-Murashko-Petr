export const Department = {
    SALES: 'SALES',
    TECHNICAL: 'TECHNICAL',
    FINANCE: 'FINANCE',
    PERSONNEL: 'PERSONNEL'
} as const

export const Position = {
    MANAGER: 'MANAGER',
    DEVELOPER: 'DEVELOPER',
    DESIGNER: 'DESIGNER',
    ANALYST: 'ANALYST',
    TESTER: 'TESTER',
    ACCOUNTANT: 'ACCOUNTANT',
    HR: 'HR'
} as const

export type Department = typeof Department[keyof typeof Department]
export type Position = typeof Position[keyof typeof Position]

export const DepartmentLabels: Record<Department, string> = {
    [Department.SALES]: 'Отдел продаж',
    [Department.TECHNICAL]: 'Технический отдел',
    [Department.FINANCE]: 'Финансовый отдел',
    [Department.PERSONNEL]: 'Отдел персонала'
}

export const PositionLabels: Record<Position, string> = {
    [Position.MANAGER]: 'Менеджер',
    [Position.DEVELOPER]: 'Разработчик',
    [Position.DESIGNER]: 'Дизайнер',
    [Position.ANALYST]: 'Аналитик',
    [Position.TESTER]: 'Тестировщик',
    [Position.ACCOUNTANT]: 'Бухгалтер',
    [Position.HR]: 'HR'
}

export const getDepartmentOptions = () => {
    return Object.values(Department).map(value => ({
        value,
        label: DepartmentLabels[value]
    }))
}

export const getPositionOptions = () => {
    return Object.values(Position).map(value => ({
        value,
        label: PositionLabels[value]
    }))
}

export const getDepartmentLabel = (departmentKey: Department): string => {
    return DepartmentLabels[departmentKey] || departmentKey
}

export const getPositionLabel = (positionKey: Position): string => {
    return PositionLabels[positionKey] || positionKey
}