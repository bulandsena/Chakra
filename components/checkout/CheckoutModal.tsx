'use client';

import React, { useState } from 'react';
import { useChakra } from '@/context/ChakraContext';
import { formatINR } from '@/lib/commission';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Download,
  Package,
  CreditCard,
  QrCode,
  ArrowRight,
  Info,
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose }) => {
  const {
    cart,
    cartSubtotalPaise,
    createOrder,
    setCurrentView,
    platformSettings,
    t,
    user,
  } = useChakra();

  // Form states
  const [customerName, setCustomerName] = useState(user.full_name || '');
  const [customerEmail, setCustomerEmail] = useState(user.email || '');
  const [customerPhone, setCustomerPhone] = useState(user.phone || '');
  const [paymentMode, setPaymentMode] = useState<'demo' | 'razorpay'>('demo');

  // Address for physical items
  const [street, setStreet] = useState('Flat 402, Shivajinagar');
  const [city, setCity] = useState('Pune');
  const [stateName, setStateName] = useState('Maharashtra');
  const [pincode, setPincode] = useState('411005');

  // Processing state
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<any>(null);

  if (!isOpen) return null;

  const hasPhysical = cart.some((i) => i.product.product_type === 'physical');
  const hasDigital = cart.some((i) => i.product.product_type === 'digital');
  const taxPaise = Math.round(cartSubtotalPaise * 0.05);
  const totalPaise = cartSubtotalPaise + taxPaise;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail || !customerName) return;

    setIsProcessing(true);

    // Simulate realistic signature verification and token generation latency
    setTimeout(async () => {
      const order = await createOrder({
        customerName,
        customerEmail,
        customerPhone,
        paymentMethod: paymentMode,
        shippingAddress: hasPhysical
          ? {
              street,
              city,
              state: stateName,
              pincode,
              country: 'India',
            }
          : undefined,
      });

      setIsProcessing(false);
      setCompletedOrder(order);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#152724] border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl overflow-hidden transition-colors">
        {/* Header */}
        <div className="px-6 py-4 bg-stone-50 dark:bg-[#132C28] border-b border-stone-200 dark:border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-chakra-gold" />
            <h3 className="text-sm font-semibold text-stone-900 dark:text-chakra-ivory">
              {completedOrder ? t.checkout.orderSuccessTitle : t.checkout.secureCheckoutTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {completedOrder ? (
          <div className="p-6 md:p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h3 className="text-xl font-bold text-stone-900 dark:text-chakra-ivory mb-2">
              {t.checkout.orderSuccessTitle}
            </h3>

            <p className="text-xs text-stone-600 dark:text-stone-300 max-w-md mx-auto mb-6">
              Order <strong className="font-mono text-chakra-gold">{completedOrder.order_number}</strong> verified successfully.
              {hasDigital && ' Your cryptographic download links are active and ready in your library.'}
            </p>

            <div className="bg-stone-50 dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-xl p-4 text-left max-w-md mx-auto mb-6 text-xs space-y-2">
              <div className="flex justify-between">
                <span className="text-stone-500">Amount Paid:</span>
                <span className="font-bold text-stone-900 dark:text-white tabular-nums">
                  {formatINR(completedOrder.total_paise)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Payment ID:</span>
                <span className="font-mono text-stone-800 dark:text-stone-300">
                  {completedOrder.payment_id}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Delivered To:</span>
                <span className="text-stone-800 dark:text-stone-300">
                  {completedOrder.customer_email}
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              {hasDigital && (
                <button
                  onClick={() => {
                    onClose();
                    setCurrentView('download-library');
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-chakra-gold text-stone-950 font-semibold text-xs rounded-xl hover:bg-chakra-gold-light transition-colors flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>{t.checkout.viewDownloads}</span>
                </button>
              )}
              <button
                onClick={() => {
                  onClose();
                  setCurrentView('explore');
                }}
                className="w-full sm:w-auto px-5 py-2.5 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium text-xs rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Customer Information */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                1. {t.checkout.customerInfo}
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    {t.checkout.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Kulkarni"
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-chakra-gold text-stone-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                    {t.checkout.email} *
                  </label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="yourname@gmail.com"
                    className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-chakra-gold text-stone-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-stone-300 mb-1">
                  {t.checkout.phone}
                </label>
                <input
                  type="tel"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="+91 98220 00000"
                  className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg focus:outline-none focus:border-chakra-gold text-stone-900 dark:text-white"
                />
              </div>
            </div>

            {/* Shipping Address for physical items */}
            {hasPhysical && (
              <div className="space-y-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                <div className="flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-chakra-gold" />
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                    2. {t.checkout.shippingAddress}
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] text-stone-600 dark:text-stone-400 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-600 dark:text-stone-400 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-stone-600 dark:text-stone-400 mb-1">Pincode</label>
                    <input
                      type="text"
                      required
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-stone-50 dark:bg-stone-900 border border-stone-300 dark:border-stone-700 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Payment Method Selection */}
            <div className="space-y-3 pt-3 border-t border-stone-100 dark:border-stone-800">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                {hasPhysical ? '3.' : '2.'} {t.checkout.paymentMode}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Demo Mode Simulation (Clear labeling) */}
                <div
                  onClick={() => setPaymentMode('demo')}
                  className={`p-3.5 border rounded-xl cursor-pointer transition-all ${
                    paymentMode === 'demo'
                      ? 'border-chakra-gold bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-chakra-gold'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-stone-900 dark:text-chakra-ivory flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-chakra-gold" />
                      Simulation Mode
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-amber-200 dark:bg-amber-900/60 text-amber-950 dark:text-amber-200 rounded">
                      Demo Mode
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400">
                    Instantly simulate a verified Razorpay webhook payment to test files & permissions without live card charges.
                  </p>
                </div>

                {/* Razorpay UPI / Cards */}
                <div
                  onClick={() => setPaymentMode('razorpay')}
                  className={`p-3.5 border rounded-xl cursor-pointer transition-all ${
                    paymentMode === 'razorpay'
                      ? 'border-chakra-gold bg-amber-50/50 dark:bg-amber-950/20 ring-1 ring-chakra-gold'
                      : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-stone-900 dark:text-chakra-ivory flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-emerald-600" />
                      Razorpay Gateway
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 rounded">
                      Live Gateway
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-400">
                    Google Pay, PhonePe, Paytm UPI, Net Banking, and Indian debit/credit cards via server-side order.
                  </p>
                </div>
              </div>
            </div>

            {/* Commission Transparency Callout */}
            <div className="p-3 bg-stone-50 dark:bg-[#1a2e2b] border border-stone-200/80 dark:border-stone-800 rounded-xl flex items-start gap-2 text-[11px] text-stone-600 dark:text-stone-300">
              <Info className="w-4 h-4 text-chakra-gold shrink-0 mt-0.5" />
              <span>
                <strong>Transparent Commission:</strong> 90% of your payment is disbursed directly to the creator.
                CHAKRA retains 10% for high-speed download hosting and payment processing.
              </span>
            </div>

            {/* Total and Submit */}
            <div className="pt-3 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500">Total Payable:</span>
                <div className="text-lg font-bold text-chakra-green dark:text-chakra-gold tabular-nums">
                  {formatINR(totalPaise)}
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-3 bg-[#132C28] dark:bg-chakra-gold text-chakra-ivory dark:text-stone-950 font-semibold text-xs tracking-wide rounded-xl hover:bg-[#1c3f3a] dark:hover:bg-chakra-gold-light transition-all flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>{t.checkout.processingPayment}</span>
                ) : (
                  <>
                    <span>
                      {paymentMode === 'demo' ? t.checkout.payDemo : t.checkout.payWithRazorpay}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
