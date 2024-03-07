import { ayonApi } from './ayon'

const getSiteRootsQuery = (siteId, platform) => {
  const query = new URLSearchParams()
  if (siteId) query.append('site_id', siteId)
  if (platform) query.append('platform', platform)
  return query.toString() ? `?${query.toString()}` : ''
}

const customRoots = ayonApi.injectEndpoints({
  endpoints: (build) => ({
    getSiteRoots: build.query({
      query: ({ projectName, siteId, platform }) => ({
        url: `/api/projects/${projectName}/siteRoots${getSiteRootsQuery(siteId, platform)}`,
        method: 'GET',
      }),

      providesTags: ['siteRoots'],
      transformResponse: (response) => response,
      transformErrorResponse: (error) => error.data.detail || `Error ${error.status}`,
    }),

    getCustomRoots: build.query({
      query: ({ projectName }) => ({
        url: `/api/projects/${projectName}/roots`,
        method: 'GET',
      }),

      providesTags: ['customRoots'],
      transformResponse: (response) => response,
      transformErrorResponse: (error) => error.data.detail || `Error ${error.status}`,
    }),

    setCustomRoots: build.mutation({
      query: ({ projectName, siteId, data }) => ({
        url: `/api/projects/${projectName}/roots/${siteId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['customRoots'],

      async onQueryStarted({ projectName, siteId, data }, { dispatch, queryFulfilled }) {
        const putResult = dispatch(
          ayonApi.util.updateQueryData('getCustomRoots', { projectName, siteId, data }, (draft) => {
            Object.assign(draft, { ...data, [siteId]: data })
          }),
        )
        try {
          await queryFulfilled
        } catch {
          putResult.undo()
        }
      }, // onQueryStarted
    }), // setCustomRoots
  }),
})

export const { useGetCustomRootsQuery, useSetCustomRootsMutation, useGetSiteRootsQuery } =
  customRoots
