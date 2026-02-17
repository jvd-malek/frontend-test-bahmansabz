
import Link from "next/link";
import ProductBox from "@/components/products/ProductBox";

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
};

type DummyJsonResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

const PAGE_SIZE = 12;

async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("https://dummyjson.com/products?limit=100", {
    next: {
      revalidate: 3600,
    }
  });

  if (!res.ok) {
    throw new Error("خطا در دریافت محصولات");
  }

  const data = (await res.json()) as DummyJsonResponse;
  return data.products;
}

type ProductsPageProps = {
  searchParams?: {
    page?: string;
    q?: string;
    category?: string;
    minPrice?: string;
    maxPrice?: string;
  };
};

export default async function ProductsPage({ searchParams }: any) {
  const search = await searchParams;

  const page = Number(search?.page ?? "1") || 1;
  const q = (search?.q ?? "").toString().trim().toLowerCase();
  const category = (search?.category ?? "").toString();
  const minPrice = Number(search?.minPrice ?? "") || 0;
  const maxPrice = Number(search?.maxPrice ?? "") || Number.MAX_SAFE_INTEGER;

  const products = await fetchProducts();

  // استخراج لیست دسته‌بندی‌ها
  const categories = Array.from(
    new Set(products.map((p) => p.category))
  ).sort((a, b) => a.localeCompare(b));

  // اعمال فیلترها
  let filtered = products.filter((p) => {
    const matchesSearch =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q);

    const matchesCategory = !category || p.category === category;

    const matchesPrice =
      p.price >= minPrice && p.price <= maxPrice;

    return matchesSearch && matchesCategory && matchesPrice;
  });

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;

  const pageItems = filtered.slice(startIndex, endIndex);

  return (
    <main
      className="container mx-auto px-4 py-10 space-y-8"
      dir="rtl"
    >
      <header className="space-y-2 text-right">
        <h1 className="text-2xl font-bold text-slate-900">
          محصولات
        </h1>
        <p className="text-sm text-slate-500">
          جستجو، فیلتر و مرور محصولات از وب‌سرویس{" "}
          <span className="font-semibold text-emerald-600">
            dummyjson.com
          </span>
        </p>
      </header>

      {/* فیلترها */}
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur">
        <form
          className="grid gap-4 md:grid-cols-4 items-end"
          method="GET"
        >
          {/* سرچ */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="q"
              className="text-xs font-medium text-slate-600"
            >
              جستجو
            </label>
            <input
              id="q"
              name="q"
              defaultValue={q}
              placeholder="نام محصول یا دسته‌بندی..."
              className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none transition focus:border-emerald-500 focus:bg-white"
            />
          </div>

          {/* دسته‌بندی */}
          <div className="flex flex-col gap-1">
            <label
              htmlFor="category"
              className="text-xs font-medium text-slate-600"
            >
              دسته‌بندی
            </label>
            <select
              id="category"
              name="category"
              defaultValue={category}
              className="h-9 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none transition focus:border-emerald-500 focus:bg-white"
            >
              <option value="">همه دسته‌بندی‌ها</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* بازه قیمت */}
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium text-slate-600">
              بازه قیمت ($)
            </span>
            <div className="flex gap-2">
              <input
                type="number"
                name="minPrice"
                placeholder="حداقل"
                defaultValue={
                  minPrice > 0 && minPrice !== Number.MIN_SAFE_INTEGER
                    ? minPrice
                    : ""
                }
                className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none transition focus:border-emerald-500 focus:bg-white"
              />
              <input
                type="number"
                name="maxPrice"
                placeholder="حداکثر"
                defaultValue={
                  maxPrice !== Number.MAX_SAFE_INTEGER
                    ? maxPrice
                    : ""
                }
                className="h-9 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs outline-none transition focus:border-emerald-500 focus:bg-white"
              />
            </div>
          </div>

          {/* دکمه‌ها */}
          <div className="flex gap-2 md:justify-end">
            <button
              type="submit"
              className="inline-flex h-9 flex-1 items-center justify-center rounded-xl bg-emerald-500 px-4 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-600 md:flex-none"
            >
              اعمال فیلتر
            </button>
            <Link
              href="/products"
              className="inline-flex h-9 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 transition hover:border-emerald-400 hover:text-emerald-600"
            >
              حذف فیلتر
            </Link>
          </div>

          {/* نگه داشتن صفحه فعلی در فرم */}
          <input type="hidden" name="page" value="1" />
        </form>
      </section>

      {/* لیست محصولات */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            تعداد محصولات یافت‌شده:{" "}
            <span className="font-semibold text-slate-800">
              {totalItems}
            </span>
          </span>
          <span>
            صفحه{" "}
            <span className="font-semibold text-slate-800">
              {currentPage}
            </span>{" "}
            از{" "}
            <span className="font-semibold text-slate-800">
              {totalPages}
            </span>
          </span>
        </div>

        {pageItems.length === 0 ? (
          <div className="flex items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-sm text-slate-500">
            هیچ محصولی با فیلترهای فعلی پیدا نشد.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {pageItems.map((product) => (
              <ProductBox key={product.id} {...product} />
            ))}
          </div>
        )}
      </section>

      {/* صفحه‌بندی */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-center gap-2 pt-4 text-xs">
          {/* prev */}
          <PaginationLink
            label="قبلی"
            disabled={currentPage === 1}
            page={currentPage - 1}
            searchParams={search}
          />

          {/* صفحات */}
          {Array.from({ length: totalPages }).map((_, index) => {
            const p = index + 1;
            const isActive = p === currentPage;
            return (
              <PaginationLink
                key={p}
                label={p.toString()}
                page={p}
                searchParams={search}
                isNumber
                active={isActive}
              />
            );
          })}

          {/* next */}
          <PaginationLink
            label="بعدی"
            disabled={currentPage === totalPages}
            page={currentPage + 1}
            searchParams={search}
          />
        </nav>
      )}
    </main>
  );
}

type PaginationLinkProps = {
  label: string;
  page: number;
  searchParams?: ProductsPageProps["searchParams"];
  disabled?: boolean;
  isNumber?: boolean;
  active?: boolean;
};

function PaginationLink({
  label,
  page,
  searchParams,
  disabled,
  isNumber,
  active,
}: PaginationLinkProps) {
  const params = new URLSearchParams();

  if (searchParams?.q) params.set("q", searchParams.q);
  if (searchParams?.category) params.set("category", searchParams.category);
  if (searchParams?.minPrice) params.set("minPrice", searchParams.minPrice);
  if (searchParams?.maxPrice) params.set("maxPrice", searchParams.maxPrice);

  params.set("page", String(page));

  const href = `/products?${params.toString()}`;

  if (disabled) {
    return (
      <span className="inline-flex h-8 min-w-[2rem] items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-2 text-[11px] text-slate-300">
        {label}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={`inline-flex h-8 min-w-[2rem] items-center justify-center rounded-xl border px-3 text-[11px] transition ${active
          ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
          : "border-slate-200 bg-white text-slate-600 hover:border-emerald-400 hover:text-emerald-600"
        } ${isNumber ? "font-medium" : ""}`}
    >
      {label}
    </Link>
  );
}