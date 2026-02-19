import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

type Product = {
    id: number;
    title: string;
    price: number;
    category: string;
    thumbnail: string;
    images: string[];
    description: string;
    brand: string;
    rating: number;
    stock: number;
};

async function fetchProduct(id: string): Promise<Product> {

    const res = await fetch(`https://dummyjson.com/products/${id}`, {
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("محصول پیدا نشد");
    }

    const data = (await res.json()) as Product;
    return data;
}

type ProductPageParams = {
    params: {
        id: string;
    };
};

export async function generateMetadata(
    { params }: ProductPageParams
): Promise<Metadata> {
    const product = await fetchProduct(params.id);

    const title = `${product.title} | جزئیات محصول | بهمن سبز`;

    return {
        title,
        description: product.description,
        openGraph: {
            title,
            description: product.description,
            images: product.thumbnail ? [{ url: product.thumbnail }] : undefined,
        },
    };
}

export default async function ProductPage({ params }: any) {
    const { id } = await params;

    const product = await fetchProduct(id);

    const mainImage = product.images?.[0] ?? product.thumbnail;

    return (
        <main
            className="container mx-auto px-4 py-10 space-y-8"
            dir="rtl"
        >
            {/* نوار بالا */}
            <header className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="space-y-1 text-right">
                    <h1 className="text-xl font-bold text-slate-900">
                        {product.title}
                    </h1>
                    <p className="text-xs text-slate-500">
                        جزئیات محصول از وب‌سرویس{" "}
                        <span className="font-semibold text-emerald-600">
                            dummyjson.com
                        </span>
                    </p>
                </div>

                <Link
                    href="/products"
                    className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm transition hover:border-emerald-400 hover:text-emerald-600"
                >
                    <span>←</span>
                    <span>بازگشت به لیست محصولات</span>
                </Link>
            </header>

            {/* بدنه */}
            <section className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] items-start">
                {/* تصویر و گالری */}
                <div className="space-y-4">
                    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                        <div className="relative aspect-video w-full">
                            <Image
                                src={mainImage}
                                alt={product.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-2 overflow-x-auto pb-1">
                            {product.images.slice(0, 6).map((img, index) => (
                                <div
                                    key={img + index}
                                    className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                                >
                                    <Image
                                        src={img}
                                        alt={product.title}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* اطلاعات محصول */}
                <div className="space-y-5 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm backdrop-blur">
                    {/* قیمت و شناسه */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
                        <div className="space-y-0.5 text-right">
                            <p className="text-sm text-slate-500">
                                قیمت
                            </p>
                            <p className="text-2xl font-bold text-emerald-600">
                                ${product.price}
                            </p>
                        </div>
                        <div className="text-xs text-slate-400">
                            <p>id: {product.id}</p>
                            <p>موجودی: {product.stock}</p>
                        </div>
                    </div>

                    {/* دسته‌بندی، برند، امتیاز */}
                    <div className="grid gap-3 text-xs text-slate-600 sm:grid-cols-3">
                        <div className="space-y-0.5 rounded-xl bg-slate-50 px-3 py-2">
                            <p className="text-[11px] text-slate-500">
                                دسته‌بندی
                            </p>
                            <p className="font-semibold text-emerald-600">
                                {product.category}
                            </p>
                        </div>
                        <div className="space-y-0.5 rounded-xl bg-slate-50 px-3 py-2">
                            <p className="text-[11px] text-slate-500">
                                برند
                            </p>
                            <p className="font-semibold">
                                {product.brand || "نامشخص"}
                            </p>
                        </div>
                        <div className="space-y-0.5 rounded-xl bg-slate-50 px-3 py-2">
                            <p className="text-[11px] text-slate-500">
                                امتیاز کاربران
                            </p>
                            <p className="font-semibold">
                                {product.rating} از 5
                            </p>
                        </div>
                    </div>

                    {/* توضیحات */}
                    <div className="space-y-2 text-sm text-slate-700">
                        <h2 className="text-sm font-semibold text-slate-900">
                            توضیحات محصول
                        </h2>
                        <p className="leading-6">
                            {product.description}
                        </p>
                    </div>

                    {/* دکمه‌های اکشن فرضی */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <button
                            type="button"
                            className="inline-flex flex-1 items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-600 sm:flex-none sm:px-6"
                        >
                            افزودن به سبد خرید
                        </button>
                        <button
                            type="button"
                            className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-700 transition hover:border-emerald-400 hover:text-emerald-600"
                        >
                            افزودن به علاقه‌مندی‌ها
                        </button>
                    </div>
                </div>
            </section>
        </main>
    );
}

