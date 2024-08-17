"use client";

import React from "react";
import dynamic from "next/dynamic";

const App = dynamic(() => import("../App"), { ssr: false });
const Roleplay = dynamic(() => import("../Roleplay"), { ssr: false });

export function ClientOnly() {
    return <Roleplay />;
}
