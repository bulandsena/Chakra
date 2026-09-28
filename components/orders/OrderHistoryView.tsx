'use client';

import React from 'react';
import Image from 'next/image';
import { useChakra } from '@/context/ChakraContext';
import { formatINR } from '@/lib/commission';
import { ShoppingBag, Download, Package, CheckCircle2, Clock, ArrowRight } from 'lucide-react';

export const OrderHistoryView: React.FC = () => {
  const { orders, setCurrentView, t } = useChakra();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
      {/* Header */}
      <div className="pb-8 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
            {t.nav.orders}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
            Review your purchase history, invoices, and verified transaction receipts.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('download-library')}
          className="px-4 py-2 bg-chakra-gold text-stone-950 font-bold text-xs rounded-xl hover:bg-chakra-gold-light transition-all flex items-center gap-1.5 shadow-xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span>My Downloads</span>
        </button>
      </div>

      {/* Orders List */}
      <div className="mt-8 space-y-6">
        {orders.length === 0 ? (
          <div className="text-center py-16 bg-stone-50 dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl p-8">
            <ShoppingBag className="w-12 h-12 text-stone-400 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-stone-900 dark:text-chakra-ivory mb-1">
              No orders placed yet
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mb-6">
              When you purchase an eBook, course kit, or artisan handicraft, your full receipt and download access will appear here.
            </p>
            <button
              onClick={() => setCurrentView('explore')}
              className="px-5 py-2.5 bg-[#132C28] dark:bg-chakra-gold text-chakra-ivory dark:text-stone-950 text-xs font-bold rounded-xl"
            >
              Start Exploring
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs"
            >
              {/* Order Header */}
              <div className="px-6 py-4 bg-stone-50 dark:bg-stone-900/60 border-b border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div>
                    <span className="text-stone-400 block text-[10px]">ORDER NUMBER</span>
                    <span className="font-mono font-bold text-stone-900 dark:text-chakra-ivory">
                      {order.order_number}
                    </span>
                  </div>
                  <div className="hidden sm:block border-l border-stone-200 dark:border-stone-800 pl-3">
                    <span className="text-stone-400 block text-[10px]">DATE PLACED</span>
                    <span className="text-stone-700 dark:text-stone-300">
                      {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="border-l border-stone-200 dark:border-stone-800 pl-3">
                    <span className="text-stone-400 block text-[10px]">TOTAL AMOUNT</span>
                    <span className="font-bold text-stone-900 dark:text-white tabular-nums">
                      {formatINR(order.total_paise)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 rounded-full">
                    <CheckCircle2 className="w-3 h-3" />
                    Paid ({order.payment_method.toUpperCase()})
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="p-6 divide-y divide-stone-100 dark:divide-stone-800/80">
                {order.items.map((item, idx) => (
                  <div key={idx} className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                        <Image
                          src={item.cover_image}
                          alt={item.title}
                          fill
                          className="object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-stone-900 dark:text-chakra-ivory">
                          {item.title}
                        </h4>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          Sold by {item.seller_name} · Qty: {item.quantity}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-bold text-stone-900 dark:text-chakra-ivory tabular-nums">
                        {formatINR(item.price_paise * item.quantity)}
                      </div>
                      {item.product_type === 'digital' && (
                        <button
                          onClick={() => setCurrentView('download-library')}
                          className="mt-1 text-[11px] text-chakra-gold hover:underline flex items-center justify-end gap-1 ml-auto"
                        >
                          <Download className="w-3 h-3" />
                          <span>Get File</span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
