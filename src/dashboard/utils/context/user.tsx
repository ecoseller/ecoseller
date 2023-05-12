import { IGroup, IPermission, IUser } from "@/types/user";
import { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { ContextPermissions } from "./permission";
interface IUserContextProps {
  user: IUser | null;
  roles: IGroup[] | [];
  checkHasPermission: (permission: ContextPermissions) => boolean;
}

interface IUserProviderProps {
  children: React.ReactNode;
}

const UserContext = createContext<Partial<IUserContextProps>>({});

export const UserProvider = ({ children }: IUserProviderProps): JSX.Element => {
  const [user, setUser] = useState<IUser | null>(null);
  const [roles, setRoles] = useState<IGroup[]>([]);

  const { pathname } = useRouter();

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    getRoles();
  }, [user, pathname]);

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
      .then((data) => setRoles(data))
      .catch((error) => {
        console.log(error);
        setRoles([]);
      });
  };

  const checkHasPermission = (permission: ContextPermissions): boolean => {
    if (!user) return false;
    if (user.is_admin) return true;
    if (roles.length === 0) return false;

    console.log("user from user", user);

    const permissions: IPermission[] = [];
    roles.forEach((role: IGroup) => {
      role.permissions.forEach((permission: IPermission) => {
        permissions.push(permission);
      });
    });

    if (
      permissions.filter(
        (perm: IPermission) => (perm.name as ContextPermissions) === permission
      ).length > 0
    ) {
      return true;
    }
    return false;
  };

  const value = {
    user,
    roles,
    checkHasPermission,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): any => useContext(UserContext);
