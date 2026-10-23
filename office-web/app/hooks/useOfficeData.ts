"use client";

import { useCallback, useEffect, useState } from "react";
import useUser from "./useUser";

// Loads data for the logged user on the client. Client components can't be
// async, so pages use this instead of awaiting API calls during render.
// `fetcher` must be stable (a module-level function or wrapped in useCallback).
function useOfficeData<T>(
  fetcher: (access_token: string) => Promise<T>,
  initialData: T
) {
  const { user, isLoadingUser } = useUser();
  const [data, setData] = useState<T>(initialData);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!user) return;

    try {
      setData(await fetcher(user.access_token));
      setError(null);
    } catch (err: Error | any) {
      setError(err.message ?? "Erro ao carregar os dados.");
    } finally {
      setIsLoadingData(false);
    }
  }, [user, fetcher]);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    user,
    data,
    // For optimistic updates; call reload() to resync with the API
    setData,
    error,
    reload,
    isLoading: isLoadingUser || (!!user && isLoadingData),
  };
}

export default useOfficeData;
