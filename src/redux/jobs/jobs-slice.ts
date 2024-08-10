import { createSlice } from "@reduxjs/toolkit";
import JobsThunk from "./jobs-thunk";

const JobsSlice = createSlice({
  name: "users",
  initialState: {
    getJobsSuccess: false,
    jobsList: [],
    getJobsFailure: false,
  },
  reducers: {
    resetUsers: (state) => {
      state.jobsList = [];
      state.getJobsSuccess = false;
      state.getJobsFailure = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(JobsThunk.getJobsData.pending, (state, action) => {
        state.getJobsSuccess = false;
        state.jobsList = [];
        state.getJobsFailure = false;
      })
      .addCase(JobsThunk.getJobsData.fulfilled, (state, action) => {
        state.getJobsSuccess = true;
        state.jobsList = action.payload.loadMore
          ? [...state.jobsList, ...action.payload.data]
          : action.payload.data;
        state.getJobsFailure = false;
      })
      .addCase(JobsThunk.getJobsData.rejected, (state, action) => {
        state.getJobsSuccess = false;
        state.jobsList = [];
        state.getJobsFailure = true;
      });
  },
});

export default JobsSlice;
