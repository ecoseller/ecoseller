import { IUser, IGroup, IPermission } from "@/types/user";
import { axiosPrivate } from "@/utils/axiosPrivate";


export const updateRoles = async (email: string, data: string[]) => {
  // Update existing group
  // URL: /roles/user-groups
  // Method: PUT
  // Params: data
  // Return: Promise
  console.log("updateGroups", data);
  return await axiosPrivate.put(`/roles/user-groups/${email}`, {
    roles: data,
  });
};

export const createGroup = async (
  name: string,
  description: string,
  permissions: string[]
) => {
  // Create new group
  // URL: /roles/groups
  // Method: POST
  // Params: data
  // Return: Promise
  console.log("createGroup", { name, description, permissions });
  return await axiosPrivate.post(`/roles/groups`, {
    name,
    description,
    permissions,
  });
};

export const updateGroup = async (
  name: string,
  description: string,
  permissions: IPermission[]
) => {
  // Update existing group
  // URL: /roles/groups
  // Method: PUT
  // Params: data
  // Return: Promise
  console.log("updateGroup", { name, description, permissions });
  return await axiosPrivate.put(`/roles/groups/${name}`, {
    name,
    description,
    permissions,
  });
};

export const getPermissions = async () => {
  // Get all permissions
  // URL: /roles/permissions
  // Method: GET
  // Return: Promise
  console.log("getPermissions");
  return await axiosPrivate.get(`/roles/permissions`);
};
