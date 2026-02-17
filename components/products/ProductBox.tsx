import Image from "next/image";
import Link from "next/link";

type Product = {
    id: number;
    title: string;
    price: number;
    category: string;
    thumbnail: string;
};

function ProductBox(product: Product) {
    return (
        <Link
            href={`/product/${product.id}`}
            className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white/80 text-sm shadow-sm transition hover:border-emerald-400 hover:shadow-md peer-checked:border-slate-700 peer-checked:bg-slate-900/50"
        >
            <div className="aspect-video w-full overflow-hidden bg-slate-100">
                <Image
                    src={product.thumbnail}
                    alt={product.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                    width={200}
                    height={100}
                />
            </div>
            <div className="flex flex-1 flex-col p-4">
                <h3 className="mb-1 text-base font-semibold">
                    {product.title}
                </h3>
                <p className="mb-2 text-xs text-emerald-600">
                    دسته‌بندی: {product.category}
                </p>

                <div className="mt-auto flex items-center justify-between text-sm font-semibold">
                    <span className="text-emerald-600">قیمت: ${product.price}</span>
                    <span className="text-[11px] text-slate-400">
                        id: {product.id}
                    </span>
                </div>
            </div>
        </Link>
    );
}

export default ProductBox;