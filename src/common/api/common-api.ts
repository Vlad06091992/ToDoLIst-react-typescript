import axios from "axios";

const settings = {
  withCredentials: true,
  headers: {
    "API-KEY": "cd1d76c4-3f61-41eb-ba86-260b41d4cb5e"
  }
};
export const instance = axios.create({
  baseURL: "https://social-network.samuraijs.com/api/1.1/",
  ...settings
});
