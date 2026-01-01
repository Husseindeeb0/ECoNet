"use client";

import dynamic from "next/dynamic";

const AIChatDynamic = dynamic(() => import("@/components/ai/AIChat"), {
  ssr: false,
});

const VantaBackgroundDynamic = dynamic(
  () => import("@/components/ui/VantaBackground"),
  { ssr: false }
);

export function DynamicComponents() {
  return (
    <>
      <VantaBackgroundDynamic />
      <AIChatDynamic />
    </>
  );
}
