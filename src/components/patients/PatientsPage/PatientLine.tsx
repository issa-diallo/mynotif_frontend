import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Patient } from '../../../types'
import { FunctionComponent } from 'react'
import { useNavigate } from 'react-router-dom'

interface PatientLineProps {
  patient: Patient
}

const PatientLine: FunctionComponent<PatientLineProps> = ({ patient }) => {
  const navigate = useNavigate()

  const goToPatient = (): void => {
    navigate(`/patients/${patient.id}`)
  }

  const capitalizeFirstLetter = (name: string): string =>
    name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()

  return (
      <div onClick={goToPatient} className='bg-white shadow rounded-lg p-4 mb-4 flex items-center space-x-4'>
        <div className='flex items-center space-x-4 mb-2'>
          <div className='bg-colorsecondary rounded-full w-10 h-10 flex items-center justify-center '>
            <FontAwesomeIcon icon={['fas', 'id-badge']} className='text-colorprimary text-xs' />
          </div>
          <div>
            <h3 className='font-semibold'>{capitalizeFirstLetter(patient.lastname)} {capitalizeFirstLetter(patient.firstname)}</h3>
          </div>
        </div>
        <div className='mb-4' />
      </div>

  )
}

export default PatientLine
