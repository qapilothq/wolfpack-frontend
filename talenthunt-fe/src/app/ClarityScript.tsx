"use client";

import Script from "next/script";

interface ClarityScriptProps {
  clarityProjectId: string;
}

export default function ClarityScript({
  clarityProjectId,
}: ClarityScriptProps) {
  return (
    <Script
      id="microsoft-clarity"
      src={`https://www.clarity.ms/tag/${clarityProjectId}`}
      strategy="beforeInteractive"
      onLoad={() => console.log("Clarity script loaded successfully")}
      onError={(e) => console.error("Clarity script failed to load", e)}
    />
  );
}
