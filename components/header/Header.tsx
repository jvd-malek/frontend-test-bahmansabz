import Image from "next/image";
import Link from "next/link";
import { getUserFromCookie } from "../cookie/User";

async function Header() {
    const user = await getUserFromCookie();

    return (
        <header className="flex items-center justify-start md:gap-20 gap-4 px-8 py-4 w-full">
            <Image
                className="md:w-12 md:h-12 w-8 h-8"
                src="/Logo-bahmansabz.webp"
                alt="Bahman Sabz Logo"
                width={100}
                height={20}
                priority
            />
            <div className="flex items-start justify-center gap-2 md:text-base text-sm">
                <Link
                    href="/"
                    className="hover:text-green-700 transition-all duration-300"
                >
                    Home
                </Link>
                <Link
                    href="/dashboard"
                    className="hover:text-green-700 transition-all duration-300"
                >
                    Dashboard
                </Link>
                <Link
                    href="/products"
                    className="hover:text-green-700 transition-all duration-300"
                >
                    Products
                </Link>
                <Link
                    href="/dropdown"
                    className="hover:text-green-700 transition-all duration-300"
                >
                    Dropdown
                </Link>
            </div>
            {user && (
                <span className="ml-auto text-sm md:text-base text-gray-700">
                    سلام، {user.name}
                </span>
            )}
        </header>
    );
}

export default Header;