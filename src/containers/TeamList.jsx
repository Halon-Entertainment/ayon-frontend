import { useMemo, useRef } from 'react'
import { TablePanel, Section } from '@ynput/ayon-react-components'

import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { useEffect } from 'react'
import { ContextMenu } from 'primereact/contextmenu'

const TeamList = ({
  teams,
  isLoading,
  selection,
  onSelect,
  onRowClick,
  showNull,
  multiselect,
  footer,
  style,
  styleSection,
  className,
  onNoProject,
  onSuccess,
  autoSelect,
  onDelete,
}) => {
  const contextMenuRef = useRef(null)
  // if selection does not exist in data, set selection to null
  useEffect(() => {
    if (isLoading) return

    if (onNoProject && !teams.map((project) => project.name).includes(selection)) {
      console.log('selected project does not exist: ', selection)
      const defaultProject = autoSelect ? teams[0]?.name : null
      onNoProject(defaultProject)
    } else if (onSuccess) onSuccess()
  }, [selection, teams, onNoProject, isLoading])

  const teamList = [...teams].sort((a, b) => a.name.localeCompare(b.name))

  if (showNull) teamList.unshift({ name: '_' })

  const selectionObj = useMemo(() => {
    if (multiselect) {
      let result = []
      for (const project of teamList) {
        if (selection === null) {
          if (project.name === '_') {
            result.push(project)
            break
          }
        }
        if (selection?.includes(project.name)) result.push(project)
      }
      return result
    } else {
      for (const project of teamList) {
        if (project.name === selection) return project
        if (!selection && project.name === '_') return project
      }
    } // single select
  }, [selection, teamList])

  const onSelectionChange = (e) => {
    if (multiselect) {
      let result = []
      for (const node of e.value) {
        if (node.name === '_') {
          result = null
          break
        }
        result.push(node.name)
      }
      onSelect(result)
    } // multiselect
    else {
      if (e.value.name === '_') onSelect(null)
      else onSelect(e.value.name)
    } // single select
  } // onSelectionChange

  const contextMenuModel = [
    {
      label: 'Delete selected',
      command: () => onDelete(),
    },
  ]

  return (
    <Section style={{ maxWidth: 200, ...styleSection }} className={className}>
      {footer}
      <TablePanel loading={isLoading}>
        <ContextMenu model={contextMenuModel} ref={contextMenuRef} />
        <DataTable
          value={teamList}
          scrollable="true"
          scrollHeight="flex"
          selectionMode={multiselect ? 'multiple' : 'single'}
          responsive="true"
          dataKey="name"
          selection={selectionObj}
          onSelectionChange={onSelect && onSelectionChange}
          onRowClick={onRowClick}
          onContextMenu={(e) => contextMenuRef.current.show(e.originalEvent)}
        >
          <Column field="name" header="Team" style={{ minWidth: 150, ...style }} />
        </DataTable>
      </TablePanel>
    </Section>
  )
}

export default TeamList