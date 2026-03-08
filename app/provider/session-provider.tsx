"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store/auth/auth.store";
import { getSession } from "@/app/store/auth/auth.api";

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const { storeAuthData, deleteAuthData, user } = useAuthStore();
  const [loading, setLoading] = useState(true);

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
          deleteAuthData();
        }
      })
      .catch(() => deleteAuthData())
      .finally(() => setLoading(false));
  }, [user, storeAuthData, deleteAuthData]);

  return <>{children}</>;
}
