import type { Metadata } from "next";
import { getUserFromCookie } from "@/components/cookie/User";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "صفحه اصلی | بهمن سبز",
  description:
    "صفحه اصلی تست فرانت‌اند بهمن سبز با دسترسی سریع به داشبورد، لیست محصولات، کامپوننت Dropdown و صفحه ورود.",
};

export default async function Home() {

  const user = await getUserFromCookie();

  return (
    <main className="flex min-h-screen w-full max-w-3xl items-center justify-between py-32 px-16 md:flex-row flex-col gap-20 sm:items-start mx-auto">
      <div className="flex items-start justify-center gap-4 flex-col">
        <Image
          className="w-20 h-20"
          src="/Logo-bahmansabz.webp"
          alt="Bahman Sabz Logo"
          width={100}
          height={20}
          priority
        />
        <h1 className="text-4xl font-bold">Bahman Sabz</h1>
        {user &&
          <p className="text-gray-600 self-end">
            سلام، {user.name}
          </p>
        }
      </div>
      <div className="flex items-start justify-center gap-4 flex-col">
        <Link href="/dashboard" className="flex items-start justify-center flex-col hover:text-green-700 transition-all duration-300 border hover:bg-green-700/10 hover:border-green-700 rounded-md py-2 px-4 w-full">
          <h2 className="text-xl font-bold">Dashboard</h2>
          <p className="text-base">
            This is the dashboard page.
          </p>
        </Link>
        <Link href="/products" className="flex items-start justify-center flex-col hover:text-green-700 transition-all duration-300 border hover:bg-green-700/10 hover:border-green-700 rounded-md py-2 px-4 w-full">
          <h2 className="text-xl font-bold">Products</h2>
          <p className="text-base">
            This is the products page.
          </p>
        </Link>
        <Link href="/dropdown" className="flex items-start justify-center flex-col hover:text-green-700 transition-all duration-300 border hover:bg-green-700/10 hover:border-green-700 rounded-md py-2 px-4 w-full">
          <h2 className="text-xl font-bold">Dropdown Select Component</h2>
          <p className="text-base">
            This is the dropdown select component.
          </p>
        </Link>
        <Link href="/login" className="flex items-start justify-center flex-col hover:text-green-700 transition-all duration-300 border hover:bg-green-700/10 hover:border-green-700 rounded-md py-2 px-4 w-full">
          <h2 className="text-xl font-bold">Login page</h2>
          <p className="text-base">
            This is the login page.
          </p>
        </Link>
      </div>
    </main>
  );
}
