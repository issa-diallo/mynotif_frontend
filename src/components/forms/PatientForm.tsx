import { strict as assert } from 'assert'
import { FunctionComponent, useState, useContext, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { Patient } from '../../types'
import { TokenContext } from '../../context/token'
import { FlashMessageContext, FlashMessageType } from '../../context/flashmessage'
import useTranslationHook from '../../hook/TranslationHook'
import { createPatient, updatePatient } from '../../services/api'
import DatePicker from 'react-datepicker'
import { BACKEND_DATE_FORMAT, USER_DATE_FORMAT } from '../../services/constants'
import { InputFieldContainer } from './inputGroups/InputFieldContainer'
import { InputField } from './inputGroups/InputField'
import { Button } from './inputGroups/Button'
import { Container } from '../home/Container'

interface PatientFormProps {
  patient: Patient
  isEditForm: boolean
}

const PatientForm: FunctionComponent<PatientFormProps> = ({ patient, isEditForm }) => {
  const { token } = useContext(TokenContext)
  const { addErrorMessage, addSuccessMessage } = useContext(FlashMessageContext)
  const [patientState, setPatientState] = useState<Patient>(patient)
  const { t } = useTranslationHook()
  const navigate = useNavigate()
  const [loading, setLoading] = useState<boolean>(false)

  const birthdayDateValue: Date | null = patient.birthday !== null && patient.birthday !== undefined && patient.birthday !== '' ? new Date(patient.birthday) : null
  const [birthdayDate, setBirthdayDate] = useState<Date | null>(birthdayDateValue)

  const onBirthdayChange = (date: Date): void => {
    setBirthdayDate(date)
    updatePatientDate(date, 'birthday')
  }

  const updatePatientDate = (date: Date, field: string): void => {
    const formattedDate = format(date, BACKEND_DATE_FORMAT)
    setPatientState((prevState) => ({
      ...prevState,
      [field]: formattedDate
    }))
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setPatientState({ ...patientState, [name]: value })
  }

  const addErrorMessageCallback = useCallback(
    (flashMessage: FlashMessageType) => addErrorMessage(flashMessage),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const onUpdate = async (): Promise<void> => {
    assert(token)
    try {
      await updatePatient(token, patientState)
      setLoading(true)
    } catch (error) {
      console.error(error)
      setLoading(false)
      addErrorMessageCallback({ body: t('error.updatedPatient') })
    }
  }

  const onCreatePatient = async (): Promise<void> => {
    assert(token)
    try {
      const data = await createPatient(token, patientState)
      setPatientState(data)
      setLoading(true)
    } catch (error) {
      console.error(error)
      setLoading(false)
      addErrorMessageCallback({ body: t('error.createdPatient') })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    isEditForm ? await editPatient() : await addPatient()
  }

  const addPatient = async (): Promise<void> => {
    await onCreatePatient()
    navigate('/patients')
    addSuccessMessage({ body: t('text.createdPatient') })
  }

  const editPatient = async (): Promise<void> => {
    await onUpdate()
    navigate(`/patients/${patient.id}`)
    addSuccessMessage({ body: t('text.updatedPatient') })
  }

  return (
    <Container>
      <div className='min-h-screen flex flex-col'>
        <form className='space-y-4 mb-24' onSubmit={handleSubmit}>
          <InputFieldContainer icon={['fas', 'user']} label={t('form.firstName')} required>
            <InputField
              name='firstname'
              placeholder={t('form.firstName')}
              value={patientState.firstname}
              onChange={handleChange}
            />
          </InputFieldContainer>
          <InputFieldContainer icon={['fas', 'user']} label={t('form.lastName')} required>
            <InputField
              name='lastname'
              placeholder={t('form.lastName')}
              value={patientState.lastname}
              onChange={handleChange}
            />
          </InputFieldContainer>
          <InputFieldContainer icon={['fas', 'calendar-alt']} label={t('form.birthday')}>
          <DatePicker
            selected={birthdayDate}
            onChange={onBirthdayChange}
            dateFormat={USER_DATE_FORMAT}
            className="block flex-1 border-0 bg-transparent py-1.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6 w-full"
            wrapperClassName="h-full flex items-center"
            placeholderText={t('form.birthday')}
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            dropdownMode='select'
          />
          </InputFieldContainer>
          <InputFieldContainer icon={['fas', 'city']} label={t('form.city')}>
            <InputField
              name='city'
              placeholder={t('form.city')}
              value={patientState.city}
              onChange={handleChange}
            />
          </InputFieldContainer>
          <InputFieldContainer icon={['fas', 'address-card']} label={t('form.address')}>
            <InputField
              name='street'
              placeholder={t('form.address')}
              value={patientState.street}
              onChange={handleChange}
            />
          </InputFieldContainer>
          <InputFieldContainer icon={['fas', 'phone']} label={t('form.phone')}>
            <InputField
              name='phone'
              placeholder={t('form.phone')}
              value={patientState.phone}
              onChange={handleChange}
            />
          </InputFieldContainer>
          <InputFieldContainer icon={['fas', 'city']} label={t('form.city')}>
            <InputField
              name='zip_code'
              placeholder={t('form.zipPostal')}
              value={patientState.zip_code}
              onChange={handleChange}
            />
          </InputFieldContainer>
          <InputFieldContainer icon={['fas', 'id-card']} label={t('form.carteVitale')}>
            <InputField
              name='health_card_number'
              placeholder={t('form.carteVitale')}
              value={patientState.health_card_number}
              onChange={handleChange}
            />
          </InputFieldContainer>
          <InputFieldContainer icon={['fas', 'id-card']} label={t('form.caisseDeRattachement')}>
            <InputField
              name='ss_provider_code'
              placeholder={t('form.caisseDeRattachement')}
              value={patientState.ss_provider_code}
              onChange={handleChange}
            />
          </InputFieldContainer>
          <Button variant='accent' isLoading={loading} type='submit'>
            {t('navigation.validate')}
          </Button>
        </form>
      </div>
    </Container>
  )
}

export default PatientForm
