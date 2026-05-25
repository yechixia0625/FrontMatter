"use client";

import dynamic from "next/dynamic";
import type { MapData } from "@/types/map";

const LeafletMap = dynamic(() => import("./LeafletMap"), { ssr: false });

interface MapToggleProps {
  mapData: MapData;
}

export function MapToggle({ mapData }: MapToggleProps) {
  return <LeafletMap mapData={mapData} />;
}
