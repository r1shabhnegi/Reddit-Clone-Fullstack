import { apiClient } from '../apiClient';

const apiRequests = apiClient.injectEndpoints({
  endpoints: (builder) => ({
    numberOfPosts: builder.query({ query: () => '/api/post/numberOfPosts' }),

    createPost: builder.mutation({
      query: (data) => ({
        url: '/api/post/createPost',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['getCommunity', 'communityPosts', 'getHomePosts'],
    }),

    getAllCommunityPosts: builder.query({
      query: ({ communityId, page }) => `/api/post/${communityId}/${page}`,
      providesTags: ['communityPosts'],
    }),

    getAllPosts: builder.query({
      query: (page) => `/api/post/getAllPosts/${page}`,
      providesTags: ['getHomePosts'],
    }),

    getPostDetails: builder.query({ query: (id) => `/api/post/detail/${id}` }),

    getPostStats: builder.query({
      query: ({ postId, userId }) => `/api/post/postStats/${postId}/${userId}`,
      providesTags: ['postStats'],
    }),

    upVote: builder.mutation({
      query: (data) => ({
        url: '/api/post/upVote',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['postStats'],
    }),

    downVote: builder.mutation({
      query: (data) => ({
        url: '/api/post/downVote',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['postStats'],
    }),

    savePost: builder.mutation({
      query: (data) => ({
        url: '/api/post/savePost',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['postStats'],
    }),

    deletePost: builder.mutation({
      query: (postId) => ({
        url: '/api/post/deletePost',
        method: 'POST',
        body: postId,
      }),
      invalidatesTags: ['getHomePosts', 'communityPosts'],
    }),

    postDetails: builder.query({
      query: (postId) => `/api/post/postDetails/${postId}`,
    }),

    postDetailsCommunityInfo: builder.query({
      query: (id) => `/api/post/postDetailsCommunityInfo/${id}`,
    }),
  }),
});

export const {
  useNumberOfPostsQuery,
  useCreatePostMutation,
  useGetAllCommunityPostsQuery,
  useGetAllPostsQuery,
  useLazyGetPostStatsQuery,
  useUpVoteMutation,
  useDownVoteMutation,
  useSavePostMutation,
  useDeletePostMutation,
  usePostDetailsQuery,
  useLazyPostDetailsCommunityInfoQuery,
} = apiRequests;