"use client";

import dynamic from "next/dynamic";

const DynamicChat = dynamic(() => import("@/components/chat/EventChat"), {
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900/20 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
      <div className="text-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-slate-500 font-medium">Loading Chat...</p>
      </div>
    </div>
  ),
  ssr: false,
});

export default DynamicChat;
