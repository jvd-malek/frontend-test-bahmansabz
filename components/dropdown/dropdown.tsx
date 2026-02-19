"use client";

import { Fragment, useState, useMemo, useRef, useEffect } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { 
  HiChevronDown, 
  HiCheck, 
  HiX,
  HiSearch
} from "react-icons/hi";

export interface DropdownOption {
  id: string | number;
  label: string;
  value: string | number;
  group?: string;
  disabled?: boolean;
}

export interface DropdownGroup {
  label: string;
  options: DropdownOption[];
}

export interface DropdownProps {
  options: DropdownOption[] | DropdownGroup[];
  value?: (string | number)[];
  onChange?: (selected: (string | number)[]) => void;
  placeholder?: string;
  searchable?: boolean;
  multiple?: boolean;
  groupable?: boolean;
  selectAll?: boolean;
  virtualized?: boolean;
  maxHeight?: number;
  className?: string;
  disabled?: boolean;
}

function DropdownComponent({
  options,
  value = [],
  onChange,
  placeholder = "انتخاب کنید...",
  searchable = true,
  multiple = true,
  groupable = false,
  selectAll = true,
  virtualized = true,
  maxHeight = 200,
  className = "",
  disabled = false,
}: DropdownProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const parentRef = useRef<HTMLDivElement>(null);

  // تبدیل options به فرمت یکپارچه
  const normalizedOptions = useMemo(() => {
    if (groupable && options.length > 0 && "options" in options[0]) {
      // حالت گروه‌بندی شده
      return (options as DropdownGroup[]).flatMap((group) => group.options);
    }
    return options as DropdownOption[];
  }, [options, groupable]);

  // گروه‌بندی آیتم‌ها
  const groupedOptions = useMemo(() => {
    if (!groupable) return null;

    const groups: Record<string, DropdownOption[]> = {};
    normalizedOptions.forEach((option) => {
      const groupLabel = option.group || "بدون گروه";
      if (!groups[groupLabel]) {
        groups[groupLabel] = [];
      }
      groups[groupLabel].push(option);
    });

    return Object.entries(groups).map(([label, opts]) => ({
      label,
      options: opts,
    }));
  }, [normalizedOptions, groupable]);

  // فیلتر کردن بر اساس جستجو
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return normalizedOptions;
    }

    const query = searchQuery.toLowerCase();
    return normalizedOptions.filter((option) =>
      option.label.toLowerCase().includes(query)
    );
  }, [normalizedOptions, searchQuery]);

  // فیلتر کردن گروه‌ها
  const filteredGroups = useMemo(() => {
    if (!groupedOptions) return null;
    if (!searchQuery.trim()) return groupedOptions;

    const query = searchQuery.toLowerCase();
    return groupedOptions
      .map((group) => ({
        ...group,
        options: group.options.filter((option) =>
          option.label.toLowerCase().includes(query)
        ),
      }))
      .filter((group) => group.options.length > 0);
  }, [groupedOptions, searchQuery]);

  // بررسی انتخاب بودن یک آیتم
  const isSelected = (optionValue: string | number) => {
    return value.includes(optionValue);
  };

  // انتخاب/لغو انتخاب یک آیتم
  const handleSelect = (optionValue: string | number) => {
    if (disabled) return;

    if (multiple) {
      const newValue = isSelected(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...value, optionValue];
      onChange?.(newValue);
    } else {
      onChange?.([optionValue]);
      setIsOpen(false);
    }
  };

  // انتخاب همه
  const handleSelectAll = () => {
    if (disabled) return;
    const allValues = filteredOptions
      .filter((opt) => !opt.disabled)
      .map((opt) => opt.value);
    onChange?.(allValues);
  };

  // لغو انتخاب همه
  const handleDeselectAll = () => {
    if (disabled) return;
    onChange?.([]);
  };

  // بررسی انتخاب بودن همه
  const isAllSelected = useMemo(() => {
    const selectableOptions = filteredOptions.filter((opt) => !opt.disabled);
    return (
      selectableOptions.length > 0 &&
      selectableOptions.every((opt) => isSelected(opt.value))
    );
  }, [filteredOptions, value]);

  // تعداد انتخاب‌ها
  const selectedCount = value.length;

  // متن نمایشی
  const displayText = useMemo(() => {
    if (selectedCount === 0) return placeholder;
    if (selectedCount === 1 && !multiple) {
      const selected = normalizedOptions.find((opt) => opt.value === value[0]);
      return selected?.label || placeholder;
    }
    return `${selectedCount} مورد انتخاب شده`;
  }, [selectedCount, value, normalizedOptions, placeholder, multiple]);

  // مجازی‌سازی
  const virtualizer = useVirtualizer({
    count: filteredOptions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 40,
    overscan: 5,
  });

  // مجازی‌سازی برای گروه‌ها
  const groupItems = useMemo(() => {
    if (!filteredGroups) return [];
    const items: Array<{ type: "group" | "option"; data: any }> = [];
    filteredGroups.forEach((group) => {
      items.push({ type: "group", data: group });
      group.options.forEach((option) => {
        items.push({ type: "option", data: option });
      });
    });
    return items;
  }, [filteredGroups]);

  const groupVirtualizer = useVirtualizer({
    count: groupItems.length,
    getScrollElement: () => parentRef.current,
    estimateSize: (index) => {
      const item = groupItems[index];
      return item.type === "group" ? 35 : 40;
    },
    overscan: 5,
  });

  return (
    <div className={`relative ${className}`}>
      <Listbox
        value={value}
        onChange={() => {}}
        multiple={multiple}
        disabled={disabled}
      >
        {({ open }) => {
          useEffect(() => {
            setIsOpen(open);
          }, [open]);

          // ریست کردن جستجو وقتی دراپ‌داون بسته می‌شود (خارج از فوکوس)
          useEffect(() => {
            if (!open) {
              setSearchQuery("");
            }
          }, [open]);

          return (
            <>
              <Listbox.Button
                className={`
                  relative w-full cursor-pointer rounded-lg border border-gray-300 
                  bg-white py-2 pl-3 pr-10 text-right shadow-sm 
                  focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500
                  disabled:bg-gray-100 disabled:cursor-not-allowed
                  ${isOpen ? "border-blue-500 ring-1 ring-blue-500" : ""}
                `}
              >
                <span className="block truncate text-sm text-gray-900">
                  {displayText}
                </span>
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
                  <HiChevronDown
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
                {selectedCount > 0 && (
                  <span className="absolute inset-y-0 right-2 flex items-center">
                    <span
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleDeselectAll();
                      }}
                      className="cursor-pointer rounded-full bg-gray-200 p-1 hover:bg-gray-300"
                      role="button"
                      tabIndex={-1}
                      aria-label="پاک کردن همه انتخاب‌ها"
                    >
                      <HiX className="h-3 w-3 text-gray-600" />
                    </span>
                  </span>
                )}
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  static
                  className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg focus:outline-none"
                >
                  {/* جستجو */}
                  {searchable && (
                    <div className="sticky top-0 z-10 border-b border-gray-200 bg-white p-2">
                      <div className="relative">
                        <HiSearch className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="جستجو..."
                          className="w-full rounded-md border border-gray-300 py-2 pr-10 pl-3 text-sm text-right focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    </div>
                  )}

                  {/* انتخاب همه/هیچ */}
                  {multiple && selectAll && (
                    <div className="border-b border-gray-200 p-2">
                      <div className="flex items-center justify-between">
                        <button
                          onClick={isAllSelected ? handleDeselectAll : handleSelectAll}
                          className="flex items-center gap-2 rounded px-2 py-1 text-sm text-blue-600 hover:bg-blue-50"
                        >
                          <div
                            className={`
                              flex h-4 w-4 items-center justify-center rounded border-2
                              ${isAllSelected ? "border-blue-600 bg-blue-600" : "border-gray-300"}
                            `}
                          >
                            {isAllSelected && (
                              <HiCheck className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <span>{isAllSelected ? "لغو انتخاب همه" : "انتخاب همه"}</span>
                        </button>
                        {selectedCount > 0 && (
                          <span className="text-xs text-gray-500">
                            {selectedCount} مورد انتخاب شده
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* لیست آیتم‌ها */}
                  <div
                    ref={parentRef}
                    style={{ maxHeight: `${maxHeight}px`, overflow: "auto" }}
                    className="p-1"
                  >
                    {groupable && filteredGroups ? (
                      // حالت گروه‌بندی شده
                      virtualized ? (
                        <div
                          style={{
                            height: `${groupVirtualizer.getTotalSize()}px`,
                            width: "100%",
                            position: "relative",
                          }}
                        >
                          {groupVirtualizer.getVirtualItems().map((virtualItem) => {
                            const item = groupItems[virtualItem.index];
                            const isGroup = item.type === "group";

                            return (
                              <div
                                key={virtualItem.key}
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: `${virtualItem.size}px`,
                                  transform: `translateY(${virtualItem.start}px)`,
                                }}
                              >
                                {isGroup ? (
                                  <div className="px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-50">
                                    {item.data.label}
                                  </div>
                                ) : (
                                  <Listbox.Option
                                    value={item.data.value}
                                    disabled={item.data.disabled}
                                    className={({ active, disabled }) =>
                                      `relative cursor-pointer select-none rounded-md py-2 pr-10 pl-4 text-sm ${
                                        active
                                          ? "bg-blue-100 text-blue-900"
                                          : "text-gray-900"
                                      } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`
                                    }
                                    onClick={() => handleSelect(item.data.value)}
                                  >
                                    {({ selected }) => (
                                      <>
                                        <span
                                          className={`block truncate ${
                                            selected ? "font-medium" : "font-normal"
                                          }`}
                                        >
                                          {item.data.label}
                                        </span>
                                        {selected ? (
                                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                            <HiCheck className="h-5 w-5" aria-hidden="true" />
                                          </span>
                                        ) : null}
                                      </>
                                    )}
                                  </Listbox.Option>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        // بدون مجازی‌سازی
                        filteredGroups.map((group) => (
                          <div key={group.label}>
                            <div className="px-3 py-2 text-xs font-semibold text-gray-700 bg-gray-50">
                              {group.label}
                            </div>
                            {group.options.map((option) => (
                              <Listbox.Option
                                key={option.id}
                                value={option.value}
                                disabled={option.disabled}
                                className={({ active, disabled }) =>
                                  `relative cursor-pointer select-none rounded-md py-2 pr-10 pl-4 text-sm ${
                                    active
                                      ? "bg-blue-100 text-blue-900"
                                      : "text-gray-900"
                                  } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`
                                }
                                onClick={() => handleSelect(option.value)}
                              >
                                {({ selected }) => (
                                  <>
                                    <span
                                      className={`block truncate ${
                                        selected ? "font-medium" : "font-normal"
                                      }`}
                                    >
                                      {option.label}
                                    </span>
                                    {selected ? (
                                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                        <HiCheck className="h-5 w-5" aria-hidden="true" />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Listbox.Option>
                            ))}
                          </div>
                        ))
                      )
                    ) : (
                      // حالت عادی بدون گروه‌بندی
                      virtualized ? (
                        <div
                          style={{
                            height: `${virtualizer.getTotalSize()}px`,
                            width: "100%",
                            position: "relative",
                          }}
                        >
                          {virtualizer.getVirtualItems().map((virtualItem) => {
                            const option = filteredOptions[virtualItem.index];
                            return (
                              <div
                                key={virtualItem.key}
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                  width: "100%",
                                  height: `${virtualItem.size}px`,
                                  transform: `translateY(${virtualItem.start}px)`,
                                }}
                              >
                                <Listbox.Option
                                  value={option.value}
                                  disabled={option.disabled}
                                  className={({ active, disabled }) =>
                                    `relative cursor-pointer select-none rounded-md py-2 pr-10 pl-4 text-sm ${
                                      active
                                        ? "bg-blue-100 text-blue-900"
                                        : "text-gray-900"
                                    } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`
                                  }
                                  onClick={() => handleSelect(option.value)}
                                >
                                  {({ selected }) => (
                                    <>
                                      <span
                                        className={`block truncate ${
                                          selected ? "font-medium" : "font-normal"
                                        }`}
                                      >
                                        {option.label}
                                      </span>
                                      {selected ? (
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                          <HiCheck className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Listbox.Option>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        // بدون مجازی‌سازی
                        filteredOptions.map((option) => (
                          <Listbox.Option
                            key={option.id}
                            value={option.value}
                            disabled={option.disabled}
                            className={({ active, disabled }) =>
                              `relative cursor-pointer select-none rounded-md py-2 pr-10 pl-4 text-sm ${
                                active
                                  ? "bg-blue-100 text-blue-900"
                                  : "text-gray-900"
                              } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`
                            }
                            onClick={() => handleSelect(option.value)}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {option.label}
                                </span>
                                {selected ? (
                                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                                    <HiCheck className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))
                      )
                    )}

                    {filteredOptions.length === 0 && (
                      <div className="px-4 py-8 text-center text-sm text-gray-500">
                        موردی یافت نشد
                      </div>
                    )}
                  </div>
                </Listbox.Options>
              </Transition>
            </>
          );
        }}
      </Listbox>
    </div>
  );
}

export default DropdownComponent;
