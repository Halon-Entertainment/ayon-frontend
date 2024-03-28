import * as Styled from './UserMenu.styled'
import { UserImage } from '@ynput/ayon-react-components'
import Font from '/src/theme/typography.module.css'
import { NavLink } from 'react-router-dom'

const UserMenuHeader = ({ user, fullName }) => {
  return (
    <Styled.Header>
      <UserImage size={30} src={user?.attrib?.avatarUrl} name={user?.name} fullName={fullName} />
      <Styled.Details className={Font.titleSmall}>
        <span>{user?.name}</span>
        {fullName ? (
          <span>{fullName}</span>
        ) : (
          <NavLink to="/account/profile">
            <span className={'error'}>Set Full Name</span>
          </NavLink>
        )}
      </Styled.Details>
    </Styled.Header>
  )
}

export default UserMenuHeader
