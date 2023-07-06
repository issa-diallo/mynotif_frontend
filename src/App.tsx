import 'bootstrap/dist/css/bootstrap.min.css'
import { Container } from 'react-bootstrap'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'
import { TokenContextProvider } from './context/token'
import { ErrorContextProvider } from './context/error'
import { ProfileContextProvider } from './context/profile'
import Header from './components/Header'
import Errors from './components/Errors'
import PatientsPage from './pages/PatientsPage'
import PrescriptionsPage from './pages/PrescriptionsPage'
import PrescriptionEdit from './pages/PrescriptionEdit'
import ProfilePage from './pages/ProfilePage'
import PatientDetail from './pages/PatientDetail'
import PageNotFound from './pages/PageNotFound'
import PatientEdit from './pages/PatientEdit'
import PatientCreatePage from './pages/PatientCreatePage'
import PrivateRoute from './components/PrivateRoute'
import PrescriptionCreatePage from './pages/PrescriptionCreatePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import AccountPage from './pages/AccountPage'
import './App.css'
import ResetPassword from './pages/ResetPassword'
import NewResetPassword from './pages/NewResetPassword'

library.add(fas, fab, far)

function App (): JSX.Element {
  return (
    <div className='App'>
      <BrowserRouter>
        <TokenContextProvider>
          <ProfileContextProvider>
            <ErrorContextProvider>
              <Header />
              <Container className='mb-5 pb-5'>
                <Errors />
                <Routes>
                  <Route path='*' element={<PageNotFound />} />
                  <Route path='/' element={<Navigate to='/login' />} />
                  <Route path='/login' element={<LoginPage />} />
                  <Route path='/register' element={<RegisterPage />} />
                  <Route path='/reset/password' element={<ResetPassword />} />
                  <Route path='/reset/password/:uid/:token' element={<NewResetPassword />} />
                  <Route element={<PrivateRoute />}>
                    {/* Account */}
                    <Route path='/account/profile' element={<ProfilePage />} />
                    <Route path='/account' element={<AccountPage />} />
                    {/* Patients */}
                    <Route path='/patients' element={<PatientsPage />} />
                    <Route
                      path='/patients/create'
                      element={<PatientCreatePage />}
                    />
                    <Route
                      path='/patients/edit/:id'
                      element={<PatientEdit />}
                    />
                    <Route path='/patients/:id' element={<PatientDetail />} />
                    {/* Prescriptions */}
                    <Route
                      path='/prescriptions'
                      element={<PrescriptionsPage />}
                    />
                    <Route
                      path='/prescriptions/:id'
                      element={<PrescriptionEdit />}
                    />
                    <Route
                      path='/prescriptions/create'
                      element={<PrescriptionCreatePage />}
                    />
                  </Route>
                </Routes>
              </Container>
            </ErrorContextProvider>
          </ProfileContextProvider>
        </TokenContextProvider>
      </BrowserRouter>
    </div>
  )
}

export default App
