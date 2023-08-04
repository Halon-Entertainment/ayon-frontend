import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  height: 100%;
`

export const Form = styled.form`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 300px;
  width: 100%;
  gap: 8px;

  h1 {
    font-size: 24px;
  }

  & > div {
    width: 100%;
  }

  .save {
    margin-left: auto;
    margin-top: 8px;
  }

  input:invalid {
    border-color: var(--color-grey-03);
  }
`

export const FormRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;

  input {
    width: 100%;
  }
`

export const Error = styled.span`
  color: var(--color-hl-error);

  position: absolute;
  bottom: 16px;
`
