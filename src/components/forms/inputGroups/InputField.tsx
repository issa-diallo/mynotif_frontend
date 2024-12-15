interface InputFieldProps {
  value?: string | number
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  placeholder: string
  type?: string
  name: string
  file?: string
  id?: string
}

export const InputField = ({ value, onChange, placeholder, type = 'text', name, file, id }: InputFieldProps): JSX.Element => (
  <>
    {type === 'file' ? (
    <>
    <div className="col-span-full">
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
        <div className="text-center">
          <svg 
            className="mx-auto h-12 w-12 text-gray-300"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path 
              fillRule="evenodd"
              d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z"
              clipRule="evenodd"
            />
          </svg>
          <div className="mt-4 flex flex-col items-center text-sm text-gray-600">
            <label
              htmlFor="fileInput"
              className="relative cursor-pointer rounded-md bg-white font-semibold text-colorprimary focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
            >
              <span>{file ? file : "Capture l'ordonnance"}</span>
              <input
                className="sr-only"
                name={name}
                type={type}
                id="fileInput"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
              />
            </label>
            <p className="text-xs text-gray-600 mt-2">PNG, JPG, GIF jusqu'à 10MB</p>
          </div>
        </div>
      </div>
    </div>
  </>
    ) : (
      <input
      id={id}
      className="block flex-1 border-0 bg-transparent py-1.5 pl-2 pr-2 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm/6"
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      autoComplete={name}
    />
    )}
  </>
)
