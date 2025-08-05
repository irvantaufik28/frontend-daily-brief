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
    draftCount: 0, // NEW
};

// Fetch by ID
export const fetchReport = createAsyncThunk(
    "report/fetchById",
    async (params = {}, { rejectWithValue }) => {
        const apiUrl = config.apiUrl;

        try {
            const response = await axios.get(`${apiUrl}/report/${params.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Cache-Control": "no-cache",
                },
                params,
            });
            return response.data;
        } catch (err) {
            if (!err.response) throw err;
            return rejectWithValue(err.response.data);
        }
    }
);



// Create or Update report
export const createReport = createAsyncThunk(
    "report/createOrUpdate",
    async (data = {}, { rejectWithValue }) => {
        const apiUrl = config.apiUrl;

        if (!data.projectId || !data.personId || !data.reportDate || !Array.isArray(data.reports)) {
            return rejectWithValue("Missing required fields for report creation.");
        }

        try {
            const response = await axios.post(`${apiUrl}/report/create`, data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });
            return response.data;
        } catch (err) {
            if (!err.response) throw err;
            return rejectWithValue(err.response.data);
        }
    }
);

export const deleteReport = createAsyncThunk(
    "report/delete",
    async (id, { rejectWithValue }) => {
        const apiUrl = config.apiUrl;

        if (!id) {
            return rejectWithValue("Missing report detail ID.");
        }

        try {
            const response = await axios.delete(`${apiUrl}/report/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return { id, ...response.data };
        } catch (err) {
            if (!err.response) throw err;
            return rejectWithValue(err.response.data);
        }
    }
);

export const countDraftReport = createAsyncThunk(
    "report/countDraft",
    async (params = {}, { rejectWithValue }) => {
        const apiUrl = config.apiUrl;

        try {
            const response = await axios.get(`${apiUrl}/report-draft-count`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Cache-Control": "no-cache",
                },
                params,
            });
            return response.data;
        } catch (err) {
            if (!err.response) throw err;
            return rejectWithValue(err.response.data);
        }
    }
);


const reportSlice = createSlice({
    name: "report",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        // fetchReport
        builder
            .addCase(fetchReport.pending, (state) => {
                state.loading = true;
                state.data = null;
                state.errorMessage = null;
            })
            .addCase(fetchReport.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.errorMessage = null;
            })
            .addCase(fetchReport.rejected, (state, action) => {
                state.loading = false;
                state.data = null;
                state.errorMessage = action.payload?.errors || "Failed to fetch report";
            });

        // createReport (used for both create & update)
        builder
            .addCase(createReport.pending, (state) => {
                state.loading = true;
                state.errorMessage = null;
            })
            .addCase(createReport.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.errorMessage = null;
            })
            .addCase(createReport.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload?.errors || "Failed to create/update report";
            });
        builder
            // existing reducers
            .addCase(deleteReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteReport.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                // Optional: hapus dari state.data.ReportDetail jika disimpan lokal
                if (state.data?.ReportDetail) {
                    state.data.ReportDetail = state.data.ReportDetail.filter(
                        (item) => item.id !== action.payload.id
                    );
                }
            })
            .addCase(deleteReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || "Failed to delete report detail";
            });
        // fetchReport
        builder
            .addCase(countDraftReport.pending, (state) => {
                state.loading = true;
                // Do not set state.data = null!
                state.errorMessage = null;
            })
            .addCase(countDraftReport.fulfilled, (state, action) => {
                state.loading = false;
                state.draftCount = action.payload.data; // only store the count here
                state.errorMessage = null;
            })
            .addCase(countDraftReport.rejected, (state, action) => {
                state.loading = false;
                state.errorMessage = action.payload?.errors || "Failed to fetch countDraftReport";
            });
    },
});

export const reportSelector = {
    data: (state) => state.report.data,
    loading: (state) => state.report.loading,
    errorMessage: (state) => state.report.errorMessage,
};

export default reportSlice.reducer;
