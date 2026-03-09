"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/auth/auth.store";
import { getSession, logoutRequest } from "@/app/store/auth/auth.api";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { storeAuthData, deleteAuthData, user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  const handleAuthFailure = async () => {
    deleteAuthData();
    const res = await logoutRequest();
    console.log(res);
  };
  useEffect(() => {
    if (user) {
      setLoading(false);
      return;
    }

    getSession()
      .then((res) => {
        if (res?.data?.user) {
          storeAuthData(res.data.user);
        } else {
          handleAuthFailure();
        }
      })
      .catch(() => handleAuthFailure())
      .finally(() => setLoading(false));
  }, [user, storeAuthData, deleteAuthData]);

  return <>{children}</>;
}
