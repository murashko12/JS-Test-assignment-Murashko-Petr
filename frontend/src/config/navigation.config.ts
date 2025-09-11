import { ROUTES } from './routes.config'
import { UserAddOutlined, UserOutlined } from '@ant-design/icons'

export const NAVIGATION_ITEMS = [
    {
        key: ROUTES.HOME,
        label: 'Пользователи',
        icon: UserOutlined
    },
    {
        key: ROUTES.USER.CREATE,
        label: 'Добавить пользователя',
        icon: UserAddOutlined
    }
] as const

export const BREADCRUMB_CONFIG = {
    [ROUTES.HOME]: ['Пользователи'],
    [ROUTES.USER.CREATE]: ['Пользователи', 'Добавление'],
    ':id': (id: string) => ['Пользователи', `Пользователь ${id}`],
    ':id/edit': (id: string) => ['Пользователи', `Пользователь ${id}`, 'Редактирование']
} as const
