"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/store/store";
import { checkAuthSessionThunk } from "@/redux/states/auth/authThunks";

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuthSessionThunk());
  }, [dispatch]);

  return null;
}
