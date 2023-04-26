import { IUser, IGroup } from "@/types/user";
import { axiosPrivate } from "@/utils/axiosPrivate";

export const deleteUser = async (email: string) => {
  // Delete existing user
  // URL: /user/delete-user
  // Method: POST
  // Params: data
  // Return: Promise
  console.log("deleteUser", email);
  return await axiosPrivate.delete(`/user/users/${email}`);
};

export const createUser = async (email: string, password: string) => {
  // Create new user
  // URL: /user/register
  // Method: POST
  // Params: email, password
  // Return: Promise
  console.log("createUser", email, password);
  return await axiosPrivate.post(`user/users`, { email, password });
};

export const updateUser = async (data: IUser) => {
  // Update existing user
  // URL: /user
  // Method: PUT
  // Params: data
  // Return: Promise
  console.log("updateUser", data);
  return await axiosPrivate.put(`/user/users/${data.email}`, data);
};

export const getUserData = async (email: string) => {
  // Get user data
  // URL: /user
  // Method: GET
  // Params: email
  // Return: Promise
  console.log("getUserData", email);
  return await axiosPrivate.get(`/user/users/${email}`);
};

export const getUserGroups = async (email: string) => {
  // Get user groups
  // URL: /roles
  // Method: GET
  // Params: email
  // Return: Promise
  console.log("getUserGroups", email);
  return await axiosPrivate.get(`/roles/user-groups/${email}`);
};

export const deleteGroup = async (data: IGroup) => {
  // Delete existing group
  // URL: /roles/delete-group
  // Method: POST
  // Params: data
  // Return: Promise
  console.log("deleteGroup", data);
  return await axiosPrivate.delete(`/roles/groups/${data.name}`);
};

export const getGroups = async () => {
  // Get all groups
  // URL: /roles/groups
  // Method: GET
  // Return: Promise
  console.log("getGroups");
  return await axiosPrivate.get(`/roles/groups`);
};

export const updateRoles = async (email: string, data: string[]) => {
  // Update existing group
  // URL: /roles
  // Method: PUT
  // Params: data
  // Return: Promise
  console.log("updateGroups", data);
  return await axiosPrivate.put(`/roles/user-groups/${email}`, {
    groups: data,
  });
};

export const createGroup = async (name: string, description: string, permissions: string[]) => {
  // Create new group
  // URL: /roles/create-group
  // Method: POST
  // Params: data
  // Return: Promise
  console.log("createGroup", { name, description, permissions });
  return await axiosPrivate.post(`/roles/groups`, { name, description, permissions });
}

export const getPermissions = async () => {
  // Get all permissions
  // URL: /roles/permissions
  // Method: GET
  // Return: Promise
  console.log("getPermissions");
  return await axiosPrivate.get(`/roles/permissions`);
}