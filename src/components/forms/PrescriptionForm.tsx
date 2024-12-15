import assert from 'assert'
import React, {
  FunctionComponent,
  useCallback,
  useContext,
  useState
} from 'react'
import { useNavigate } from 'react-router-dom'
import { FlashMessageContext, FlashMessageType } from '../../context/flashmessage'
import { TokenContext } from '../../context/token'
import {
  createPatient,
  createPrescription,
  updatePrescription,
  uploadPrescription
} from '../../services/api'
import { Patient, Prescription, defaultPatient } from '../../types'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { format } from 'date-fns'
import useTranslationHook from '../../hook/TranslationHook'
import usePatients from '../../hook/patient.hook'
import ModalAddPatient from '../modal/ModalAddPatient'
import { BACKEND_DATE_FORMAT, USER_DATE_FORMAT } from '../../services/constants'
import { InputFieldContainer } from './inputGroups/InputFieldContainer'
import { InputField } from './inputGroups/InputField'
import { SelectField } from './inputGroups/SelectField'
import { Button } from './inputGroups/Button'
import { Container } from '../home/Container'
import { validateFileType } from '../../utils/helpers'

interface PrescriptionFormRequiredProps {
  prescription: Prescription
  isEditForm: boolean
}
interface PrescriptionFormOptionalProps {
  patients?: Patient[]
}
interface PrescriptionFormProps
  extends PrescriptionFormRequiredProps,
  PrescriptionFormOptionalProps { }

