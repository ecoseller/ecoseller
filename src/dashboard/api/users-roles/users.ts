import { IUser } from "@/types/user";
import { axiosPrivate } from "@/utils/axiosPrivate";

export const deleteUser = async (data: IUser) => {
    // Delete existing user
    // URL: /user
    // Method: POST
    // Params: data
    // Return: Promise
    console.log("deleteUser", data);
    return await axiosPrivate.post(`/user/delete-user`, data);
};

export const createUser = async (email: string, password: string) => {
    // Create new user
    // URL: /user/register
    // Method: POST
    // Params: email, password
    // Return: Promise
    console.log("createUser", email, password);
    return await axiosPrivate.post(`/user/register`, { email, password });
}

export const updateUser = async (data: IUser) => {
    // Update existing user
    // URL: /user
    // Method: PUT
    // Params: data
    // Return: Promise
    console.log("updateUser", data);
    return await axiosPrivate.put(`/user/`, data);
}