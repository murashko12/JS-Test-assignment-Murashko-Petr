import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { IUser } from '../types/User'

export interface UsersResponse {
    users: IUser[]
    pagination: {
        total: number
        page: number
        limit: number
        pages: number
    }
}

export interface BackupResponse {
    message: string
    filename: string
    timestamp: string
}

export interface RestoreResponse {
    message: string
    usersRestored: number
    filename: string
    timestamp: string
}

export interface BackupListResponse {
    backups: string[]
    count: number
}

const BASE_URL = 'http://localhost:3000'

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ 
        baseUrl: BASE_URL,
        prepareHeaders: (headers) => {
            headers.set('Content-Type', 'application/json')
            return headers
        }
    }),
    tagTypes: ['User', 'Backup'],
    
    endpoints: (builder) => ({
        // Users endpoints
        getUsers: builder.query<UsersResponse, { search?: string; page?: number; limit?: number }>({
            query: ({ search, page = 1, limit = 10 }) => ({
                url: '/users',
                params: { search, page, limit }
            }),
            providesTags: ['User']
        }),

        getUser: builder.query<IUser, number>({
            query: (id) => `/users/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'User', id }]
        }),

        createUser: builder.mutation<IUser, Partial<IUser>>({
            query: (userData) => ({
                url: '/users',
                method: 'POST',
                body: userData,
            }),
            invalidatesTags: ['User']
        }),

        updateUser: builder.mutation<IUser, { id: number; data: Partial<IUser> }>({
            query: ({ id, data }) => ({
                url: `/users/${id}`,
                method: 'PATCH',
                body: data
            }),
            invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }]
        }),

        deleteUser: builder.mutation<void, number>({
            query: (id) => ({
                url: `/users/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['User']
        }),

        // Backup endpoints
        createBackup: builder.mutation<BackupResponse, void>({
            query: () => ({
                url: '/backup/create',
                method: 'POST',
            }),
            invalidatesTags: ['Backup']
        }),

        restoreBackup: builder.mutation<RestoreResponse, string>({
            query: (filename) => ({
                url: `/backup/restore/${filename}`,
                method: 'POST',
            }),
            invalidatesTags: ['User', 'Backup']
        }),

        restoreBackupFromFile: builder.mutation<RestoreResponse, FormData>({
            query: (formData) => ({
                url: '/backup/restore/upload',
                method: 'POST',
                body: formData,
                headers: {}
            }),
            invalidatesTags: ['User', 'Backup']
        }),

        getBackupsList: builder.query<BackupListResponse, void>({
            query: () => '/backup/list',
            providesTags: ['Backup']
        }),

        downloadBackup: builder.mutation<Blob, string>({
            query: (filename) => ({
                url: `/backup/download/${filename}`,
                method: 'GET',
                responseHandler: (response) => response.blob()
            })
        })
    })
})

export const {
    useGetUsersQuery,
    useGetUserQuery,
    useCreateUserMutation,
    useUpdateUserMutation,
    useDeleteUserMutation,
    useCreateBackupMutation,
    useRestoreBackupMutation,
    useRestoreBackupFromFileMutation,
    useGetBackupsListQuery,
    useDownloadBackupMutation
} = api