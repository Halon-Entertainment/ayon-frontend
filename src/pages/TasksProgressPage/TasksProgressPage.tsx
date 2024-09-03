import Hierarchy from '@containers/hierarchy'
import TasksProgress from '@containers/TasksProgress'
import { useGetProjectQuery } from '@queries/project/getProject'
import { $Any } from '@types'
import { Section } from '@ynput/ayon-react-components'
import { Splitter, SplitterPanel } from 'primereact/splitter'
import { FC } from 'react'
import { useSelector } from 'react-redux'
import TaskProgressDetailsPanel from './TaskProgressDetailsPanel'

const detailsMinWidth = 300
const detailsMaxWidth = '30vw'
const detailsMaxMaxWidth = 500

const TasksProgressPage: FC = () => {
  const projectName = useSelector((state: $Any) => state.project.name) as string
  const isOpen = useSelector((state: $Any) => state.details.open) as boolean
  const selectedFolders = useSelector((state: $Any) => state.context.focused.folders) as string[]
  const selectedTasks = useSelector((state: $Any) => state.context.focused.tasks) as string[]
  const detailsOpen = isOpen && selectedFolders.length > 0 && selectedTasks.length > 0

  //   GET PROJECT INFO FOR STATUS
  const { data: projectInfo } = useGetProjectQuery({ projectName }, { skip: !projectName })

  return (
    <main style={{ overflow: 'hidden' }}>
      <Splitter layout="horizontal" style={{ width: '100%', height: '100%' }}>
        <SplitterPanel size={isOpen ? 12 : 18} style={{ minWidth: 200, maxWidth: 500 }}>
          <Section wrap>
            <Hierarchy />
          </Section>
        </SplitterPanel>
        <SplitterPanel size={90} style={{ overflow: 'hidden' }}>
          <Splitter layout="horizontal" style={{ height: '100%', overflow: 'hidden' }}>
            <SplitterPanel size={80} style={{ overflow: 'hidden' }}>
              <TasksProgress
                statuses={projectInfo?.statuses}
                taskTypes={projectInfo?.taskTypes}
                folderTypes={projectInfo?.folderTypes}
                projectName={projectName}
              />
            </SplitterPanel>
            {detailsOpen ? (
              <SplitterPanel
                style={{
                  maxWidth: `clamp(${detailsMinWidth}px, ${detailsMaxWidth}, ${detailsMaxMaxWidth}px)`,
                  minWidth: detailsMinWidth,
                  width: '3vw',
                  zIndex: 200,
                }}
              >
                <TaskProgressDetailsPanel projectInfo={projectInfo} projectName={projectName} />
              </SplitterPanel>
            ) : (
              <SplitterPanel size={0} style={{ maxWidth: 0 }}></SplitterPanel>
            )}
          </Splitter>
        </SplitterPanel>
      </Splitter>
    </main>
  )
}

export default TasksProgressPage
