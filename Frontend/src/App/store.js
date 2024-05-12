import { configureStore } from "@reduxjs/toolkit";
import UserSlice from "./Slice/UserSlice";

const Store = configureStore({
    reducer: {
        userState: UserSlice,
    }
});

export default Store;