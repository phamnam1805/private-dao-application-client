import { createSlice } from "@reduxjs/toolkit";
import { LS, THEME_MODE } from "src/configs/constance";
import { defaultClient } from "src/services/requestClient";

const initialThemeMode = localStorage.getItem(LS.THEME);

const initialState = {
  themeMode: initialThemeMode === null ? THEME_MODE.DARK : initialThemeMode,
  themeText: initialThemeMode === null ? "Dark mode" : initialThemeMode == THEME_MODE.DARK ? "Dark mode" : "Light mode",
};

export const toggleMode = () => (dispatch) => {
  dispatch(toggleModeSuccess());
};

const userConfigSlice = createSlice({
  name: "userConfigSlice",
  initialState: initialState,
  reducers: {
    toggleModeSuccess: (state) => {
      const themeMode = state.themeMode === THEME_MODE.DARK ? THEME_MODE.LIGHT : THEME_MODE.DARK;
      const themeText = themeMode === THEME_MODE.DARK ? "Dark mode" : "Light mode";
      state.themeMode = themeMode;
      state.themeText = themeText;
      localStorage.setItem(LS.THEME, themeMode);
    },
  },
});

export default userConfigSlice.reducer;
export const { toggleModeSuccess } = userConfigSlice.actions;
