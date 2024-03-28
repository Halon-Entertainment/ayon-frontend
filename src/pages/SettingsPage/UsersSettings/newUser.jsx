import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Button, Panel, SaveButton, Section, UserImage } from '@ynput/ayon-react-components'
import ProjectList from '/src/containers/projectList'
import { useAddUserMutation } from '/src/services/user/updateUser'
import ayonClient from '/src/ayon'
import UserAttribForm from './UserAttribForm'
import UserAccessForm from './UserAccessForm'
import DetailHeader from '/src/components/DetailHeader'
import { PanelButtonsStyled } from './userDetail'
import styled from 'styled-components'

const SectionStyled = styled(Section)`
  & > div {
    :first-child {
      border-top: 2px solid var(--md-sys-color-tertiary-fixed-dim);
    }
    :last-child {
      border-bottom: 2px solid var(--md-sys-color-tertiary-fixed-dim);
    }
  }
`

const NewUser = ({ onHide, open, onSuccess }) => {
  const [selectedProjects, setSelectedProjects] = useState(null)
  const [addedUsers, setAddedUsers] = useState([])
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [formData, setFormData] = useState({
    userLevel: 'user',
    userActive: true,
    UserImage: '',
  })

  const initialFormData = () => {
    return {
      userLevel: 'user',
      userActive: true,
      UserImage: '',
    }
  }
  useEffect(() => {
    // set initial form data
    setFormData(initialFormData())
  }, [])

  const [addUser, { isLoading: isCreatingUser }] = useAddUserMutation()

  const attributes = ayonClient.getAttribsByScope('user')

  const handleSubmit = async () => {
    const payload = {}
    if (!formData.Username) {
      toast.error('Login name must be provided')
      return
    }

    // check passwords are the same
    if (password !== passwordConfirm) {
      toast.error('Passwords do not match')
      return
    }

    if (password) payload.password = password

    payload.attrib = {}
    payload.data = {}
    if (formData.isGuest) payload.data.isGuest = true
    attributes.forEach(({ name }) => {
      if (formData[name]) payload.attrib[name] = formData[name]
    })

    if (formData.userLevel === 'admin') payload.data.isAdmin = true
    else if (formData.userLevel === 'manager') payload.data.isManager = true
    else if (formData.userLevel === 'service') payload.data.isService = true
    else {
      payload.data.defaultAccessGroups = formData.defaultAccessGroups || []
      if (selectedProjects) {
        const accessGroups = {}
        for (const projectName of selectedProjects)
          accessGroups[projectName] = payload.data.defaultAccessGroups
        payload.data.accessGroups = accessGroups
      }
    }

    payload.name = formData.Username

    try {
      await addUser({ name: formData.Username, user: payload }).unwrap()

      toast.success('User created')
      // set added users to be used for auto selection onHide
      setAddedUsers([...addedUsers, formData.Username])
      // keep re-usable data in the form
      setPassword('')
      setPasswordConfirm('')
      setFormData((fd) => {
        return { accessGroups: fd.accessGroups, userLevel: fd.userLevel }
      })

      onSuccess && onSuccess(formData.Username)
      onHide([formData.Username])
    } catch (error) {
      console.error(error)
      toast.error(`Unable to create user: ${error.detail}`)
    }
  }

  const handleCancel = () => {
    // clear all forms
    setFormData(initialFormData())
    setPassword('')
    setPasswordConfirm('')
  }

  const handleClose = () => {
    // clear all forms
    setFormData(initialFormData())
    setPassword('')
    setPasswordConfirm('')
    // reset added users
    setAddedUsers([])
    // close the dialog
    onHide(addedUsers)
  }

  // When hide the dialog here so that state is maintained
  // even when the dialog is closed
  if (!open) return null

  return (
    <SectionStyled wrap style={{ gap: 4, maxHeight: '100%', bottom: 'unset' }}>
      <DetailHeader onClose={handleClose}>
        <UserImage
          src={formData?.avatarUrl}
          name={formData.Username}
          fullName={formData.fullName || '+'}
        />
        <div>
          <h2>Create New User</h2>
          <span style={{ opacity: addedUsers.length ? 1 : 0 }}>
            Previously Created: {addedUsers.join(', ')}
          </span>
        </div>
      </DetailHeader>
      <Section style={{ overflow: 'auto', gap: 4 }}>
        <Panel>
          <UserAttribForm
            formData={formData}
            setFormData={setFormData}
            attributes={[
              {
                name: 'Username',
                data: { title: 'Username' },
                input: { placeholder: 'No spaces allowed' },
              },
              { name: 'password', data: { title: 'Password' } },
              { name: 'passwordConfirm', data: { title: 'Password Confirm' } },
              ...attributes,
            ]}
            {...{ password, setPassword, passwordConfirm, setPasswordConfirm }}
          />
        </Panel>
        <Panel>
          <UserAccessForm formData={formData} setFormData={setFormData} isNew />
        </Panel>
        {formData.userLevel === 'user' && (
          <Panel>
            <span style={{ margin: '8px 0' }}>
              <b>Apply default access groups to:</b>
            </span>
            <ProjectList
              selection={selectedProjects}
              onSelect={setSelectedProjects}
              multiselect={true}
              styleSection={{ maxWidth: 'unset' }}
            />
          </Panel>
        )}
      </Section>
      <PanelButtonsStyled>
        <Button onClick={handleCancel} label="Clear" icon="clear" />
        <SaveButton
          onClick={handleSubmit}
          label="Create New User"
          active={formData.Username}
          saving={isCreatingUser}
        />
      </PanelButtonsStyled>
    </SectionStyled>
  )
}

export default NewUser
