'use client';

import React from 'react';
import Image from 'next/image';
import { useChakra } from '@/context/ChakraContext';
import { formatINR } from '@/lib/commission';
import { X, Plus, Minus, Trash2, ArrowRight, ShieldCheck, Download, Package } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onProceedToCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onProceedToCheckout,
}) => {
  const {
    cart,
    removeFromCart,
    updateCartQuantity,
    cartSubtotalPaise,
    setCurrentView,
    t,
  } = useChakra();

  if (!isOpen) return null;

  const taxPaise = Math.round(cartSubtotalPaise * 0.05);
  const totalPaise = cartSubtotalPaise + taxPaise;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white dark:bg-[#152724] border-l border-stone-200 dark:border-stone-800 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="px-6 py-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-stone-900 dark:text-chakra-ivory">
                {t.checkout.cartTitle}
              </h2>
              <span className="text-xs text-stone-500 tabular-nums">
                ({cart.reduce((a, b) => a + b.quantity, 0)})
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-chakra-ivory dark:bg-stone-800/80 flex items-center justify-center text-stone-400 mb-4">
                  <Package className="w-8 h-8 text-chakra-gold" />
                </div>
                <h3 className="text-sm font-semibold text-stone-900 dark:text-chakra-ivory mb-1">
                  {t.checkout.emptyCart}
                </h3>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mb-6">
                  Discover digital eBooks, design systems, course kits, and artisan brass crafts.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    setCurrentView('explore');
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-chakra-green bg-chakra-gold rounded-lg hover:bg-chakra-gold-light transition-colors"
                >
                  Explore Marketplace
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const isDigital = item.product.product_type === 'digital';
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 p-3 bg-stone-50 dark:bg-[#1a2e2b] border border-stone-200/70 dark:border-stone-800 rounded-xl"
                  >
                    {/* Thumbnail */}
                    <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-800 shrink-0">
                      <Image
                        src={item.product.cover_image}
                        alt={item.product.title}
                        fill
                        className="object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-stone-900 dark:text-chakra-ivory truncate">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-stone-400 hover:text-red-500 p-0.5"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Quiet unboxed type marker */}
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 mt-1">
                        {isDigital ? (
                          <>
                            <Download className="w-3 h-3 text-chakra-gold" />
                            <span>Instant Digital Download</span>
                          </>
                        ) : (
                          <>
                            <Package className="w-3 h-3 text-chakra-gold" />
                            <span>Physical Goods</span>
                          </>
                        )}
                        {item.affiliate_ref && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-emerald-700 dark:text-emerald-400">Ref: {item.affiliate_ref}</span>
                          </>
                        )}
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between mt-auto pt-2">
                        <div className="flex items-center border border-stone-300 dark:border-stone-700 rounded-md bg-white dark:bg-stone-900">
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:text-chakra-gold text-stone-500"
                            disabled={item.quantity <= 1}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 text-xs font-semibold tabular-nums text-stone-800 dark:text-stone-200">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:text-chakra-gold text-stone-500"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <span className="text-xs font-bold text-stone-900 dark:text-chakra-ivory tabular-nums">
                          {formatINR(item.product.price_paise * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout Action */}
          {cart.length > 0 && (
            <div className="p-6 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-[#12221f] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>{t.checkout.subtotal}</span>
                  <span className="tabular-nums">{formatINR(cartSubtotalPaise)}</span>
                </div>
                <div className="flex justify-between text-stone-600 dark:text-stone-400">
                  <span>{t.checkout.tax}</span>
                  <span className="tabular-nums">{formatINR(taxPaise)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 dark:text-chakra-ivory pt-2 border-t border-stone-200 dark:border-stone-700">
                  <span>{t.checkout.total}</span>
                  <span className="text-base text-chakra-green dark:text-chakra-gold tabular-nums">
                    {formatINR(totalPaise)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-stone-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Protected by Razorpay 256-bit SSL & instant token delivery.</span>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onProceedToCheckout();
                }}
                className="w-full py-3 px-4 bg-[#132C28] dark:bg-chakra-gold text-chakra-ivory dark:text-stone-950 font-semibold text-xs tracking-wide rounded-xl hover:bg-[#1c3f3a] dark:hover:bg-chakra-gold-light transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
              >
                <span>{t.checkout.proceedToCheckout}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
