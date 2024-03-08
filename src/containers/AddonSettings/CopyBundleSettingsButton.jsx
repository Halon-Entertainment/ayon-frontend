import { useState, useMemo } from 'react'
import { Button } from '@ynput/ayon-react-components'
import CopySettingsDialog from '/src/containers/CopySettings'
import { useGetAddonSettingsListQuery } from '/src/services/addonSettings'

const CopyBundleSettingsButton = ({
  bundleName,
  variant,
  disabled,
  localData,
  setLocalData,
  changedKeys,
  setChangedKeys,
  originalData,
  setOriginalData,
  projectName,
  siteId,
}) => {
  const [dialogVisible, setDialogVisible] = useState(false)

  // Get a complete list of target addons (what's in the addon list)

  const { data: targetAddons, loading } = useGetAddonSettingsListQuery({
    projectName,
    siteId,
    variant,
  })

  const selectedAddons = useMemo(() => {
    if (loading) return []
    let result = []
    for (const addon of targetAddons?.addons || []) {
      if (siteId) {
        if (!projectName && !addon.hasSiteSettings)
          // global site overrides
          continue
        if (projectName && !addon.hasProjectSiteSettings)
          // project site overrides
          continue
      } else if (projectName && !addon.hasProjectSettings) continue
      else if (!addon.hasSettings && !addon.isBroken) continue

      const addonKey = `${addon.name}|${addon.version}|${variant}|${siteId || '_'}|${
        projectName || '_'
      }`

      result.push({
        ...addon,
        key: addonKey,
        variant,
      })
    }
    return result
  }, [targetAddons])

  return (
    <>
      <Button
        icon="input"
        data-tooltip="Copy settings from"
        onClick={() => setDialogVisible(true)}
        disabled={disabled || !bundleName}
      />
      {dialogVisible && (
        <CopySettingsDialog
          selectedAddons={selectedAddons}
          variant={variant}
          originalData={originalData}
          setOriginalData={setOriginalData}
          localData={localData}
          setLocalData={setLocalData}
          changedKeys={changedKeys}
          setChangedKeys={setChangedKeys}
          projectName={projectName}
          onClose={() => setDialogVisible(false)}
          pickByBundle={true}
        />
      )}
    </>
  )
}

export default CopyBundleSettingsButton