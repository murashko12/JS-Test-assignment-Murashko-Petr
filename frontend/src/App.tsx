import { Route, Routes } from "react-router-dom"
import { Suspense } from "react"
import AppLayout from "./layouts/AppLayout"
import Loader from "./components/UI/Loader"
import { ROUTES, LAZY_COMPONENTS } from "./config"
import { Provider } from 'react-redux'
import { store } from './store/store'

const { UserListPage, UserDetailPage, UserEditPage, UserCreatePage } = LAZY_COMPONENTS

function App() {
  return (
    <Provider store={store}>
      <AppLayout>
        <Suspense fallback={<Loader />}>
          <Routes>
            <Route path={ROUTES.HOME} element={<UserListPage />} />
            <Route path={ROUTES.USER.DETAIL(':id')} element={<UserDetailPage />} />
            <Route path={ROUTES.USER.EDIT(':id')} element={<UserEditPage />} />
            <Route path={ROUTES.USER.CREATE} element={<UserCreatePage />} />
          </Routes>
        </Suspense>
      </AppLayout>
    </Provider>
  )
}

export default App