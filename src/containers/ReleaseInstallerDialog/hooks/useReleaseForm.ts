import React, { useEffect, useState } from 'react'
import { BundleModel } from '@api/rest/bundles'
import { ReleaseListItemModel } from '@api/rest/releases'
import { useLazyListInstallersQuery } from '@queries/installers/getInstallers'
import { guessPlatform } from '../helpers'

export type ReleaseForm = {
  addons: string[]
  name: string | null
  platforms: string[]
}

type Props = {
  release: ReleaseListItemModel | null
  bundle: BundleModel | null
}

export const useReleaseForm = ({
  release,
  bundle,
}: Props): [ReleaseForm, React.Dispatch<React.SetStateAction<ReleaseForm>>] => {
  const [releaseForm, setReleaseForm] = useState<ReleaseForm>({
    addons: [],
    name: null,
    platforms: [],
  })

  const [getInstallers] = useLazyListInstallersQuery()

  const getAddonsForForm = (
    addons: BundleModel['addons'] | null,
    release: ReleaseListItemModel,
  ): string[] => {
    let addonsList: string[] = []

    if (addons) {
      addonsList = Object.keys(addons || {})
    } else {
      // default to all addons for release
      addonsList = release.addons.map((a) => a)
    }

    // always add mandatory addons (non duplicated)
    release.mandatoryAddons?.forEach((addon) => {
      if (!addonsList.includes(addon)) {
        addonsList.push(addon)
      }
    })

    return addonsList
  }

  const buildInitForm = async ({
    bundle,
    release,
  }: {
    release: ReleaseListItemModel
    bundle: BundleModel | null
  }) => {
    try {
      const { addons, installerVersion } = bundle || {}

      const getInitialPlatforms = async (installerVersion: string | undefined) => {
        if (installerVersion) {
          const { installers = [] } =
            (await getInstallers({ version: installerVersion }).unwrap()) || {}
          return installers.map((i) => i.platform)
        } else {
          const guess = guessPlatform()
          return guess ? [guess] : []
        }
      }
      const platforms = await getInitialPlatforms(installerVersion)

      let addonsList = getAddonsForForm(addons, release)

      setReleaseForm({
        addons: addonsList,
        name: release.name,
        platforms,
      })
    } catch (error) {}
  }

  // set up initial form values based on highest bundle
  useEffect(() => {
    if (!release) return

    buildInitForm({ bundle, release })
  }, [release, bundle, getInstallers, setReleaseForm])

  return [releaseForm, setReleaseForm]
}