export interface IUser {
  email: string;
  first_name: string;
  last_name: string;
  is_admin: boolean;
  roles: string[];
}

export interface IPermission {
  name: string;
  model: string;
  description: string;
  type: string;
}
export interface IGroup {
  group_name: string;
  description: string;
  permissions: IPermission[];
}
