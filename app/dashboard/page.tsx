import { getUserFromCookie } from "@/components/cookie/User";
import ProductBox from "@/components/products/ProductBox";
import Link from "next/link";
import { redirect } from "next/navigation";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

type Product = {
  id: number;
  title: string;
  price: number;
  category: string;
  thumbnail: string;
};

async function getUsers(): Promise<User[]> {
  const res = await fetch("https://dummyjson.com/users?limit=6", {
    next: {
      revalidate: 3600,
    }
  });

  if (!res.ok) {
    throw new Error("خطا در دریافت اطلاعات کاربران");
  }

  const data = await res.json();
  return data.users as User[];
}

async function getProducts(): Promise<Product[]> {
  const res = await fetch("https://dummyjson.com/products?limit=6", {
    next: {
      revalidate: 3600,
    }
  });

  if (!res.ok) {
    throw new Error("خطا در دریافت اطلاعات محصولات");
  }

  const data = await res.json();
  return data.products as Product[];
}

export default async function Dashboard({ searchParams }: any) {
  const user = await getUserFromCookie()

  if (!user) {
    redirect("/login")
  }

  const { activeLink = "users" } = await searchParams;
  const [users, products] = await Promise.all([getUsers(), getProducts()]);
  return (
    <main className="min-h-[calc(100vh-4rem)] bg-slate-100">
      <div className="flex h-full items-stretch px-4 py-6" dir="rtl">
        <div className="flex w-full">
          <input
            id="dashboard-theme-toggle"
            type="checkbox"
            className="peer sr-only"
          />

          <div className="flex w-full rounded-2xl bg-white text-slate-900 shadow-md transition-colors peer-checked:bg-slate-900 peer-checked:text-slate-100">
            {/* سایدبار ثابت */}
            <aside className="flex w-64 flex-col border-l border-slate-200 bg-slate-50/80 px-4 py-6 backdrop-blur-sm peer-checked:border-slate-800 peer-checked:bg-slate-900/40">
              <div className="mb-6 flex items-center justify-between gap-2">
                <h2 className="text-lg font-semibold">داشبورد</h2>
              </div>

              <nav className="flex flex-1 flex-col gap-2 text-sm">
                <Link
                  href='?activeLink=users' className={`rounded-lg px-3 py-2 font-medium ${activeLink == "users" ? "bg-emerald-500/20 text-emerald-800" : "text-slate-700 hover:bg-emerald-100 hover:text-emerald-800"}`}
                >
                  کاربران
                </Link>
                <Link
                  href='?activeLink=products'
                  className={`rounded-lg px-3 py-2 font-medium ${activeLink == "products" ? "bg-emerald-500/20 text-emerald-800" : "text-slate-700 hover:bg-emerald-100 hover:text-emerald-800"}`}
                >
                  محصولات
                </Link>
              </nav>
            </aside>

            {/* محتوای داخلی داشبورد */}
            <main className="flex-1 overflow-y-auto px-6 py-4">
              <div className="space-y-10" dir="rtl">
                <header className="mb-4 flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">نمای کلی داشبورد</h1>
                    <p className="mt-1 text-sm text-slate-500">
                      داده‌ها به صورت سرور ساید از DummyJSON بارگذاری می‌شوند.
                    </p>
                  </div>
                </header>

                {/* سکشن کاربران */}
                {
                  activeLink == "users" &&
                  <section id="users" className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-xl font-semibold">کاربران</h2>
                      <span className="text-xs text-slate-500">
                        تعداد نمایش داده شده: {users.length}
                      </span>
                    </div>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm shadow-sm transition hover:border-emerald-400 hover:shadow-md peer-checked:border-slate-700 peer-checked:bg-slate-900/50"
                        >
                          <h3 className="mb-1 text-base font-semibold">
                            {user.firstName} {user.lastName}
                          </h3>
                          <p className="truncate text-xs text-slate-500">{user.email}</p>
                          <div className="mt-3 flex items-center justify-between text-[11px] text-slate-400">
                            <span>id: {user.id}</span>
                            <span>DummyJSON</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                }

                {/* سکشن محصولات */}
                {
                  activeLink == "products" &&
                  <section id="products" className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-xl font-semibold">محصولات</h2>
                      <span className="text-xs text-slate-500">
                        تعداد نمایش داده شده: {products.length}
                      </span>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {products.map((product) => (
                        <div key={product.id}>
                          <ProductBox {...product} />
                        </div>
                      ))}
                    </div>
                  </section>
                }
              </div>
            </main>
          </div>
        </div>
      </div>
    </main>
  );
}