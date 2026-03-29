import axiosClient from "./axios";

export const authService = {
  login: async (data: { login: string; password: string }) => {
    const res = await axiosClient.post("/login", data);
    return res.data;
  },
};
