import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Patient } from '../../types'
import clsx from 'clsx'

interface PatientCardProps {
  patient: Patient
  onClick?: () => void
  className?: string
}

export const PatientCard = ({ patient, onClick, className }: PatientCardProps): JSX.Element => {
  const { firstname, lastname } = patient
  const fullName = `${firstname} ${lastname}`
  return (
    <div onClick={onClick} className='bg-white shadow rounded-lg p-4 mb-4 flex items-center space-x-4'>
      <div className='flex items-center space-x-4 mb-2'>
        <div className={clsx(className, ' rounded-full w-10 h-10 flex items-center justify-center ')}>
          <FontAwesomeIcon icon={['fas', 'user']} className={clsx(className, 'text-xs')} />
        </div>
        <div>
          <h3 className={clsx('font-semibold text-sm')}>{fullName}</h3>
        </div>
      </div>
    </div>
  )
}
