import { Toolbar } from '@ynput/ayon-react-components'
import styled from 'styled-components'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: var(--base-gap-large);
`

export const Header = styled(Toolbar)``
export const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  gap: var(--base-gap-small);
`

export const ViewerWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Image = styled.img`
  min-width: 300px;
  min-height: 300px;
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
  object-fit: contain;
`

export const ReviewDetailsPanelWrapper = styled.div`
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  max-width: clamp(460px, 25vw, 600px);
  min-width: clamp(460px, 25vw, 600px);
  position: relative;
`
