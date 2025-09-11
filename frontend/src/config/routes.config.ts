export const ROUTES = {
    HOME: '/',
    USER: {
        LIST: '/',
        CREATE: '/create',
        DETAIL: (id: string | number) => `/${id}`,
        EDIT: (id: string | number) => `/${id}/edit`
    }
} as const

export type AppRoutes = keyof typeof ROUTES