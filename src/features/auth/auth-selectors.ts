import { AppRootStateType } from "app/store";

export const selectIsLoggedIn = (state: AppRootStateType) => state.auth.isLoggedIn;
export const captchaUrl = (state: AppRootStateType) => state.auth.captchaUrl;
