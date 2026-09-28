import React from 'react';
import Image from 'next/image';
import { Product } from '@/types/chakra';
import { formatINR } from '@/lib/commission';
import { useChakra } from '@/context/ChakraContext';
import { Star, Download, Package, ArrowUpRight, CheckCircle2 } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addToCart, setCurrentView, t } = useChakra();

  const handleCardClick = () => {
    if (onSelect) {
      onSelect(product);
    } else {
      setCurrentView('product-detail', { id: product.id });
    }
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  const isDigital = product.product_type === 'digital';

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex flex-col bg-white dark:bg-[#1a2e2b] border border-stone-200/80 dark:border-stone-800 rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-chakra-gold/50 cursor-pointer"
    >
      {/* Product Image Slot (65-75% visual prominence) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 dark:bg-stone-900">
        <Image
          src={product.cover_image}
          alt={product.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          referrerPolicy="no-referrer"
          priority={product.featured}
        />

        {/* Quiet type marker */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-[#132C28]/90 text-chakra-ivory text-[11px] font-medium rounded backdrop-blur-sm shadow-sm">
          {isDigital ? (
            <>
              <Download className="w-3 h-3 text-chakra-gold" />
              <span>Digital</span>
            </>
          ) : (
            <>
              <Package className="w-3 h-3 text-chakra-gold" />
              <span>Craft</span>
            </>
          )}
        </div>

        {/* Discount tag if applicable */}
        {product.original_price_paise && product.original_price_paise > product.price_paise && (
          <div className="absolute top-3 right-3 px-2 py-0.5 bg-chakra-gold text-stone-950 text-[10px] font-bold rounded shadow-sm">
            SAVE {Math.round(((product.original_price_paise - product.price_paise) / product.original_price_paise) * 100)}%
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col flex-1 p-4 sm:p-5">
        {/* Unboxed Metadata Line with typographic separators */}
        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-1.5 capitalize">
          <span className="font-medium text-chakra-gold-dark dark:text-chakra-gold">
            {product.category.replace('_', ' ')}
          </span>
          <span aria-hidden="true">·</span>
          <span>{product.seller_name}</span>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-stone-900 dark:text-chakra-ivory line-clamp-2 mb-2 group-hover:text-chakra-gold-dark dark:group-hover:text-chakra-gold transition-colors">
          {product.title}
        </h3>

        {/* Short description */}
        <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 mb-4 flex-1">
          {product.short_description}
        </p>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 mb-4 text-xs text-stone-500 dark:text-stone-400">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="ml-1 font-semibold text-stone-800 dark:text-stone-200 tabular-nums">
              {product.rating.toFixed(1)}
            </span>
          </div>
          <span aria-hidden="true">·</span>
          <span className="tabular-nums">({product.review_count} {t.product.reviews})</span>
          {product.affiliate_eligible && (
            <>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-700 dark:text-emerald-400 font-medium">3% Ref</span>
            </>
          )}
        </div>

        {/* Bottom row: Price & Quick Action */}
        <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800/80">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-chakra-green dark:text-chakra-ivory tabular-nums">
              {formatINR(product.price_paise)}
            </span>
            {product.original_price_paise && (
              <span className="text-xs text-stone-400 line-through tabular-nums">
                {formatINR(product.original_price_paise)}
              </span>
            )}
          </div>

          <button
            onClick={handleAdd}
            className="px-3.5 py-1.5 text-xs font-semibold text-chakra-green dark:text-chakra-ivory bg-chakra-ivory dark:bg-stone-800 border border-stone-300 dark:border-stone-700 rounded-lg hover:bg-chakra-gold hover:text-stone-950 dark:hover:bg-chakra-gold dark:hover:text-stone-950 transition-colors whitespace-nowrap shadow-xs"
          >
            {t.product.addToCart}
          </button>
        </div>
      </div>
    </div>
  );
};
