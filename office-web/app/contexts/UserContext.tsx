"use client";

import React, { createContext, ReactNode, useCallback, useState } from "react";

interface User {
  access_token: string;
  office_id: string;
  email: string;
}

interface UserContextData {
  user: User;
  setCurrentUser: (user: User) => void;
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

  return (
    <UserContext.Provider
      value={{
        user,
        setCurrentUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
