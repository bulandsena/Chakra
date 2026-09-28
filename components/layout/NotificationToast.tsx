'use client';

import React from 'react';
import { useChakra } from '@/context/ChakraContext';
import { CheckCircle2, AlertCircle, Sparkles, X, ShoppingBag } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, markNotificationRead } = useChakra();

  const unread = notifications.filter((n) => !n.read).slice(0, 3);

  if (unread.length === 0) return null;

  return (
    <aside aria-label="Notifications" className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {unread.map((notif) => {
        let icon = <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />;
        if (notif.type === 'order') {
          icon = <ShoppingBag className="w-4 h-4 text-chakra-gold shrink-0" />;
        } else if (notif.type === 'affiliate') {
          icon = <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />;
        } else if (notif.type === 'moderation') {
          icon = <AlertCircle className="w-4 h-4 text-blue-500 shrink-0" />;
        }

        return (
          <div
            key={notif.id}
            className="pointer-events-auto flex items-start justify-between gap-3 p-3.5 bg-white dark:bg-[#1a2e2b] border border-stone-200 dark:border-stone-700/80 rounded-xl shadow-xl transition-all duration-300 animate-in fade-in slide-in-from-bottom-2"
          >
            <div className="flex items-start gap-2.5">
              <div className="mt-0.5">{icon}</div>
              <div>
                <h5 className="text-xs font-semibold text-stone-900 dark:text-chakra-ivory">
                  {notif.title}
                </h5>
                <p className="text-[11px] text-stone-600 dark:text-stone-300 mt-0.5 leading-snug">
                  {notif.message}
                </p>
              </div>
            </div>

            <button
              onClick={() => markNotificationRead(notif.id)}
              className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </aside>
  );
};
