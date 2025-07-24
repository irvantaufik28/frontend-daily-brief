import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice";
import personReducer from "./features/personSlice";
const store = configureStore({
    reducer: {
        auth: authSlice,
         person: personReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
