'use client';

import React, { useState } from 'react';
import { useChakra } from '@/context/ChakraContext';
import { DownloadTicket } from '@/types/chakra';
import {
  Download,
  FileText,
  ShieldCheck,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Lock,
  ExternalLink,
} from 'lucide-react';

export const DownloadLibraryView: React.FC = () => {
  const { downloads, triggerDownload, t, setCurrentView } = useChakra();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const handleDownload = async (ticket: DownloadTicket) => {
    setDownloadingId(ticket.id);
    setStatusMessage(null);

    const res = await triggerDownload(ticket.id);
    setDownloadingId(null);
    setStatusMessage({ text: res.message, isError: !res.success });
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-stone-200 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <Lock className="w-3.5 h-3.5 text-chakra-gold" />
            <span>Encrypted Token Vault</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold font-serif text-stone-900 dark:text-chakra-ivory">
            {t.nav.downloads}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1 max-w-xl">
            Your purchased digital eBooks, PDFs, code repositories, and educational notes.
            Each file is secured with authenticated tokens and strict single-user DRM-free licensing.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('explore')}
          className="self-start md:self-auto px-4 py-2 text-xs font-semibold text-stone-700 dark:text-stone-300 bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 rounded-lg transition-colors"
        >
          Explore More Goods
        </button>
      </div>

      {/* Feedback banner */}
      {statusMessage && (
        <div
          className={`mt-6 p-4 rounded-xl text-xs flex items-center gap-2.5 ${
            statusMessage.isError
              ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-900'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900'
          }`}
        >
          {statusMessage.isError ? (
            <AlertTriangle className="w-4 h-4 shrink-0" />
          ) : (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Downloads List */}
      <div className="mt-8 space-y-4">
        {downloads.length === 0 ? (
          <div className="text-center py-16 bg-stone-50 dark:bg-[#1a2e2b] border border-stone-200/80 dark:border-stone-800 rounded-2xl p-8">
            <FileText className="w-12 h-12 text-stone-300 dark:text-stone-600 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-stone-900 dark:text-chakra-ivory mb-1">
              No digital downloads found in this account
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto mb-6">
              When you purchase an eBook, PDF guide, design system, or course, your secure download tokens
              will appear here immediately.
            </p>
            <button
              onClick={() => setCurrentView('explore')}
              className="px-5 py-2.5 bg-[#132C28] dark:bg-chakra-gold text-chakra-ivory dark:text-stone-950 text-xs font-semibold rounded-xl hover:bg-[#1c3f3a] transition-all cursor-pointer"
            >
              Browse Digital Catalog
            </button>
          </div>
        ) : (
          downloads.map((ticket) => {
            const isExhausted = ticket.download_count >= ticket.max_downloads;
            const remaining = Math.max(0, ticket.max_downloads - ticket.download_count);

            return (
              <div
                key={ticket.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-800 rounded-xl shadow-xs hover:border-chakra-gold/50 transition-all"
              >
                {/* File info */}
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-chakra-ivory dark:bg-stone-800 flex items-center justify-center text-chakra-green dark:text-chakra-gold shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900 dark:text-chakra-ivory">
                      {ticket.product_title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mt-1">
                      <span className="font-mono text-stone-700 dark:text-stone-300">
                        {ticket.file_name}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="tabular-nums">{ticket.file_size_formatted}</span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-medium">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        Verified
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-2">
                      <span className="flex items-center gap-1 tabular-nums">
                        <Clock className="w-3 h-3 text-stone-400" />
                        Remaining: <strong>{remaining} of {ticket.max_downloads}</strong> downloads
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>Order: {ticket.order_id}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:self-center">
                  <button
                    onClick={() => handleDownload(ticket)}
                    disabled={isExhausted || downloadingId === ticket.id}
                    className={`px-4 py-2 text-xs font-semibold rounded-lg flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap ${
                      isExhausted
                        ? 'bg-stone-100 dark:bg-stone-800 text-stone-400 cursor-not-allowed'
                        : 'bg-chakra-gold text-stone-950 hover:bg-chakra-gold-light shadow-xs'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {isExhausted
                        ? 'Limit Exceeded'
                        : downloadingId === ticket.id
                        ? 'Decrypting...'
                        : 'Download File'}
                    </span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Security Architecture Callout */}
      <div className="mt-12 p-6 bg-stone-50 dark:bg-[#132C28]/60 border border-stone-200 dark:border-stone-800 rounded-2xl text-xs text-stone-600 dark:text-stone-300 space-y-2">
        <h4 className="font-semibold text-stone-900 dark:text-chakra-ivory flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-chakra-gold" />
          CHAKRA Secure Digital Storage Protocol
        </h4>
        <p className="leading-relaxed">
          Files are hosted in private Supabase Storage buckets inaccessible via public URL. Download tokens expire automatically
          and generate unique cryptographic watermarking headers containing your licensee reference.
          No cloud storage API service keys are exposed to the client.
        </p>
      </div>
    </div>
  );
};
