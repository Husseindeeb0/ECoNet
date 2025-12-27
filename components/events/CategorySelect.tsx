"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Check, Sparkles } from "lucide-react";

interface CategorySelectProps {
  categories: readonly string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  customCategory: string;
  onCustomCategoryChange: (value: string) => void;
}

export default function CategorySelect({
  categories,
  selectedCategory,
  onCategoryChange,
  customCategory,
  onCustomCategoryChange,
}: CategorySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (category: string) => {
    onCategoryChange(category);
    setIsOpen(false);
  };

  return (
    <div className="space-y-3" ref={containerRef}>
      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
        Category
      </label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex w-full items-center justify-between rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800 px-4 py-3.5 text-sm font-medium transition-all hover:border-purple-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
        >
          <span className="flex items-center gap-2">
            {selectedCategory === "Other" && customCategory ? (
              <Sparkles className="h-4 w-4 text-purple-500" />
            ) : null}
            {selectedCategory === "Other"
              ? customCategory || "Other (Custom)"
              : selectedCategory}
          </span>
          <ChevronDown
            className={`h-5 w-5 text-slate-400 transition-transform duration-300 ${
              isOpen ? "rotate-180 text-purple-500" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-purple-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl ring-1 ring-purple-500/10"
            >
              <div className="max-h-60 overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-purple-200 dark:scrollbar-thumb-slate-700">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleSelect(cat)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                        : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                  >
                    {cat}
                    {selectedCategory === cat && (
                      <Check className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    )}
                  </button>
                ))}

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-1 mx-2" />

                <button
                  type="button"
                  onClick={() => handleSelect("Other")}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-medium transition-all ${
                    selectedCategory === "Other"
                      ? "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400"
                      : "text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  Other (Custom)
                  {selectedCategory === "Other" && (
                    <Check className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {selectedCategory === "Other" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden"
        >
          <input
            type="text"
            required
            placeholder="What's the unique category name?"
            value={customCategory}
            onChange={(e) => onCustomCategoryChange(e.target.value)}
            className="block w-full rounded-xl border-2 border-purple-100 dark:border-slate-700 bg-purple-50/50 dark:bg-slate-800 px-4 py-3.5 text-sm font-medium shadow-sm transition-all placeholder:text-slate-400 focus:border-purple-500 focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-slate-900 dark:text-white"
          />
        </motion.div>
      )}

      <input
        type="hidden"
        name="category"
        value={selectedCategory === "Other" ? customCategory : selectedCategory}
      />
    </div>
  );
}
