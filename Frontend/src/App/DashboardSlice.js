import { createSlice } from '@reduxjs/toolkit';
const localData = JSON.parse(localStorage.getItem('account'));
const Dstate = JSON.parse(localStorage.getItem('dState'));
const theme = localStorage.getItem('theme') || 'dark';
const localCredits = localStorage.getItem('credits');
const initialState = {
  dashboardMenuState: true,
  dashboardFeature: Dstate ? Dstate : 'Home',
  account: localData ? localData : {},
  isLoggedIn: localData ? localData.isLoggedIn : false,
  profileData: [],
  theme: theme,
  credits: localCredits ? localCredits : -1
};

const DashboardSlice = createSlice({
  initialState,
  name: 'dashboard',
  reducers: {
    setOpenDMenu: (state, action) => {
      state.dashboardMenuState = action.payload.dashboardMenuState;
    },
    setCloseDMenu: (state, action) => {
      state.dashboardMenuState = action.payload.dashboardMenuState;
    },
    setDFeature: (state, action) => {
      state.dashboardFeature = action.payload.dashboardFeature;
      localStorage.setItem(
        'dState',
        JSON.stringify(action.payload.dashboardFeature),
      );
    },
    setAccount: (state, action) => {
      state.account = action.payload;
      state.isLoggedIn = true;
      state.credits = action.payload.credits;
      const temp = { ...state.account, isLoggedIn: state.isLoggedIn };
      localStorage.setItem('account', JSON.stringify(temp));
      localStorage.setItem('credits', state.credits);
    },
    LogOut: (state, action) => {
      state.account = [];
      state.profileData = [];
      state.isLoggedIn = false;
      state.dashboardMenuState = false;
      state.dashboardFeature = 'dashboard';
      localStorage.clear();
    },
    setAccountAfterRegister: (state, action) => {
      state.account = action.payload;
      state.isLoggedIn = false;
      const temp1 = { ...state.account, isLoggedIn: state.isLoggedIn };
      localStorage.setItem('account', JSON.stringify(temp1));
    },
    setTheme: (state, action) => {
      state.theme = action.payload.theme;
      localStorage.setItem('theme', action.payload.theme);
    },
    setCredits: (state, action) => {
      state.credits = action.payload.credits;
      localStorage.setItem('credits', state.credits);
    },
  },
});

export const {
  setOpenDMenu,
  setCloseDMenu,
  setDFeature,
  setAccount,
  setAccountAfterRegister,
  LogOut,
  setTheme,
  setCredits
} = DashboardSlice.actions;

export const dashboardMenuState = (state) => state.dashboard.dashboardMenuState;
export const dashboardFeature = (state) => state.dashboard.dashboardFeature;
export const isUserLoggedIn = (state) => state.dashboard.isLoggedIn;
export const selectAccount = (state) => state.dashboard.account;
export const selectProfileData = (state) => state.dashboard.profileData;
export const selectTheme = (state) => state.dashboard.theme;
export const selectCredits = (state) => state.dashboard.credits;

export default DashboardSlice.reducer;
