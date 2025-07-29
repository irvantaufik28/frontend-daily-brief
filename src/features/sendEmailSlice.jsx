import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from "../config";

const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

const initialState = {
    data: null,
    loading: false,
    errorMessage: null,
};

// features/sendEmailSlice.js
export const sendEmail = createAsyncThunk(
    "sendEmail/post",
    async (data = {}, { rejectWithValue }) => {
        const apiUrl = config.apiUrl;

        if (!data.id) {
            return rejectWithValue("Missing report ID.");
        }

        try {
            const response = await axios.post(`${apiUrl}/send-email`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (err) {
            if (!err.response) throw err;
            return rejectWithValue(err.response.data?.message || "Failed to send email.");
        }
    }
);




const reportSlice = createSlice({
    name: "sendEmail",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // fetchReport
        builder
            .addCase(sendEmail.pending, (state) => {
                state.loading = true;
                state.errorMessage = null;
            })
            .addCase(sendEmail.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload;
                state.errorMessage = null;
            })

            .addCase(sendEmail.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload?.errors || "Failed to create/update report";
            });
    },
});

export const reportSelector = {
    data: (state) => state.report.data,
    loading: (state) => state.report.loading,
    errorMessage: (state) => state.report.errorMessage,
};

export default reportSlice.reducer;