const PrescriptionForm: FunctionComponent<PrescriptionFormProps> = ({
  prescription,
  isEditForm
}) => {
  const { token } = useContext(TokenContext)
  const [file, setFile] = useState<File>()
  const { addErrorMessage, addSuccessMessage } = useContext(FlashMessageContext)
  const { t } = useTranslationHook()
  const [addingNewPatient, setAddingNewPatient] = useState(false)
  const [patientState, setPatientState] = useState<Patient>(defaultPatient)
  const { patients, reloadPatients } = usePatients()
  const [newCreatedPatientId, setNewCreatedPatientId] = useState<null | number>(null)
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [imageLoadError, setImageLoadError] = useState<boolean>(false)
  const [fileType, setFileType] = useState<string | null>(null)

  const [prescriptionState, setPrescriptionState] =
    useState<Prescription>(prescription)

  const endDateValue: Date | null = prescription.end_date !== '' ? new Date(prescription.end_date) : null

  const [endDate, setEndDate] = useState<Date | null>(endDateValue)

  const updatePrescriptionDate = (date: Date, field: string): void => {
    const formattedDate = format(date, BACKEND_DATE_FORMAT)
    setPrescriptionState((prevState) => ({
      ...prevState,
      [field]: formattedDate
    }))
  }

  const onEndDateChange = (date: Date): void => {
    setEndDate(date)
    updatePrescriptionDate(date, 'end_date')
  }

  const navigate = useNavigate()

  const onFormSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault()
    isEditForm ? await handleSave() : await addPrescription()
  }

  const addPrescription = async (): Promise<void> => {
    await onCreatePrescription()
    navigate('/prescriptions')
    addSuccessMessage({ body: t('text.createdPrescription') })
  }

  const onCreatePrescription = async (): Promise<void> => {
    setLoading(true)
    assert(token)
    try {
      const prescriptionData = {
        ...prescriptionState,
        start_date: format(new Date(), BACKEND_DATE_FORMAT)
      }
      const data = await createPrescription(token, prescriptionData)
      if (file !== null && file !== undefined && file.type) {
        const isValidFileType = validateFileType(file)
        if (isValidFileType === false) throw new Error()
        await uploadPrescription(token, data.id, file)
      }
      setPrescriptionState(data)
    } catch (error) {
      console.error(error)
      setLoading(false)
      addErrorMessageCallback({ body: t('error.createdPrescription') })
    }
  }

  const addErrorMessageCallback = useCallback(
    (flashMessage: FlashMessageType) => addErrorMessage(flashMessage),
    [addErrorMessage]
  )

  const handleSave = async (): Promise<void> => {
    setLoading(true)
    assert(token)
    try {
      await updatePrescription(token, prescriptionState)
      if (file !== null && file !== undefined && file.type) {
          const isValidFileType = validateFileType(file)
          if (isValidFileType === false) throw new Error()
        await uploadPrescription(token, prescriptionState.id, file)
      }
      navigate('/prescriptions')
    } catch (error) {
      setLoading(false)
      addErrorMessageCallback({ body: t('error.updatedPrescription') })
    }
  }

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value, files } = event.target

    setPrescriptionState((prevState) => ({
      ...prevState,
      [name]: value
    }))

    if (files && files.length > 0 && files !== null && files !== undefined) {
      const selectedFile = files[0]
      const { name: fileName, type } = selectedFile
      const extension = fileName.split('.').pop()
      const newName = `ordonnance_${Date.now()}.${extension}`
      const newFile = new File([selectedFile], newName, { type })

      setFile(newFile)
      setFileType(type)

       // Use FileReader to create a data URL
       const reader = new FileReader();
       reader.onloadend = () => {
         const dataUrl = reader.result as string;
         setPreviewUrl(dataUrl);
         setImageLoadError(false);
       };
       reader.onerror = () => {
         setImageLoadError(true);
       };
       reader.readAsDataURL(selectedFile);

      // Update prescriptionState with the new file name
      setPrescriptionState((prevState) => ({
        ...prevState,
        photo_prescription: newName
      }))
    }
  }

  const onSelectChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const { name, value } = event.target
    setPrescriptionState({
      ...prescriptionState,
      [name]: value
    })
    if (name === 'patient' && value !== 'addNewPatient') {
      setNewCreatedPatientId(Number(value))
    }
    if (name === 'patient' && value === 'addNewPatient') {
      setAddingNewPatient(true)
      setPrescriptionState((prevState) => ({
        ...prevState,
        patient: patientState.id
      }))
    }
  }

  const handleNewPatientSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>): Promise<void> => {
    e.preventDefault()
    assert(token)
    const updatedPatientState = {
      ...patientState,
      birthday: patientState.birthday === '' ? null : patientState.birthday
    }
    try {
      const data = await createPatient(token, updatedPatientState)
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      reloadPatients()
      setAddingNewPatient(false)

      // Set the new created patient ID
      setNewCreatedPatientId(data?.id)

      // Update prescription with the new patient ID
      setPrescriptionState((prevState) => ({
        ...prevState,
        patient: data?.id
      }))
      addSuccessMessage({ body: t('text.createdPatient') })
    } catch (error) {
      console.error(error)
      setError(t('error.createdPatient'))
      addErrorMessageCallback({ body: t('error.createdPatient') })
    }
  }

  const handleChangeNewPatient = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = event.target
    setPatientState({ ...patientState, [name]: value })
  }

  const renderPreview = () => {
    if (!previewUrl) return null;

    if (fileType === 'application/pdf') {
      return (
        <div>
          <p>Fichier PDF sélectionné : {file?.name}</p>
          <p className="text-gray-700 text-xs mt-4">La fonctionnalité de lecture pdf en cours de travaux</p>
        </div>
      );
    } else if (fileType?.startsWith('image/')) {
      return (
        <>
        <img
          src={previewUrl}
          alt='preview'
          className='max-w-full h-96 rounded-lg shadow-md z-10'
          onError={() => setImageLoadError(true)}
        />
        </>
      );
    } else {
      return <p>Type de fichier non pris en charge : {fileType}</p>;
    }
  }

  return (
    <Container>
      <div className='min-h-screen flex flex-col'>
        <form className='space-y-4 mb-12' onSubmit={onFormSubmit}>
        <InputFieldContainer
          icon={['fas', 'user-doctor']}
          required
          label={t('form.doctor')}
        >
          <InputField
            name='firstname'
            placeholder={t('form.doctor')}
            value={prescriptionState.prescribing_doctor}
            onChange={onInputChange}
          />
        </InputFieldContainer>
        <InputFieldContainer
          icon={['fas', 'envelope']}
          label={t('form.email_doctor_cabinet')}
        >
          <InputField
            name='email_doctor'
            placeholder={t('form.email_doctor_cabinet')}
            value={prescriptionState.email_doctor}
            onChange={onInputChange}
          />
        </InputFieldContainer>
        <InputFieldContainer
          icon={['fas', 'calendar-alt']}
          required
          label={t('form.endDate')}
        >
            <DatePicker
              selected={endDate}
              onChange={onEndDateChange}
              dateFormat={USER_DATE_FORMAT}
              className="block flex-1 border-0 bg-transparent py-1.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6 w-full"
              wrapperClassName="h-full flex items-center"
              placeholderText={t('form.endDate')}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              dropdownMode='select'
            />
        </InputFieldContainer>
          {!isEditForm && (
             <InputFieldContainer
              icon={['fas', 'user-injured']}
              required
              label={t('form.selectPatient')}
            >
              <SelectField
                name='patient'
                value={newCreatedPatientId ?? ''}
                onChange={onSelectChange}
                patients={patients}
              />
            </InputFieldContainer>
          )}
          <InputField
            type='file'
            name='photo_prescription'
            placeholder={t('form.selectYourPrescription')}
            onChange={onInputChange}
            file={file?.name}
          />

          <Button isLoading={loading} type='submit'>
            {t('navigation.validate')}
          </Button>
        </form>
        {addingNewPatient && (
          <ModalAddPatient
            patientState={patientState}
            handleChangeNewPatient={handleChangeNewPatient}
            handleNewPatientSubmit={handleNewPatientSubmit}
            onHide={() => setAddingNewPatient(false)}
            show={addingNewPatient}
            error={error}
            loading={loading}
          />
        )}
        {previewUrl && (
          <div className=' max-w-xs mx-auto mt-2 mb-28 flex flex-col'>
            <h3 className='text-lg font-semibold mb-2'>Aperçu de l'ordonnance</h3>
            {renderPreview()}
            {imageLoadError && <p className="text-red-500 mt-2">Erreur de chargement du fichier</p>}
          </div>
        )}
      </div>
    </Container>
  )
}

export default PrescriptionForm
