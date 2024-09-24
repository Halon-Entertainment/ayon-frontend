import { api, ListInstallersApiResponse } from '@api/rest/installers'
import { coerce, rcompare } from 'semver'

const installersApi = api.enhanceEndpoints({
  endpoints: {
    listInstallers: {
      transformResponse: (res: ListInstallersApiResponse) => {
        //  coerce versions using semver
        const installers =
          res.installers?.map((i) => ({
            ...i,
            semver: coerce(i.version)?.version || null,
          })) || []

        // sort by version using semver, null semver go last
        const sortedInstallers = installers
          .sort((a, b) => {
            if (a.semver && b.semver) {
              const semverComparison = rcompare(a.semver, b.semver)
              if (semverComparison === 0) {
                return b.version.localeCompare(a.version)
              } else {
                return semverComparison
              }
            } else if (a.semver) {
              return -1
            } else if (b.semver) {
              return 1
            } else {
              return a.version.localeCompare(b.version)
            }
          })
          .map((i) => {
            const { semver, ...rest } = i
            return rest
          })

        //   return in the same shape as the original response
        return { installers: sortedInstallers }
      },
      providesTags: () => [{ type: 'installers' }],
    },
  },
})

export const { useListInstallersQuery, useLazyListInstallersQuery } = installersApi

export default installersApi