import { useLocation } from 'react-router-dom'

export interface BreadcrumbItem {
  title: string
  href?: string
}

export const useBreadcrumb = (): BreadcrumbItem[] => {
  const location = useLocation()
  const pathParts = location.pathname.split('/').filter(Boolean)

  const breadcrumbs: BreadcrumbItem[] = []

  // Всегда добавляем корневой элемент
  if (location.pathname === '/') {
    breadcrumbs.push({ title: 'Пользователи' })
  } else {
    breadcrumbs.push({ title: 'Пользователи', href: '/' })
  }

  // Обрабатываем остальные части пути
  if (pathParts.length > 0) {
    if (pathParts[0] === 'test') {
      breadcrumbs.push({ title: 'Добавить пользователя' })
    } 
    else if (!isNaN(Number(pathParts[0]))) {
      // ID пользователя
      breadcrumbs.push({ 
        title: `Пользователь ${pathParts[0]}`, 
        href: pathParts.length > 1 ? `/${pathParts[0]}` : undefined 
      })

      // Действия (edit/add)
      if (pathParts.length > 1) {
        if (pathParts[1] === 'edit') {
          breadcrumbs.push({ title: 'Редактирование' })
        } else if (pathParts[1] === 'add') {
          breadcrumbs.push({ title: 'Добавление' })
        }
      }
    }
  }

  return breadcrumbs
}