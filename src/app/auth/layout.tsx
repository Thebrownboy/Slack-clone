import React from "react";

export default function AuthScreenLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex items-center justify-center bg-[#5c3b58]">
      <div className="md:h-auto md-[420px]">{children}</div>
    </div>
  );
}
