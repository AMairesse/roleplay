"use client";

import { useEffect, useState } from 'react';
import { ProtectRoute } from '@/utils/auth';
import { useRouter } from 'next/navigation';
import { useGlobalState, useGlobalDispatch } from '@/context/GlobalState';

export default function EditWorld() {
  const router = useRouter();
  const dispatch = useGlobalDispatch();
  const { currentWorld } = useGlobalState();

  useEffect(() => {
  }, []);

  return (
    <div className="h-full p-4">
      Live
    </div>
  );
}
