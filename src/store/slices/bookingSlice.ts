import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface PendingBooking {
  eventId: string;
  quantities: Record<number, number>;
}

interface BookingState {
  pendingBooking: PendingBooking | null;
}

const initialState: BookingState = {
  pendingBooking: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setPendingBooking: (state, action: PayloadAction<PendingBooking>) => {
      state.pendingBooking = action.payload;
    },
    clearPendingBooking: (state) => {
      state.pendingBooking = null;
    },
  },
});

export const { setPendingBooking, clearPendingBooking } = bookingSlice.actions;
export default bookingSlice.reducer;