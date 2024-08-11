import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://testapi.getlokalapp.com/common/jobs";

type getJobsDataType = {
  page?: number;
  loadMore?: boolean;
};

const getJobsData = createAsyncThunk(
  "getJobsData",
  async (data: getJobsDataType, { rejectWithValue }) => {
    try {
      const { page, loadMore } = data;
      let URL = "";
      if (page) {
        URL = `${API_URL}?page=${page}`;
      } else {
        URL = `${API_URL}?page=1`;
      }
      const response = await axios.get(URL);
      // console.log("getJobsData res =>", JSON.stringify(response));
      // console.log("response =>", response?.data?.results?.length);

      if (response?.data?.results) {
        return { data: response.data.results, loadMore };
      }
      return rejectWithValue(response);
    } catch (e) {
      console.log("Error =>", e);
      return rejectWithValue(e);
    }
  }
);

const JobsThunk = { getJobsData };

export default JobsThunk;
