import React, { useContext, useEffect, useState } from 'react'
import { Button } from './inputGroups/Button'
import { InputFieldContainer } from './inputGroups/InputFieldContainer'
import { Input } from './inputGroups/Input'
import { useForm } from 'react-hook-form'
import FormFieldError from '../FormFieldError'
import { Profile } from '../../types'
import useTranslationHook from '../../hook/TranslationHook'
import { useNavigate } from 'react-router-dom'
import assert from 'assert'
import { TokenContext } from '../../context/token'
import { updateUser } from '../../services/api'
import { ProfileContext } from '../../context/profile'
import { FlashMessageType } from '../../context/flashmessage'
import { Container } from '../home/Container'
import { resolver } from './validations/ValidationProfile'

interface ProfileFormProps {
  profile: Profile
  addErrorMessageCallback: (flashMessage: FlashMessageType) => void
}

export const ProfileForm = ({ profile, addErrorMessageCallback }: ProfileFormProps): JSX.Element => {
  const { token } = useContext(TokenContext)
  const { setProfile: setProfileContext } = useContext(ProfileContext)
  const { t } = useTranslationHook()
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors }, setValue, setError } = useForm<Profile>({resolver})
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    if (profile.email !== '') {
      setValue('email', profile.email)
      setValue('first_name', profile.first_name)
      setValue('last_name', profile.last_name)
    }
  }, [profile, setValue])

  const handleProfile = async (data: Profile): Promise<void> => {
    setLoading(true)
    assert(token)
    const { email } = data

    try {
      const response = await updateUser(token, {...data, email: email.toLowerCase()})
      setProfileContext(response)
      navigate('/profile')
    } catch (error: any) {
      if (error.response?.status === 400) {
        setError('last_name', { message: t('error.invalidCredentials') })
        setError('first_name', { message: t('error.invalidCredentials') })
        setError('email', { message: t('error.invalidCredentials') })
      }
      setLoading(false)
    }
  }

  return (
    <Container>
      <div className='bg-gray-50 min-h-screen flex flex-col'>
        <form className='space-y-4 ' onSubmit={handleSubmit(handleProfile)}>
          <InputFieldContainer
            icon={['fas', 'envelope']}
            label={t('form.emailAddress')}
            required
          >
            <Input
              type='email'
              register={register}
              id='email'
              placeholder='contact@ordopro.fr'
              disabled
            />
          </InputFieldContainer>
          <FormFieldError errorMessage={errors.email?.message} />
          <InputFieldContainer
            icon={['fas', 'user']}
            label={t('form.firstName')}
            required
          >
            <Input
              type='text'
              register={register}
              id='first_name'
              placeholder={t('form.firstName')}
              disabled={loading}
            />
          </InputFieldContainer>
          <FormFieldError errorMessage={errors.first_name?.message} />
          <InputFieldContainer
          icon={['fas', 'user']}
          label={t('form.lastName')}
          required
          >
            <Input
              type='text'
              register={register}
              id='last_name'
              placeholder={t('form.lastName')}
              disabled={loading}
            />
          </InputFieldContainer>
          <FormFieldError errorMessage={errors.last_name?.message} />
          <Button isLoading={loading} type='submit'>
            {t('navigation.validate')}
          </Button>
        </form>
      </div>
    </Container>
  )
}
