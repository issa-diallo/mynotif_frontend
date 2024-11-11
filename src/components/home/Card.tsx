import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

interface CardProps {
  count: number
  title: string
  onClick: () => void
}

export const Card = ({ count, title, onClick }: CardProps): JSX.Element => (
  <div className='bg-colorprimary text-white rounded-lg p-4 shadow flex justify-between items-center'>
    <div>
      <h2 className='text-2xl font-bold'>{count}</h2>
      <p className='text-sm'>{title}</p>
    </div>
    {/* <div className='bg-white rounded-full w-10 h-10 flex items-center justify-center' onClick={onClick}>
      <FontAwesomeIcon icon={['fas', 'chevron-right']} className='text-black text-xl' />
    </div> */}
  </div>
)
