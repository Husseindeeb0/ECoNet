import { api } from "../../api";
import { EventDisplay, CommentDisplay } from "@/types";

export interface CreateEventData {
  title: string;
  location: string;
  isOnline?: boolean;
  meetingLink?: string;
  category?: string;
  startsAt: string;
  endsAt?: string;
  capacity?: number;
  description?: string;
  coverImageUrl?: string;
  organizerId: string;
  isPaid?: boolean;
  price?: number;
  whishNumber?: string;
  liveStreamUrl?: string;
}

export interface UpdateEventData extends Partial<CreateEventData> {
  id: string;
}

export const eventsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEvents: builder.query<
      { success: boolean; events: EventDisplay[] },
      {
        organizerId?: string;
        ids?: string[];
        search?: string;
        category?: string;
        status?: "active" | "finished";
        isPaid?: string;
      } | void
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();

        if (params?.organizerId) {
          queryParams.append("organizerId", params.organizerId);
        }

        if (params?.search) {
          queryParams.append("search", params.search);
        }

        if (params?.category) {
          queryParams.append("category", params.category);
        }

        if (params?.status) {
          queryParams.append("status", params.status);
        }

        if (params?.isPaid) {
          queryParams.append("isPaid", params.isPaid);
        }

        if (params?.ids && params.ids.length > 0) {
          queryParams.append("ids", params.ids.join(","));
        }

        const queryString = queryParams.toString();
        return queryString ? `/events?${queryString}` : "/events";
      },
      providesTags: (result) =>
        result
          ? [
              ...result.events.map((event) => ({
                type: "Event" as const,
                id: event.id || event._id,
              })),
              { type: "Event", id: "LIST" },
            ]
          : [{ type: "Event", id: "LIST" }],
    }),
    getEventById: builder.query<{ event: EventDisplay }, string>({
      query: (id) => `/events/${id}`,
      providesTags: (result, error, id) => [{ type: "Event", id }],
    }),
    createEvent: builder.mutation<
      { success: boolean; event: EventDisplay },
      CreateEventData
    >({
      query: (data) => ({
        url: "/events",
        method: "POST",
        body: data,
      }),
      invalidatesTags: [{ type: "Event", id: "LIST" }],
    }),
    updateEvent: builder.mutation<{ event: EventDisplay }, UpdateEventData>({
      query: ({ id, ...data }) => ({
        url: `/events/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Event", id },
        { type: "Event", id: "LIST" },
      ],
    }),
    deleteEvent: builder.mutation<{ message: string }, string>({
      query: (id) => ({
        url: `/events/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Event", id: "LIST" }],
    }),
    getComments: builder.query<CommentDisplay[], string>({
      query: (eventId) => `/events/${eventId}/comments`,
      providesTags: (result, error, eventId) => [
        { type: "Comment", id: eventId },
      ],
    }),
    addComment: builder.mutation<
      CommentDisplay,
      { eventId: string; content: string; replyTo?: string }
    >({
      query: ({ eventId, ...body }) => ({
        url: `/events/${eventId}/comments`,
        method: "POST",
        body,
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Comment", id: eventId },
      ],
    }),
    likeComment: builder.mutation<void, { commentId: string; eventId: string }>(
      {
        query: ({ commentId }) => ({
          url: `/comments/${commentId}/like`,
          method: "POST",
        }),
        invalidatesTags: (result, error, { eventId }) => [
          { type: "Comment", id: eventId },
        ],
      }
    ),
    deleteComment: builder.mutation<
      void,
      { commentId: string; eventId: string }
    >({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Comment", id: eventId },
      ],
    }),
    pinComment: builder.mutation<void, { commentId: string; eventId: string }>({
      query: ({ commentId }) => ({
        url: `/comments/${commentId}/pin`,
        method: "POST",
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Comment", id: eventId },
      ],
    }),
    getCategories: builder.query<
      { success: boolean; categories: string[] },
      void
    >({
      query: () => "/categories",
    }),
    rateEvent: builder.mutation<
      { success: boolean; message: string },
      { eventId: string; rating: number }
    >({
      query: ({ eventId, rating }) => ({
        url: `/events/${eventId}/rate`,
        method: "POST",
        body: { rating },
      }),
      invalidatesTags: (result, error, { eventId }) => [
        { type: "Event", id: eventId },
      ],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useGetEventByIdQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useLikeCommentMutation,
  useDeleteCommentMutation,
  usePinCommentMutation,
  useGetCategoriesQuery,
  useRateEventMutation,
} = eventsApi;
