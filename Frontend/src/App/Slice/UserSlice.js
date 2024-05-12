import { createSlice } from "@reduxjs/toolkit";

const localData = JSON.parse(localStorage.getItem("account"));
const initialState = {
    accountData: localData ? localData : [],
    isLoggedIn: localData ? localData.isLoggedIn :false,
};

const UserSlice = createSlice({
    initialState,
    name: "user",
    reducers: {
        setAccount: (state, action) =>{
            state.accountData = action.payload;
            state.isLoggedIn = true;
            const temp = {...state.accountData, "isLoggedIn": state.isLoggedIn};
            localStorage.setItem("account", JSON.stringify(temp));
        },
        logOutUser: (state, action) => {
            state.accountData = [];
            state.isLoggedIn = false;
            localStorage.clear();
        },
    }
});

export const { setAccount, logOutUser } = UserSlice.actions;

export const getAccountData = (state) => state.userState.accountData;
export const loginState = (state) => state.userState.isLoggedIn;


export default UserSlice.reducer;