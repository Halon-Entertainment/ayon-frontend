import { UserImage } from '@ynput/ayon-react-components'
import * as Styled from './FeedReferencePopup.styled'
import Thumbnail from '/src/containers/thumbnail'

const FeedReferencePopup = ({ type, label, pos = {} }) => {
  // TODO: get data from id and type
  // TODO: See if label contain fullName or name and passed props down correcty in UserImage
  return (
    <Styled.Popup style={pos || {}}>
      {type === 'user' ? (
        <UserImage src={''} name={label} />
      ) : (
        <Thumbnail entityType={type} icon="directions_run" />
      )}
      <Styled.Content>
        <span>{type === 'user' ? label : 'ShotName'}</span>
        <span className={'label'}>{type === 'user' ? 'user name' : label}</span>
      </Styled.Content>
    </Styled.Popup>
  )
}

export default FeedReferencePopup
