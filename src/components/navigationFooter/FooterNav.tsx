import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import clsx from 'clsx'
import { Link } from 'react-router-dom'

interface FooterNavProps {
  text: string
  icon: any
  url: string
  location: any
}

export const FooterNav = ({text, icon, url, location}: FooterNavProps): JSX.Element => {
  const highlightOnPathname = (pathname: string): string => location.pathname === pathname ? 'text-colorprimary' : ''
  return (
    <Link to={url} className={clsx(`flex flex-col items-center ${highlightOnPathname(url)}`)}>
      <FontAwesomeIcon icon={icon} className='text-sm' />
      <span className="mt-1 text-sm">{text}</span>
    </Link>
  )
}
