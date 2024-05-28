import { useIsLoggedIn } from '../../utils/hooks'
import useTranslationHook from '../../hook/TranslationHook'
import { useProfile } from '../../hook/profile.hook'
import { FooterNav } from './FooterNav'
import { useLocation, useNavigate } from 'react-router-dom'
import { IconButtonAdd } from './IconButtonAdd'

const Footer = (): JSX.Element => {
  const { t } = useTranslationHook()
  const location = useLocation()
  const navigate = useNavigate()


  const goToPatient = (): void => {
    navigate('/patients/create')
  }
  const goToPrescription = (): void => {
    navigate('/prescriptions/create')
  }

  useProfile()

  return (
    <>
      {useIsLoggedIn() === true && (
        <div className="flex justify-around items-end h-16 ">
          <FooterNav location={location} text={t('text.home')} icon={['fas', 'home']} url='/home' />
          <FooterNav location={location} text={t('text.patients')} icon={['fas', 'users']} url='/patients' />

          <div className="relative">
            {location.pathname === '/patients' ? <IconButtonAdd location={location} onClick={goToPatient} icon={['fas', 'plus']} /> : 
            <IconButtonAdd location={location} onClick={goToPrescription} icon={['fas', 'plus']} />}
          </div>

          <FooterNav location={location} text={t('text.prescription')} icon={['fas', 'file-medical']} url='/prescriptions' />
          <FooterNav location={location} text={t('text.profile')} icon={['fas', 'user']} url='/setting' />

        </div>
      )}
    </>
  )
}

export default Footer
