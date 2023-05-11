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
  permissions: ContextPermissions[];
}

interface IPermissionProviderProps {
  children: React.ReactNode;
  permission: ContextPermissions;
}

const PermissionContext = createContext<Partial<IPermissionContextProps>>({});

export const PermissionProvider = ({
  children,
  permission,
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

  const checkHasPermission = async () => {
    console.log("checkHasPermission")
    if (!permission) {
      setHasPermission(true);
      return;
    }
    if (user?.is_admin == true) {
      setHasPermission(true);
      return;
    }

    if (
      permissions.filter(
        (perm: IPermission) => (perm.name as ContextPermissions) === permission
      ).length > 0
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

export const usePermission = (): any => useContext(PermissionContext);
