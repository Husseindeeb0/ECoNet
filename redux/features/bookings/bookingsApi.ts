import { api } from "../../api";
import { BookingDetails } from "@/types";

export const bookingsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBookings: builder.query<
      {
        success: boolean;
        bookings: BookingDetails[];
        hasGivenFeedback: boolean;
      },
      void
    >({
      query: () => "/bookings",
      providesTags: ["Booking"],
    }),
    bookEvent: builder.mutation<
      any,
      {
        eventId: string;
        name: string;
        email: string;
        phone: string;
        seats?: number;
      }
    >({
      query: (body) => ({
        url: "/bookings",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Booking", "Event"],
    }),
    cancelBooking: builder.mutation<any, string>({
      query: (bookingId) => ({
        url: `/bookings/${bookingId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Booking", "Event"],
    }),
  }),
});

export const {
  useGetBookingsQuery,
  useBookEventMutation,
  useCancelBookingMutation,
} = bookingsApi;
