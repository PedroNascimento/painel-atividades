"use client";

import { useState } from "react";

interface TabGroupProps {
  tabs: { id: string; label: string }[];
  children: (activeTab: string) => React.ReactNode;
}

export function TabGroup({ tabs, children }: TabGroupProps) {
  const [active, setActive] = useState(tabs[0]?.id ?? "");

  return (
    <div className="flex flex-col items-center w-full">
      <div className="sticky top-0 z-50 pt-2 pb-4 mb-2 bg-bg-screen/90 backdrop-blur-md grid grid-cols-3 flex-wrap sm:flex sm:flex-nowrap w-full max-w-4xl justify-center gap-2 px-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`cursor-pointer w-full sm:flex-1 min-w-0 min-h-[40px] px-1 sm:px-4 sm:min-h-[44px] rounded-lg sm:rounded-full text-[10px] min-[400px]:text-[11px] sm:text-sm font-medium transition-all focus-visible:ring-2 focus-visible:ring-ring flex items-center justify-center text-center ${
              active === tab.id
                ? "bg-linear-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] border border-emerald-400/50 transform sm:scale-[1.02]"
                : "border border-border bg-bg-elevated/50 text-text-secondary hover:bg-bg-elevated hover:text-text-primary hover:border-border-subtle"
            }`}
          >
            <span className="break-words line-clamp-2 sm:whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>
      <div className="w-full max-w-4xl">
        {children(active)}
      </div>
    </div>
  );
}
