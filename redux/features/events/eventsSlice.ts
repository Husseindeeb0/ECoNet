import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EventDisplay } from "@/types";

interface EventsState {
  selectedEvent: EventDisplay | null;
  filter: string;
}

const initialState: EventsState = {
  selectedEvent: null,
  filter: "all",
};

const eventsSlice = createSlice({
  name: "events",
  initialState,
  reducers: {
    selectEvent: (state, action: PayloadAction<EventDisplay>) => {
      state.selectedEvent = action.payload;
    },
    clearSelectedEvent: (state) => {
      state.selectedEvent = null;
    },
    setFilter: (state, action: PayloadAction<string>) => {
      state.filter = action.payload;
    },
  },
});

export const { selectEvent, clearSelectedEvent, setFilter } =
  eventsSlice.actions;
export default eventsSlice.reducer;
