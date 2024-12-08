import { createSlice } from "@reduxjs/toolkit";

// Initial state for whether the user is talking
const initialState = {
  isTalking: false,
  isStreaming: false,
  facing: "front",
};

// Create the slice
const talkingSlice = createSlice({
  name: "talking",
  initialState,
  reducers: {
    startTalking: (state) => {
      state.isTalking = true;
    },
    stopTalking: (state) => {
      state.isTalking = false;
    },
    setIsStreaming: (state, action) => {
      state.isStreaming = action.payload;
    },
    setFacing: (state, action) => {
      state.facing = action.payload;
    },
  },
});

// Export actions and reducer
export const { startTalking, stopTalking, setIsStreaming, setFacing } =
  talkingSlice.actions;
export default talkingSlice.reducer;
