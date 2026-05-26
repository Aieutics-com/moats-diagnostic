"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { MOATS, type Verdict } from "@/lib/moats-data";
import type { MoatVerdict } from "@/lib/scoring";

interface MoatRadarProps {
  verdicts: MoatVerdict[];
}

const verdictValue = (v: Verdict): number => {
  switch (v) {
    case "load-bearing":
      return 3;
    case "aspirational":
      return 2;
    case "absent":
      return 1;
    case "na":
      return 0;
  }
};

export default function MoatRadar({ verdicts }: MoatRadarProps) {
  const data = MOATS.map((m) => {
    const v = verdicts.find((x) => x.moatId === m.id);
    return {
      moat: m.shortName,
      value: v ? verdictValue(v.verdict) : 0,
    };
  });

  return (
    <div className="w-full h-80 md:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="#e5e5e5" />
          <PolarAngleAxis
            dataKey="moat"
            tick={{
              fontSize: 12,
              fill: "#1a1a1a",
              fontFamily: "var(--font-heading)",
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 3]}
            tickCount={4}
            tick={{ fontSize: 10, fill: "#6b6b6b" }}
            axisLine={false}
            type="number"
          />
          <Radar
            name="Verdict"
            dataKey="value"
            stroke="#FF5F1F"
            fill="#FF5F1F"
            fillOpacity={0.35}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>
      <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-grey)] text-center mt-2">
        Rings: 0 = N/A &middot; 1 = absent &middot; 2 = aspirational &middot; 3 = load-bearing
      </p>
    </div>
  );
}
