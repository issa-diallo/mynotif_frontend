import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import clsx from "clsx"

// InputFieldContainer.tsx
interface InputFieldContainerProps {
  children: React.ReactNode
  icon?: IconProp | 'default-icon'
  disabled?: boolean
  className?: string
  required?: boolean
  label?: string
}

export const InputFieldContainer = ({ 
  children,
  icon = 'default-icon' as IconProp,
  disabled,
  className,
  required,
  label,
}: InputFieldContainerProps): JSX.Element => (
  <div className="sm:col-span-4">
    {label && (
      <label className="block text-sm/6 font-medium">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
    )}
    <div className="mt-2">
      <div
        className={clsx(
          'flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset',
          disabled && 'opacity-60 bg-gray-100 cursor-not-allowed',
          className,
        )}
      >
        {icon !== 'default-icon' && (
          <span className="flex select-none items-center w-10 h-10 pl-3 text-colorprimary bg-colorsecondary">
            <FontAwesomeIcon
              icon={icon}
              className="h-4 w-4"
            />
          </span>
        )}
        {children}
      </div>
    </div>
  </div>
)

