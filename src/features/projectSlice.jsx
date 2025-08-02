import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../config";

const initialState = {
  data: [],
  paging: {
    page: 1,
    total_item: 0,
    total_page: 0,
  },
  loading: false,
  errorMessage: null,
};

const token = document.cookie
  .split("; ")
  .find((row) => row.startsWith("token="))
  ?.split("=")[1];

export const fetchProjects = createAsyncThunk(
  "project/fetchProjects",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${config.apiUrl}/project`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params,
      });

      // ✅ Kembalikan seluruh response.data.data
      return response.data.data;
    } catch (err) {
      if (!err.response) {
        throw err;
      }
      return rejectWithValue(err.response.data);
    }
  }
);

const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.errorMessage = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload.projects; // ✅ Ambil array dari response
        state.paging = action.payload.paging;
        state.errorMessage = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.data = [];
        state.paging = initialState.paging;
        state.errorMessage = action.payload?.message || "Failed to fetch projects";
      });
  },
});

export const projectSelector = {
  data: (state) => state.project.data,
  paging: (state) => state.project.paging,
  loading: (state) => state.project.loading,
  errorMessage: (state) => state.project.errorMessage,
};

export default projectSlice.reducer;
