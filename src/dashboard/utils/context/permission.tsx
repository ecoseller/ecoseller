import { IGroup, IPermission, IUser } from "@/types/user";
import { useState, createContext, useContext, useEffect } from "react";

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
  const [user, setUser] = useState<IUser | null>(null);
  const [roles, setRoles] = useState<IGroup[]>([]);
  const [permissions, setPermissions] = useState<IPermission[]>([]);
  const [hasPermission, setHasPermission] = useState<boolean>(false);

  console.log("required permission", permission);

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getRoles();
  }, [user, permission]);

  const getUser = async () => {
    await fetch(`/api/user/detail`)
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((error) => {
        console.log(error);
        setUser(null);
      });
  };
  const getRoles = async () => {
    if (!user) return;
    await fetch(`/api/roles/user/${user.email}`)
      .then((res) => res.json())
      .then((data) => {
        setRoles(data);
        // extract permissions
        let permissions: IPermission[] = [];
        data.forEach((role: IGroup) => {
          role.permissions.forEach((permission: IPermission) => {
            permissions.push(permission);
          });
        });
        setPermissions(permissions);
        // check if user has permission
        if (
          permissions.filter((perm: IPermission) => perm.name === permission)
            .length > 0
        ) {
          setHasPermission(true);
        }
      })
      .catch((error) => {
        console.log(error);
        setRoles([]);
      });
  };

  console.log("HasPermissionAtEnd", hasPermission);

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
