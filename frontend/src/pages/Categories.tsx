import React, { useState, useMemo } from "react";
import { useOutletContext } from "react-router-dom";
import { Layers, Plus, Tag } from "lucide-react";
import { LayoutContextType } from "../components/Layout";
import { CATEGORY_ICONS, CATEGORY_ICONS_Inc } from "../assets/color";

interface CategoryDetail {
  name: string;
  type: "income" | "expense";
  description: string;
}

const INITIAL_CATEGORIES: CategoryDetail[] = [
  { name: "Salary", type: "income", description: "Primary employment earnings" },
  { name: "Freelance", type: "income", description: "Contracting and secondary gigs" },
  { name: "Investment", type: "income", description: "Stock dividends and savings yield" },
  { name: "Bonus", type: "income", description: "One-off corporate reward earnings" },
  { name: "Food", type: "expense", description: "Groceries, dining out, and beverages" },
  { name: "Housing", type: "expense", description: "Rent payments, mortgages, and repairs" },
  { name: "Transport", type: "expense", description: "Transit fares, fuel, and car upkeep" },
  { name: "Shopping", type: "expense", description: "Clothing, gadgets, and general purchases" },
  { name: "Entertainment", type: "expense", description: "Movies, concerts, streaming services" },
  { name: "Utilities", type: "expense", description: "Electricity, cellular, internet, water" },
  { name: "Healthcare", type: "expense", description: "Medical checks, pharmacy, insurance" },
];

const CategoriesPage = () => {
  const { transactions = [] } = useOutletContext<LayoutContextType>();
  const [categories, setCategories] = useState<CategoryDetail[]>(INITIAL_CATEGORIES);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCat, setNewCat] = useState({ name: "", type: "expense" as "income" | "expense", description: "" });

  // Count usage of categories
  const usageCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    transactions.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, [transactions]);

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name.trim()) return;

    setCategories((prev) => {
      if (prev.some((c) => c.name.toLowerCase() === newCat.name.trim().toLowerCase())) return prev;
      return [...prev, { name: newCat.name.trim(), type: newCat.type, description: newCat.description.trim() || "User custom categorization" }];
    });

    setNewCat({ name: "", type: "expense", description: "" });
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4 md:p-8 text-text-app">
      {/* Header Container */}
      <div className="bg-surface-app rounded-2xl p-6 border border-border-app mb-6 shadow-xs">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tight text-text-app">Categories</h1>
            <p className="text-xs text-muted-app mt-0.5">Configure transaction classification tags and source mappings</p>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-[var(--color-gold-hex)] hover:bg-[var(--color-gold-hover-hex)] text-[#FAF9F6] dark:text-[#0F0F11] px-4 py-2.5 rounded-xl transition-all duration-150 text-xs font-semibold cursor-pointer shadow-xs active:scale-[0.98]"
          >
            <Plus size={14} /> New Category
          </button>
        </div>
      </div>

      {showAddForm && (
        <div className="bg-surface-app rounded-2xl p-6 border border-border-app mb-6 shadow-xs animate-fadeIn">
          <h3 className="text-base font-serif font-semibold tracking-tight text-text-app mb-4 pb-2 border-b border-border-app">Add Category</h3>
          <form onSubmit={handleAddCategorySubmit} className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-[10px] font-semibold text-muted-app uppercase tracking-widest font-sans mb-1.5">Name</label>
              <input
                type="text"
                placeholder="e.g. Travel"
                required
                value={newCat.name}
                onChange={(e) => setNewCat((prev) => ({ ...prev, name: e.target.value }))}
                className="px-4 py-2.5 bg-bg-app border border-border-app rounded-xl text-xs text-text-app focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-hex)] focus:border-[var(--color-gold-hex)] font-sans w-full max-w-[200px]"
              />
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-muted-app uppercase tracking-widest font-sans mb-1.5">Type</label>
              <select
                value={newCat.type}
                onChange={(e: any) => setNewCat((prev) => ({ ...prev, type: e.target.value }))}
                className="bg-bg-app border border-border-app rounded-xl px-4 py-2.5 text-xs text-text-app focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-hex)] focus:border-[var(--color-gold-hex)] cursor-pointer min-w-[150px] font-sans font-medium"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-semibold text-muted-app uppercase tracking-widest font-sans mb-1.5">Description</label>
              <input
                type="text"
                placeholder="Description of categorization"
                value={newCat.description}
                onChange={(e) => setNewCat((prev) => ({ ...prev, description: e.target.value }))}
                className="px-4 py-2.5 bg-bg-app border border-border-app rounded-xl text-xs text-text-app focus:outline-none focus:ring-1 focus:ring-[var(--color-gold-hex)] focus:border-[var(--color-gold-hex)] font-sans w-full md:w-64"
              />
            </div>
            <button
              type="submit"
              className="bg-[var(--color-gold-hex)] hover:bg-[var(--color-gold-hover-hex)] text-[#FAF9F6] dark:text-[#0F0F11] px-4 py-2.5 rounded-xl text-xs font-semibold cursor-pointer shadow-xs transition-all duration-150"
            >
              Add Tag
            </button>
          </form>
        </div>
      )}

      {/* Grid of categories */}
      <div className="bg-surface-app rounded-2xl p-6 border border-border-app shadow-xs">
        <h3 className="text-base font-serif font-semibold tracking-tight text-text-app mb-4 pb-2 border-b border-border-app flex items-center gap-2">
          <Layers size={14} className="text-[var(--color-gold-hex)]" /> Active Classifications
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((c) => {
            const iconsMap = c.type === "income" ? CATEGORY_ICONS_Inc : CATEGORY_ICONS;
            const icon = iconsMap[c.name] || <Tag size={16} />;
            const count = usageCounts[c.name] || 0;

            return (
              <div key={c.name} className="bg-bg-app border border-border-app rounded-xl p-4 flex items-start justify-between shadow-2xs hover:shadow-xs transition-all duration-150">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-surface-app border border-border-app rounded-lg text-[var(--color-gold-hex)]">
                    {icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-text-app">{c.name}</h4>
                    <p className="text-[10px] text-muted-app mt-0.5 max-w-[180px] line-clamp-1 font-sans">{c.description}</p>
                  </div>
                </div>
                <div className="text-right font-sans">
                  <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-md ${
                    c.type === "income" 
                      ? "bg-[#5E7A68]/10 text-[#5E7A68] border border-[#5E7A68]/20" 
                      : "bg-[#78716C]/10 text-[#78716C] border border-[#78716C]/20"
                  }`}>
                    {c.type}
                  </span>
                  <p className="text-[9px] text-muted-app mt-2.5 font-semibold">{count} records</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
