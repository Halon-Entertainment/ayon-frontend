import axios from 'axios'
import { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { InputText } from '@ynput/ayon-react-components'
import HeaderButton from './HeaderButton'

import {
  setFocusedFolders,
  setFocusedProducts,
  setFocusedVersions,
  setFocusedRepresentations,
  setFocusedTasks,
  setFocusedWorkfiles,
  setUri,
  setUriChanged,
} from '/src/features/context'

import styled from 'styled-components'

const Crumbtainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;

  ul {
    cursor: pointer;
    list-style: none;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    margin: 0;
    padding: 0;

    & > li {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4em;

      &:not(:last-child) {
        &::after {
          margin: 0 5px;
          content: '/';
        }
      }
    }
  }
`

const uri2crumbs = (uri) => {
  if (!uri) return []

  // parse uri to path and query params

  const [path, query] = uri.split('://')[1].split('?')
  const crumbs = path.split('/').filter((crumb) => crumb)
  const qp = {}

  if (query) {
    const params = query.split('&')
    for (const param of params) {
      const [key, value] = param.split('=')
      qp[key] = value
    }
  }

  for (const level of ['product', 'task', 'workfile', 'version', 'representation']) {
    if (qp[level]) {
      crumbs.push(qp[level])
    }
  }

  return crumbs
}

const UriEditor = ({ uri, setUri, onAccept, onCopy }) => {
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current.focus()
    inputRef.current.select()
  }, [])

  const onBlur = () => {
    setTimeout(() => {
      onAccept()
    }, 200)
  }

  return (
    <Crumbtainer onBlur={onBlur}>
      <InputText
        ref={inputRef}
        value={uri}
        onChange={(e) => setUri(e.target.value)}
        style={{ width: 800 }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') onAccept()
        }}
        onBlur={(e) => e.preventDefault()}
      />
      <HeaderButton
        onClick={onAccept}
        icon="my_location"
        onBlur={(e) => {
          e.preventDefault()
        }}
      />
      <HeaderButton
        onClick={onCopy}
        icon="content_copy"
        onBlur={(e) => {
          e.preventDefault()
        }}
      />
    </Crumbtainer>
  )
}

const Breadcrumbs = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [localUri, setLocalUri] = useState('')
  const [editMode, setEditMode] = useState(false)
  const ctxUri = useSelector((state) => state.context.uri) || ''

  const focusEntities = (entities) => {
    const focusedFolders = []
    const focusedProducts = []
    const focusedVersions = []
    const focusedRepresentations = []
    const focusedTasks = []
    const focusedWorkfiles = []

    const project = entities[0].projectName

    // assert we current url starts with projects/<projectName>
    // if not, redirect

    const path = window.location.pathname
    if (!path.startsWith(`/projects/${project}`)) {
      navigate(`/projects/${project}/browser`)
    }

    for (const entity of entities) {
      if (entity.folderId) focusedFolders.push(entity.folderId)
      if (entity.productId) focusedProducts.push(entity.productId)
      if (entity.versionId) focusedVersions.push(entity.versionId)
      if (entity.representationId) focusedRepresentations.push(entity.representationId)
      if (entity.taskId) focusedTasks.push(entity.taskId)
      if (entity.workfileId) focusedWorkfiles.push(entity.workfileId)

      if (entity.projectName !== project) {
        toast.error('Entities must be from the same project')
        continue
      }
    }

    dispatch(setFocusedFolders(focusedFolders))
    dispatch(setFocusedProducts(focusedProducts))
    dispatch(setFocusedVersions(focusedVersions))
    dispatch(setFocusedRepresentations(focusedRepresentations))
    dispatch(setFocusedTasks(focusedTasks))
    dispatch(setFocusedWorkfiles(focusedWorkfiles))
  }

  const goThere = () => {
    if (!localUri) return

    if (['ayon', 'ayon+entity'].includes(localUri.split('://')[0])) {
      axios
        .post('/api/resolve', { uris: [localUri] })
        .then((res) => {
          if (!res.data.length) {
            toast.error('Could not resolve uri')
            return
          }
          const entities = res.data[0].entities
          if (!entities.length) {
            toast.error('No entities found')
            return
          }
          focusEntities(entities)
          setTimeout(() => {
            dispatch(setUri(res.data[0].uri))
          }, 100)
        })
        .catch((err) => {
          toast.error(err)
        })
        .finally(() => {
          setEditMode(false)
        })
    } else if (localUri.startsWith('ayon+settings')) {
      setEditMode(false)

      //split query params

      const [baseUri, query] = localUri.split('://')[1].split('?')

      // extract addon name and version from uri
      // ayon+settings://<addonName>:<addonVersion>/<settingsPathIncludingMoreSlashes>

      const [addonStr, ...settingsPath] = baseUri.split('/')
      const [addonName, addonVersion] = addonStr.split(':')

      // parse query params

      const qp = {}
      if (query) {
        for (const param of query.split('&')) {
          const [key, value] = param.split('=')
          qp[key] = value
        }
      }

      let targetUrl = ''

      if ('project' in qp && 'site' in qp) {
        targetUrl = `manageProjects/siteSettings?`
        targetUrl += `project=${qp.project}&site=${qp.site}`
        targetUrl += `&addonName=${addonName}&addonVersion=${addonVersion}`
        targetUrl += `&settingsPath=${settingsPath.join('|')}`
      } else if ('project' in qp) {
        targetUrl = `manageProjects/projectSettings?`
        targetUrl += `project=${qp.project}`
        targetUrl += `&addonName=${addonName}&addonVersion=${addonVersion}`
        targetUrl += `&settingsPath=${settingsPath.join('|')}`
      } else if ('site' in qp) {
        targetUrl = `settings/site?`
        targetUrl += `site=${qp.site}`
        targetUrl += `&addonName=${addonName}&addonVersion=${addonVersion}`
        targetUrl += `&settingsPath=${settingsPath.join('|')}`
      } else {
        targetUrl = `settings/studio`
        targetUrl += `?addonName=${addonName}&addonVersion=${addonVersion}`
        targetUrl += `&settingsPath=${settingsPath.join('|')}`
      }

      navigate(targetUrl)
      dispatch(setUri(localUri))
      dispatch(setUriChanged())
      setEditMode(false)
    } else {
      toast.error('Invalid uri')
      setLocalUri(ctxUri)
      setEditMode(false)
    }
  }

  const onCopy = () => {
    navigator.clipboard.writeText(localUri)
    toast.success('Copied to clipboard')
  }

  useEffect(() => {
    if (ctxUri === localUri) return
    setLocalUri(ctxUri)
  }, [ctxUri])

  if (editMode) {
    return (
      <UriEditor
        uri={localUri}
        setUri={setLocalUri}
        onAccept={goThere}
        onCancel={() => setEditMode(false)}
        onCopy={onCopy}
      />
    )
  }

  return (
    <Crumbtainer>
      <ul onClick={() => setEditMode(true)}>
        {uri2crumbs(ctxUri).map((crumb, idx) => (
          <li key={idx}>{crumb}</li>
        ))}
      </ul>
      <HeaderButton icon="edit" onClick={() => setEditMode(true)} />
      <HeaderButton icon="content_copy" onClick={onCopy} />
    </Crumbtainer>
  )
}

export default Breadcrumbs
