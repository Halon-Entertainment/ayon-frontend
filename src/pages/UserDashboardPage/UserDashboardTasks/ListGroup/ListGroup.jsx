import React from 'react'
import { useDispatch } from 'react-redux'

import { useGetTaskContextMenu } from '@pages/UserDashboardPage/hooks'
import * as Styled from './ListGroup.styled'
import { Button } from '@ynput/ayon-react-components'
import ListItem from '@components/ListItem/ListItem'
import { InView } from 'react-intersection-observer'
import { useURIContext } from '@context/uriContext'
import { getTaskRoute } from '@helpers/routes'

const ListGroup = ({
  tasks = [],
  id,
  groups = {},
  selectedTasks = [],
  onTaskSelected,
  onTaskHover,
  statusesOptions = [],
  disabledStatuses = [],
  disabledProjectUsers = [],
  onUpdate,
  allUsers = [],
  onCollapseChange,
  isCollapsed,
  isLoading,
  minWidths,
  containerRef,
}) => {
  const dispatch = useDispatch()
  const { navigate } = useURIContext()
  const column = groups[id] || {}

  // CONTEXT MENU
  const { handleContextMenu, closeContext } = useGetTaskContextMenu(tasks, dispatch)

  return (
    <>
      {id !== 'none' && (
        <Styled.Header
          style={{
            borderBottomColor: !isCollapsed && (column?.color ?? 'var(--md-sys-color-outline)'),
          }}
          $isCollapsed={isCollapsed}
          onDoubleClick={() => onCollapseChange(id)}
          $isLoading={column?.isLoading}
          className="group-header"
          id={id}
        >
          {!column.isLoading && (
            <>
              <Button
                icon="expand_more"
                variant="text"
                onClick={() => onCollapseChange(id)}
                data-tooltip={'Collapse/Expand'}
                data-shortcut={'C'}
              />
              <span>
                {column?.name} - {column?.tasks?.length}
              </span>
            </>
          )}
        </Styled.Header>
      )}
      {!isCollapsed && (
        <>
          {column?.tasks?.map((task, i, a) => (
            <InView key={task.id} root={containerRef?.current} rootMargin={'50% 0px 50% 0px'}>
              {({ inView, ref }) => (
                <ListItem
                  ref={ref}
                  task={task}
                  isLast={i === a.length - 1}
                  isFirst={i === 0}
                  selected={selectedTasks.includes(task.id)}
                  selectedLength={selectedTasks.length}
                  onClick={(e) => {
                    if (e && e.detail == 2) {
                      navigate(getTaskRoute(task))
                      return
                    }
                    closeContext()
                    onTaskSelected(e, task.id)
                  }}
                  onContextMenu={(e) => handleContextMenu(e)}
                  onMouseOver={() => onTaskHover(task)}
                  statusesOptions={statusesOptions}
                  disabledStatuses={disabledStatuses}
                  disabledProjectUsers={disabledProjectUsers}
                  onUpdate={onUpdate}
                  allUsers={allUsers}
                  className={'card'}
                  minWidths={minWidths}
                  inView={inView}
                />
              )}
            </InView>
          ))}
          {!isLoading && column?.tasks?.length === 0 && <ListItem none />}
        </>
      )}
    </>
  )
}

export default ListGroup
