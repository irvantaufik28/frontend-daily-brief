import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice";
import personReducer from "./features/personSlice";
import reportReducer from "./features/reportSlice"
const store = configureStore({
    reducer: {
        auth: authSlice,
         person: personReducer,
         report : reportReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
