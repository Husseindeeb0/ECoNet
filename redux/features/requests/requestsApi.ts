import { api } from "../../api";
import { Booking } from "../bookings/bookingsApi";

export const requestsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getRequests: builder.query<
      { success: boolean; requests: Booking[] },
      { eventId?: string }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.eventId) queryParams.append("eventId", params.eventId);
        return `/requests?${queryParams.toString()}`;
      },
      providesTags: ["Booking"],
    }),
    approveRequest: builder.mutation<{ success: boolean }, string>({
      query: (requestId) => ({
        url: `/requests/${requestId}/approve`,
        method: "POST",
      }),
      invalidatesTags: ["Booking", "Event"],
    }),
    rejectRequest: builder.mutation<{ success: boolean }, string>({
      query: (requestId) => ({
        url: `/requests/${requestId}/reject`,
        method: "POST",
      }),
      invalidatesTags: ["Booking"],
    }),
  }),
});

export const {
  useGetRequestsQuery,
  useApproveRequestMutation,
  useRejectRequestMutation,
} = requestsApi;
