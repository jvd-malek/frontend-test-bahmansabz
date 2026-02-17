"use client";

import { useState } from "react";
import DropdownComponent, { DropdownOption, DropdownGroup } from "@/components/dropdown/dropdown";

export default function DropdownPage() {
  // مثال 1: آیتم‌های ساده
  const simpleOptions: DropdownOption[] = [
    { id: 1, label: "گزینه 1", value: 1 },
    { id: 2, label: "گزینه 2", value: 2 },
    { id: 3, label: "گزینه 3", value: 3 },
    { id: 4, label: "گزینه 4", value: 4 },
    { id: 5, label: "گزینه 5", value: 5 },
  ];

  // مثال 2: آیتم‌های با گروه
  const groupedOptions: DropdownGroup[] = [
    {
      label: "میوه‌ها",
      options: [
        { id: 1, label: "سیب", value: "apple", group: "میوه‌ها" },
        { id: 2, label: "موز", value: "banana", group: "میوه‌ها" },
        { id: 3, label: "پرتقال", value: "orange", group: "میوه‌ها" },
      ],
    },
    {
      label: "سبزیجات",
      options: [
        { id: 4, label: "هویج", value: "carrot", group: "سبزیجات" },
        { id: 5, label: "کاهو", value: "lettuce", group: "سبزیجات" },
        { id: 6, label: "گوجه", value: "tomato", group: "سبزیجات" },
      ],
    },
  ];

  // مثال 3: آیتم‌های زیاد برای تست مجازی‌سازی
  const manyOptions: DropdownOption[] = Array.from({ length: 1000 }, (_, i) => ({
    id: i + 1,
    label: `گزینه ${i + 1}`,
    value: i + 1,
  }));

  const [selected1, setSelected1] = useState<(string | number)[]>([]);
  const [selected2, setSelected2] = useState<(string | number)[]>([]);
  const [selected3, setSelected3] = useState<(string | number)[]>([]);
  const [selected4, setSelected4] = useState<(string | number)[]>([]);

  return (
      <main className="container mx-auto px-4 py-8 mb-40" dir="rtl">
        <h1 className="text-3xl font-bold mb-8 text-center">کامپوننت Dropdown پیشرفته</h1>

        <div className="space-y-8 max-w-2xl mx-auto">
          {/* مثال 1: انتخاب چندتایی با جستجو */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">مثال 1: انتخاب چندتایی با جستجو</h2>
            <DropdownComponent
              options={simpleOptions}
              value={selected1}
              onChange={setSelected1}
              placeholder="گزینه‌ای انتخاب کنید..."
              searchable={true}
              multiple={true}
              selectAll={true}
            />
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-200">
              انتخاب شده: {selected1.join(", ")}
            </div>
          </div>

          {/* مثال 2: گروه‌بندی */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">مثال 2: گروه‌بندی آیتم‌ها</h2>
            <DropdownComponent
              options={groupedOptions}
              value={selected2}
              onChange={setSelected2}
              placeholder="گزینه‌ای انتخاب کنید..."
              searchable={true}
              multiple={true}
              groupable={true}
              selectAll={true}
            />
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-200">
              انتخاب شده: {selected2.join(", ")}
            </div>
          </div>

          {/* مثال 3: مجازی‌سازی برای آیتم‌های زیاد */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">مثال 3: مجازی‌سازی (1000 آیتم)</h2>
            <DropdownComponent
              options={manyOptions}
              value={selected3}
              onChange={setSelected3}
              placeholder="گزینه‌ای انتخاب کنید..."
              searchable={true}
              multiple={true}
              selectAll={true}
              virtualized={true}
              maxHeight={400}
            />
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-200">
              {selected3.length} مورد انتخاب شده
            </div>
          </div>

          {/* مثال 4: انتخاب تکی */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">مثال 4: انتخاب تکی</h2>
            <DropdownComponent
              options={simpleOptions}
              value={selected4}
              onChange={setSelected4}
              placeholder="یک گزینه انتخاب کنید..."
              searchable={true}
              multiple={false}
              selectAll={false}
            />
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-200">
              انتخاب شده: {selected4[0] || "هیچ"}
            </div>
          </div>
        </div>
      </main>
  );
}
