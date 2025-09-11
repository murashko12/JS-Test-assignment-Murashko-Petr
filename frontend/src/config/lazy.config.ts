import { lazy } from 'react'

export const LAZY_COMPONENTS = {
    UserListPage: lazy(() => import('../pages/UserListPage')),
    UserDetailPage: lazy(() => import('../pages/UserDetailPage')),
    UserEditPage: lazy(() => import('../pages/UserEditPage')),
    UserCreatePage: lazy(() => import('../pages/UserCreatePage'))
} as const