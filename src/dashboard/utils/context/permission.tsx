import { IGroup, IPermission, IUser } from "@/types/user";
import { useState, createContext, useContext, useEffect } from "react";
import { useUser } from "./user";

interface IPermissionContextProps {
  hasPermission: boolean;
}

interface IPermissionProviderProps {
  children: React.ReactNode;
  permission: string;
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
    if (
      permissions.filter((perm: IPermission) => perm.name === permission)
        .length > 0
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
