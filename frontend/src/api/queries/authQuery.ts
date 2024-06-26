import { apiClient } from '../apiClient';

export const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    // SERVER_STATUS
    serverStatus: builder.query({ query: () => '/server-status' }),

    // REFRESH_TOKEN
    refreshToken: builder.query({ query: () => '/api/auth/refresh' }),

    // SIGN_IN
    login: builder.mutation({
      query: (data) => ({
        url: '/api/auth/sign-in',
        method: 'POST',
        body: { ...data },
      }),
    }),

    // SIGN_UP
    signUp: builder.mutation({
      query: (data) => ({
        url: '/api/user/sign-up',
        method: 'POST',
        body: { ...data },
      }),
    }),

    // SIGN_OUT
    logout: builder.mutation({
      query: (id) => ({
        url: '/api/auth/sign-out',
        method: 'POST',
        response: id,
      }),
    }),
  }),
});

export const {
  useLogoutMutation,
  useServerStatusQuery,
  useRefreshTokenQuery,
  useLoginMutation,
  useSignUpMutation,
} = apiRequests;
