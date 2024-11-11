import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TokenContext } from '../../context/token'
import useTranslationHook from '../../hook/TranslationHook'
import { login } from '../../services/api'
import { setTokenLocalStorage } from '../../utils/helpers'
import { FlashMessageContext } from '../../context/flashmessage'
import { InputFieldContainer } from './inputGroups/InputFieldContainer'
import { Button } from './inputGroups/Button'
import { useForm } from 'react-hook-form'
import { AuthFormType } from '../../types'
import { resolver } from './validations/ValidationAuth'
import { Input } from './inputGroups/Input'

const LoginForm = (): JSX.Element => {
  const { setToken } = useContext(TokenContext)
  const { addSuccessMessage } = useContext(FlashMessageContext)
  const navigate = useNavigate()
  const { t } = useTranslationHook()
  const [loading, setLoading] = useState<boolean>(false)
  const {register, formState: {errors} , handleSubmit, setError} = useForm<AuthFormType>({resolver})

  const onLogin = async (data: AuthFormType): Promise<void> => {
    setLoading(true)
    const {email, password} = data;
    try {
      const response = await login(email.toLowerCase(), password)
      const { token } = response
      setTokenLocalStorage(token)
      setToken(token)
      navigate('/home')
      addSuccessMessage({ body: t('text.userLogin') })
    } catch (error: any) {
      if (error.response?.status === 400) {
        setError('password', { message: t('error.invalidCredentials') })
        setError('email', { message: t('error.invalidCredentials') })
      }
      setLoading(false)
    }
  }

  return (
    <form className='mt-1 p-1 space-y-4 ' onSubmit={handleSubmit(onLogin)}>
      <InputFieldContainer icon={['fas', 'user']}>
       <Input
          type='email'
          register={register}
          id='email'
          placeholder={t('form.emailAddress')}
          disabled={loading}
        />
      </InputFieldContainer>
      {errors?.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}

      <InputFieldContainer icon={['fas', 'lock']}>
       <Input
          type='password'
          register={register}
          id='password'
          placeholder={t('form.password')}
          disabled={loading}
        />
      </InputFieldContainer>
      {errors?.password && <p className='text-red-500 text-sm'>{errors.password.message}</p>}

      <Button isLoading={loading} size='medium' type='submit'>
        {t('navigation.login')}
      </Button>
    </form>
  )
}

export default LoginForm
