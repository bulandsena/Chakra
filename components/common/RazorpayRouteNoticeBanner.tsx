'use client';

import React, { useState } from 'react';
import { useChakra } from '@/context/ChakraContext';
import {
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Settings,
  RefreshCw,
  Info,
  CheckCircle2,
  X,
  CreditCard,
  Building,
} from 'lucide-react';

export const RazorpayRouteNoticeBanner: React.FC = () => {
  const { platformSettings, setCurrentView, setActiveRole, testRazorpayConnection } = useChakra();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);

  const handleOpenAdminSettings = () => {
    setActiveRole('admin');
    setCurrentView('admin-dashboard');
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const res = await testRazorpayConnection();
      setTestResult({ success: res.success, msg: res.message });
    } catch (e: any) {
      setTestResult({ success: false, msg: e.message || 'Connection test failed' });
    } finally {
      setTesting(false);
    }
  };

  const isRouteEnabled = platformSettings.razorpay_route_enabled;

  if (isMinimized) {
    return (
      <aside aria-label="Settlement compliance alert" className="bg-amber-500 dark:bg-amber-600 text-stone-950 px-4 py-1.5 text-xs font-semibold flex items-center justify-between shadow-xs transition-all">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <AlertTriangle className="w-4 h-4 shrink-0 text-stone-950 animate-pulse" />
          <span className="truncate">
            <strong>Razorpay Marketplace Route Warning & Settlement Notice:</strong> Settlement requires onboarding before live seller payouts.
          </span>
          <button
            onClick={() => setIsMinimized(false)}
            className="ml-auto underline font-bold hover:text-white shrink-0 cursor-pointer text-[11px]"
          >
            Show Full Notice
          </button>
        </div>
      </aside>
    );
  }

  return (
    <aside aria-label="Settlement compliance alert" className="w-full bg-gradient-to-r from-amber-50 via-amber-100/90 to-amber-50 dark:from-amber-950/90 dark:via-stone-900 dark:to-amber-950/90 border-b border-amber-300/80 dark:border-amber-700/60 text-amber-950 dark:text-amber-100 shadow-sm transition-all relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Main Notice Content */}
          <div className="flex items-start gap-2.5">
            <div className="p-1.5 bg-amber-500/20 text-amber-700 dark:text-amber-400 rounded-lg shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 text-amber-700 dark:text-amber-400" />
            </div>

            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-xs uppercase tracking-wide bg-amber-200 dark:bg-amber-900/80 text-amber-900 dark:text-amber-200 px-2 py-0.5 rounded-md font-mono">
                  Marketplace Compliance Notice
                </span>
                <h2 className="font-bold text-xs sm:text-sm text-amber-950 dark:text-amber-100">
                  Razorpay Marketplace Route Warning & Settlement Notice
                </h2>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  isRouteEnabled
                    ? 'bg-emerald-100 border-emerald-300 text-emerald-800 dark:bg-emerald-950 dark:border-emerald-700 dark:text-emerald-300'
                    : 'bg-amber-200/60 border-amber-400 text-amber-900 dark:bg-amber-900/40 dark:border-amber-700 dark:text-amber-300'
                }`}>
                  MID: {platformSettings.razorpay_mid} · Route: {isRouteEnabled ? 'Active' : 'Onboarding Pending'}
                </span>
              </div>

              {/* Exact Required Strings */}
              <p className="text-xs text-amber-900/90 dark:text-amber-200 font-medium leading-relaxed">
                &ldquo;Complete Razorpay marketplace/Route onboarding before enabling seller payouts.&rdquo;
              </p>
              <p className="text-[11px] text-amber-800 dark:text-amber-300 leading-snug">
                &ldquo;Marketplace settlement is not configured. Please complete Razorpay marketplace/Route onboarding before enabling seller payouts.&rdquo;
              </p>
              <p className="text-[11px] text-stone-600 dark:text-stone-300 italic pt-0.5">
                &ldquo;CHAKRA commission: 20% before applicable payment gateway charges, taxes, refunds, chargebacks and other applicable adjustments.&rdquo;
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
            <button
              onClick={handleOpenAdminSettings}
              className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Configure in Admin</span>
            </button>

            <button
              onClick={handleTestConnection}
              disabled={testing}
              className="px-3 py-1.5 bg-white dark:bg-stone-800 hover:bg-amber-50 dark:hover:bg-stone-700 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-stone-700 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-600 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing...' : 'Test Connection'}</span>
            </button>

            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-amber-800 dark:text-amber-300 hover:bg-amber-200/50 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              title={isExpanded ? 'Collapse Details' : 'Expand Details'}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <button
              onClick={() => setIsMinimized(true)}
              className="p-1.5 text-amber-700 dark:text-amber-400 hover:bg-amber-200/50 dark:hover:bg-stone-800 rounded-lg transition-colors cursor-pointer"
              title="Minimize notice"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Test Feedback Banner */}
        {testResult && (
          <div className={`mt-2 p-2.5 rounded-lg text-xs flex items-center gap-2 border ${
            testResult.success
              ? 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-300 text-emerald-800 dark:text-emerald-200'
              : 'bg-red-50 dark:bg-red-950/80 border-red-300 text-red-800 dark:text-red-200'
          }`}>
            {testResult.success ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            )}
            <span>{testResult.msg}</span>
          </div>
        )}

        {/* Expanded Technical Breakdown Panel */}
        {isExpanded && (
          <div className="mt-3 pt-3 border-t border-amber-200 dark:border-amber-800/80 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white/70 dark:bg-stone-900/70 rounded-xl border border-amber-200/60 dark:border-amber-800/60 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-200">
                <Building className="w-3.5 h-3.5 text-amber-600" />
                <span>Merchant MID Configuration</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-300">
                Provided Merchant MID: <code className="font-bold text-chakra-green dark:text-chakra-gold">{platformSettings.razorpay_mid}</code>
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                Linked Account Identifier: <code className="font-mono">{platformSettings.razorpay_linked_account_id || 'acc_ThQ32KbfQQu7Qy'}</code>
              </p>
              <p className="text-[10px] text-amber-700 dark:text-amber-400">
                Status: Verified in Admin Settings to prevent accidental simulation of real bank rails.
              </p>
            </div>

            <div className="p-3 bg-white/70 dark:bg-stone-900/70 rounded-xl border border-amber-200/60 dark:border-amber-800/60 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-200">
                <CreditCard className="w-3.5 h-3.5 text-amber-600" />
                <span>Split Accounting Rules (20/80)</span>
              </div>
              <p className="text-[11px] text-stone-600 dark:text-stone-300">
                CHAKRA Owner Commission: <strong>20% Fixed Snapshot</strong>
              </p>
              <p className="text-[11px] text-stone-600 dark:text-stone-300">
                Seller Net Allocation: <strong>80% Eligible Amount</strong>
              </p>
              <p className="text-[10px] text-stone-500 dark:text-stone-400">
                Gateway fees, GST (18%), refunds and dispute adjustments debited server-side.
              </p>
            </div>

            <div className="p-3 bg-white/70 dark:bg-stone-900/70 rounded-xl border border-amber-200/60 dark:border-amber-800/60 space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-950 dark:text-amber-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Route Onboarding Checklist</span>
              </div>
              <ul className="text-[10px] text-stone-600 dark:text-stone-300 space-y-0.5">
                <li>✓ Server-side HMAC-SHA256 signature verification</li>
                <li>✓ Webhook idempotency keys for duplicate prevention</li>
                <li>• Razorpay Route merchant approval pending</li>
                <li>• Seller linked account activation required before payout dispatch</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
