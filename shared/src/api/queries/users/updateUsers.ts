<<<<<<<< HEAD:shared/src/api/queries/users/updateUser.ts
import { updateUserPreferences } from '@/features/user'
import globalApi from '@api'
import { api } from '@api/rest/users'
import { $Any } from '@types'

const updateUserApi = api.enhanceEndpoints({
  endpoints: {
    setFrontendPreferences: {
      invalidatesTags: (_result, _error, { userName }) => [{ type: 'user', id: userName }, 'info'],
      async onQueryStarted({ patchData }, { dispatch, queryFulfilled, getState }) {
        // get current preferences
        // @ts-ignore
        const currentPreferences = getState().user?.data?.frontendPreferences || {}

        // update redux store with new preferences
        dispatch(updateUserPreferences(patchData))
        try {
          await queryFulfilled
        } catch {
          // revert to previous preferences
          dispatch(updateUserPreferences(currentPreferences))
========
import { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { usersApi } from '@shared/api/generated'

const updateUserApi = usersApi.enhanceEndpoints({
  endpoints: {
    deleteUser: {
      transformErrorResponse: (res) => res.data,
      invalidatesTags: () => [{ type: 'user', id: 'LIST' }],
    },
    setFrontendPreferences: {
      // @ts-expect-error - disableInvalidations is not in the api
      invalidatesTags: (_result, _error, { userName, disableInvalidations }) =>
        !disableInvalidations ? [{ type: 'user', id: userName }, 'info'] : [],
      async onQueryStarted({ patchData }, { dispatch, queryFulfilled, getState }) {
        // get current preferences

        // optimistic update the user cache
        const patch = dispatch(
          usersApi.util.updateQueryData('getCurrentUser', undefined, (draft) => {
            if (draft?.data) {
              draft.data.frontendPreferences = { ...draft.data.frontendPreferences, ...patchData }
            }
          }),
        )
        try {
          await queryFulfilled
        } catch {
          // rollback the optimistic update if the query fails
          patch.undo()
>>>>>>>> main:shared/src/api/queries/users/updateUsers.ts
        }
      }, // onQueryStarted
    },
  },
})

<<<<<<<< HEAD:shared/src/api/queries/users/updateUser.ts
export const { useSetFrontendPreferencesMutation } = updateUserApi

const updateUser = globalApi.injectEndpoints({
========
const updateUser = updateUserApi.injectEndpoints({
>>>>>>>> main:shared/src/api/queries/users/updateUsers.ts
  endpoints: (build) => ({
    updateUser: build.mutation({
      query: ({ name, patch }) => ({
        url: `/api/users/${name}`,
        method: 'PATCH',
        body: patch,
      }),
      transformErrorResponse: (res) => res.data,
      invalidatesTags: (_result, _error, { name }) => [
        { type: 'user', id: name },
        { type: 'user', id: 'LIST' },
<<<<<<<< HEAD:shared/src/api/queries/users/updateUser.ts
        'info',
      ],
    }),
    // update multiple users at once
    updateUsers: build.mutation({
      // @ts-ignore
      queryFn: async (updates, { dispatch }) => {
        const results = await Promise.all(
          updates.map(({ name, patch }: { name: string; patch: $Any }) => {
            // @ts-ignore
            return dispatch(globalApi.endpoints.updateUser.initiate({ name, patch }))
          }),
        )
        console.log(results)
        return results
      },
    }),
========
        { type: 'userPool', id: 'LIST' },
        { type: 'feedback', id: 'LIST' },
        'info',
      ],
    }),
>>>>>>>> main:shared/src/api/queries/users/updateUsers.ts
    updateUserName: build.mutation({
      query: ({ name, newName }) => ({
        url: `/api/users/${name}/rename`,
        method: 'PATCH',
        body: { newName },
      }),
      invalidatesTags: (_result, _error, { name }) => [
        { type: 'user', id: name },
        { type: 'user', id: 'LIST' },
      ],
      transformErrorResponse: (res) => res.data,
    }),
    updateUserPassword: build.mutation({
      query: ({ name, password }) => ({
        url: `/api/users/${name}/password`,
        method: 'PATCH',
        body: { password },
      }),
      invalidatesTags: () => ['user'],
      transformErrorResponse: (res) => res.data,
    }),
    addUser: build.mutation({
      query: ({ name, user }) => ({
        url: `/api/users/${name}`,
        method: 'PUT',
        body: user,
      }),
      transformErrorResponse: (res) => res.data,
      invalidatesTags: [{ type: 'user', id: 'LIST' }],
    }),
    updateUserAPIKey: build.mutation({
      query: ({ name, apiKey }) => ({
        url: `/api/users/${name}/password`,
        method: 'PATCH',
        body: { apiKey },
      }),
      transformErrorResponse: (res) => res.data,
      invalidatesTags: () => [{ type: 'user', id: 'LIST' }],
    }),
    invalidateUserSession: build.mutation({
      query: ({ name, token }) => ({
        url: `/api/users/${name}/sessions/${token}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_res, _err, { token }) => [{ type: 'session', id: token }],
    }),
  }),
  overrideExisting: true,
})

const updateUser2 = updateUser.injectEndpoints({
  endpoints: (build) => ({
    // update multiple users at once
    updateUsers: build.mutation<
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      any[],
      { name: string; patch: object }[]
    >({
      //
      queryFn: async (updates, { dispatch }) => {
        const results = await Promise.all(
          updates.map(({ name, patch }: { name: string; patch: object }) => {
            return dispatch(updateUser.endpoints.updateUser.initiate({ name, patch }))
          }),
        )

        // Check if any of the results have an error
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const firstError = results.find((result: any) => result.error)
        if (firstError) {
          return { error: firstError.error as FetchBaseQueryError }
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return { data: results.map((result: any) => result.data) }
      },
    }),
  }),
})

export const {
  useUpdateUserMutation,
  useUpdateUsersMutation,
  useUpdateUserNameMutation,
  useUpdateUserPasswordMutation,
  useAddUserMutation,
  useDeleteUserMutation,
  useUpdateUserAPIKeyMutation,
  useInvalidateUserSessionMutation,
  useSetFrontendPreferencesMutation,
} = updateUser2
export { updateUser2 as userQueries }
