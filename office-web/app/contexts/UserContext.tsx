"use client";

import { login } from "@/app/lib/api/office-api/auth/login";
import { deleteCookie, getCookie, setCookie } from "cookies-next";
import React, { createContext, ReactNode, useCallback, useState } from "react";

interface User {
  access_token: string;
  office_id: string;
  email: string;
}

interface UserContextData {
  getCurrentUser: () => Promise<User | null>;
  setCurrentUser: (user: User) => void;
  loginUser: (
    email: string,
    password: string,
    office_id: string
  ) => Promise<User | null>;
  logoutUser: () => void;
}

export const UserContext = createContext<UserContextData>(
  {} as UserContextData
);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User>({} as User);

  const setCurrentUser = useCallback(
    (newUser: User) => {
      setUser(newUser);
    },
    [setUser]
  );

  const getCurrentUser = useCallback(async () => {
    if (Object.keys(user).length > 0) {
      return user;
    }

    const userCookie = getCookie("user")?.valueOf() as string;

    if (userCookie) {
      const loggedUser = JSON.parse(userCookie) as User;
      setCurrentUser(loggedUser);
      return loggedUser;
    }

    return null;
  }, [setCurrentUser, user]);

  const loginUser = useCallback(
    async (email: string, password: string, office_id: string) => {
      const loginResponse = await login({ email, password, office_id });

      if (loginResponse) {
        const loggedUser = {
          access_token: loginResponse.access_token,
          email,
          office_id,
        };
        setCurrentUser(loggedUser);

        setCookie("user", JSON.stringify(loggedUser), {
          maxAge: 60 * 60 * 24, // 1 days
          path: "/",
        });

        return loggedUser;
      } else {
        return null;
      }
    },
    [setCurrentUser]
  );

  const logoutUser = useCallback(() => {
    setCurrentUser({} as User);
    deleteCookie("user", { path: "/" });
  }, [setCurrentUser]);

  return (
    <UserContext.Provider
      value={{
        getCurrentUser,
        setCurrentUser,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
