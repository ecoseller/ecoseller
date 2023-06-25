import { IUser } from "@/types/user";
import { useRouter } from "next/router";
import { useState, createContext, useContext, useEffect } from "react";
interface IUserContextProps {
  user: IUser | null;
}

interface IUserProviderProps {
  children: React.ReactNode;
}

const UserContext = createContext<Partial<IUserContextProps>>({});

export const UserProvider = ({ children }: IUserProviderProps): JSX.Element => {
  const [user, setUser] = useState<IUser | null>(null);
  const { pathname } = useRouter();

  useEffect(() => {
    getUser();
  }, [pathname]);

  const getUser = async () => {
    await fetch(`/api/user/detail`)
      .then((res) => res.json())
      .then((data) => {
        setUser({
          email: data["email"],
          first_name: data["first_name"],
          last_name: data["last_name"],
        } as IUser);
      })
      .catch((error) => {
        console.log(error);
        setUser(null);
      });
  };

  const value = {
    user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = (): any => useContext(UserContext);
