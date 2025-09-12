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