import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/authSlice";
import personReducer from "./features/personSlice";
import reportReducer from "./features/reportSlice"
import sendEmailReducer from "./features/sendEmailSlice"
import projectMemberReducer from "./features/projectMemberSlice"
import projcetReducer from "./features/projectSlice"

const store = configureStore({
    reducer: {
        auth: authSlice,
        person: personReducer,
        report: reportReducer,
        sendEmail: sendEmailReducer,
        projectMember: projectMemberReducer,
        project: projcetReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
