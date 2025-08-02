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

// Thunk untuk fetch person by project ID
export const fetchPersonProject = createAsyncThunk(
    "projectMember/fetchProjectMember",
    async (params = {}, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${config.apiUrl}/project-member`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            });
            return response.data; // return seluruh data agar bisa akses .members dan .paging
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

const projectMemberSlice = createSlice({
    name: "projectMember",
    initialState,
    reducers: {
        clearMembers: (state) => {
            state.data = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchPersonProject.pending, (state) => {
                state.loading = true;
                state.errorMessage = null;
            })
            .addCase(fetchPersonProject.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data.members || [];
                state.paging = action.payload.paging || initialState.paging;
                state.errorMessage = null;
            })
            .addCase(fetchPersonProject.rejected, (state, action) => {
                state.loading = false;
                state.data = [];
                state.paging = initialState.paging;
                state.errorMessage = action.payload?.message || "Failed to load data.";
            });
    },
});

export const projectMemberSelector = {
    data: (state) => state.projectMember,
    paging: (state) => state.projectMember.paging,
    loading: (state) => state.projectMember.loading,
    errorMessage: (state) => state.projectMember.errorMessage,
};
export const { clearMembers } = projectMemberSlice.actions;
export default projectMemberSlice.reducer;
