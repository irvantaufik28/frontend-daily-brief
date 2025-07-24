// features/personSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import config from '../config';
import { data } from "react-router-dom";

const initialState = {
    data: null,
    loading: false,
    errorMessage: null,
};


const token = document.cookie
    .split('; ')
    .find(row => row.startsWith('token='))
    ?.split('=')[1];

export const fetchPerson = createAsyncThunk(
    "person/fetchById",
    async (params = {}, { rejectWithValue }) => {
        const apiUrl = config.apiUrl;

        try {
            const response = await axios.get(`${apiUrl}/person/${params.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                params,
            });
            return response.data;
        } catch (err) {
            if (!err.response) {
                throw err;
            }
            return rejectWithValue(err.response.data);
        }
    }
);

export const updatePerson = createAsyncThunk(
    "person/update",
    async (params = {}, { rejectWithValue }) => {
        const apiUrl = config.apiUrl;
        const token = document.cookie
            .split("; ")
            .find(row => row.startsWith("token="))
            ?.split("=")[1];

        if (!params.id || !params.values) {
            return rejectWithValue("Missing id or values for update.");
        }

        try {
            const response = await axios.patch(
                `${apiUrl}/person/update/${params.id}`,
                params.values,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return response.data;
        } catch (err) {
            if (!err.response) throw err;
            return rejectWithValue(err.response.data);
        }
    }
);

const personSlice = createSlice({
    name: "person",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPerson.pending, (state) => {
                state.loading = true;
                state.data = null;
                state.errorMessage = null;
            })
            .addCase(fetchPerson.fulfilled, (state, action) => {
                state.loading = false;
                state.data = action.payload.data;
                state.errorMessage = null;
            })
            .addCase(fetchPerson.rejected, (state, action) => {
                state.loading = false;
                state.data = null;
                state.errorMessage = action.payload?.errors || "Failed to fetch person";
            });
    }
});


export const personSelector = {
    data: (state) => state.person.data,
    loading: (state) => state.person.loading,
    errorMessage: (state) => state.person.errorMessage,
};

export default personSlice.reducer;
