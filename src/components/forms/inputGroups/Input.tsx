import clsx from "clsx"

interface InputProps {
  placeholder?: string
  type?: 'text' | 'email' | 'password'
  register: any
  disabled?: boolean
  id: string
  className?: string
}

export const Input = ({
  placeholder,
  type = 'text',
  register,
  disabled,
  id,
  className
}: InputProps): JSX.Element => {
  return (
    <input
      {...register(id)}
      placeholder={placeholder}
      type={type}
      name={id}
      id={id}
      autoComplete={id}
      disabled={disabled}
      className={clsx(
        "block flex-1 border-0 bg-transparent py-1.5 pl-3 pr-3",
        "text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6",
        disabled
        ? "cursor-not-allowed bg-gray-200 text-gray-500"
        : "bg-white text-gray-900",
        className
      )}
    />
  )
}