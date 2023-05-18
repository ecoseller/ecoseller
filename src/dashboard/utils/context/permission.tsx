import { IGroup, IPermission, IUser } from "@/types/user";
import { useState, createContext, useContext, useEffect } from "react";
import { useUser } from "./user";

export type ContextPermissions =
  // cart
  | "cart_change_permission"
  | "cart_add_permission"
  // productprice
  | "productprice_change_permission"
  | "productprice_add_permission"
  // productmedia
  | "productmedia_change_permission"
  | "productmedia_add_permission"
  // product
  | "product_change_permission"
  | "product_add_permission"
  // category
  | "category_change_permission"
  | "category_add_permission"
  // page
  | "page_change_permission"
  | "page_add_permission"
  // user
  | "user_change_permission"
  | "user_add_permission"
  // group
  | "group_change_permission"
  | "group_add_permission";

interface IPermissionContextProps {
  hasPermission: boolean;
}

interface IPermissionProviderProps {
  children: React.ReactNode;
  allowedPermissions?: ContextPermissions[];
}

const PermissionContext = createContext<IPermissionContextProps>({
  hasPermission: true,
});

export const PermissionProvider = ({
  children,
  allowedPermissions,
}: IPermissionProviderProps): JSX.Element => {
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  const { user, roles } = useUser();

  useEffect(() => {
    getUserPermission();
  }, [user, roles]);

  useEffect(() => {
    checkHasPermission();
  }, [permissions]);

  const getUserPermission = () => {
    if (!user) return;
    try {
      // extract permissions
      let permissions: IPermission[] = [];
      roles.forEach((role: IGroup) => {
        role.permissions.forEach((permission: IPermission) => {
          permissions.push(permission);
        });
      });
      setPermissions(permissions);
    } catch (error) {
      console.log(error);
      setPermissions([]);
    }
  };

  console.log(
    "allowedPermissions",
    allowedPermissions,
    permissions,
    hasPermission
  );

  const checkHasPermission = async () => {
    console.log("checkHasPermission");
    if (allowedPermissions?.length == 0) {
      setHasPermission(true);
      return;
    }
    if (user?.is_admin == true) {
      console.log("is admin");
      setHasPermission(true);
      return;
    }

    // check if at leas one users permission is in allowedPermissions
    if (
      allowedPermissions?.every((permission) =>
        permissions.some((p) => p.name == permission)
      )
    ) {
      setHasPermission(true);
    }
  };

  const value = {
    hasPermission,
  };

  return (
    <PermissionContext.Provider value={value}>
      {children}
    </PermissionContext.Provider>
  );
};

export const usePermission = (): IPermissionContextProps =>
  useContext(PermissionContext);
