import ExistingReactions from "./ExistingReactions"
import ReactionPanelOpener from "./ReactionPanelOpener"
import * as Styled from './Reactions.styled'
import { Reaction } from "./types"

type Props = {
  reactions: Reaction[]
  changeHandler: (reaction: Reaction) => void
}

const Reactions = ({
  reactions,
  changeHandler,
}: Props) => {
  return (
    <Styled.ReactionsWrapper>
      <ReactionPanelOpener
        reactions={reactions}
        changeHandler={changeHandler}
      />
      <ExistingReactions reactions={reactions} changeHandler={changeHandler} />
    </Styled.ReactionsWrapper>
  )
}

export default Reactions