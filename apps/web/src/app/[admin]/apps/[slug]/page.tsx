"use client";

import { useEffect, useState } from "react";
import { get } from "@vercel/edge-config";

export default function AppPage() {
  const [data, setData] = useState("");

  const fetchData = async () => {
    const res = await get("greeting");
    setData(res?.toString() ?? "");
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <h1>{data ?? "-"}</h1>
    </div>
  );
}
