import { api } from "../../api";
import { AuthResponse, LoginCredentials, SignupData } from "@/types/auth";
import { UserProfile } from "@/types";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginCredentials>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),
    signup: builder.mutation<AuthResponse, SignupData>({
      query: (data) => ({
        url: "/auth/signup",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    logout: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    checkSession: builder.query<AuthResponse, void>({
      query: () => "/auth/me",
      providesTags: ["User"],
    }),
    refreshToken: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/auth/refresh",
        method: "POST",
      }),
    }),
    updateProfile: builder.mutation<AuthResponse, Partial<UserProfile>>({
      query: (data) => ({
        url: "/auth/me",
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),
    migrateEvents: builder.mutation<
      { success: boolean; message: string; migratedCount?: number },
      void
    >({
      query: () => ({
        url: "/user/migrate",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    getFollowing: builder.query<
      { success: boolean; following: UserProfile[] },
      void
    >({
      query: () => "/user/following",
      providesTags: ["Follow"],
    }),
    getFollowers: builder.query<
      { success: boolean; followers: UserProfile[] },
      void
    >({
      query: () => "/user/followers",
      providesTags: ["Follow"],
    }),
    resendVerification: builder.mutation<
      { success: boolean; message: string },
      { email: string }
    >({
      query: (body) => ({
        url: "/auth/resend-verification",
        method: "POST",
        body,
      }),
    }),
    verifyEmail: builder.mutation<
      { success: boolean; message: string },
      { email: string; code: string }
    >({
      query: (body) => ({
        url: "/auth/verify-email",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),
    resetPassword: builder.mutation<{ success: boolean; message: string }, any>(
      {
        query: (body) => ({
          url: "/auth/reset-password",
          method: "POST",
          body,
        }),
      }
    ),
    getImageKitAuth: builder.query<
      { signature: string; expire: number; token: string },
      void
    >({
      query: () => "/auth/imagekit",
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
  useCheckSessionQuery,
  useRefreshTokenMutation,
  useUpdateProfileMutation,
  useMigrateEventsMutation,
  useGetFollowingQuery,
  useGetFollowersQuery,
  useResendVerificationMutation,
  useVerifyEmailMutation,
  useResetPasswordMutation,
  useLazyGetImageKitAuthQuery,
} = authApi;
