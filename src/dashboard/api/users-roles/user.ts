import { axiosPrivate } from "@/utils/axiosPrivate";

export const getUser = async () => {
  // Get user data
  // URL: /user
  // Method: GET
  // Params: email
  // Return: Promise
  return await axiosPrivate.get(`/user`);
};
