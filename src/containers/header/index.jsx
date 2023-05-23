import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Spacer, UserImage } from '@ynput/ayon-react-components'

import Breadcrumbs from './breadcrumbs'
import HeaderButton from './HeaderButton'
import UserMenu from './userMenu'
import ProjectMenu from './projectMenu'
import { useSelector } from 'react-redux'

const Header = () => {
  const [projectMenuVisible, setProjectMenuVisible] = useState(false)
  const [userMenuVisible, setUserMenuVisible] = useState(false)
  const location = useLocation()
  // get user from redux store
  const user = useSelector((state) => state.user)

  // Hide sidebars when location changes
  useEffect(() => {
    setProjectMenuVisible(false)
    setUserMenuVisible(false)
  }, [location.pathname])

  return (
    <nav className="primary">
      <ProjectMenu visible={projectMenuVisible} onHide={() => setProjectMenuVisible(false)} />
      <UserMenu visible={userMenuVisible} onHide={() => setUserMenuVisible(false)} />

      <HeaderButton
        icon="event_list"
        label="Projects"
        onClick={() => setProjectMenuVisible(true)}
        style={{
          alignItems: 'center',
          display: 'flex',
        }}
      />

      <Spacer>
        <Breadcrumbs />
      </Spacer>
      <HeaderButton icon="apps" onClick={() => setUserMenuVisible(true)} />
      <Link to="/profile">
        <HeaderButton>
          <UserImage size={26} src={user?.attrib?.avatarUrl} fullName={user?.attrib?.fullName} />
        </HeaderButton>
      </Link>
    </nav>
  )
}

export default Header
