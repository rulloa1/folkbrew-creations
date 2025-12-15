import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TELEGRAM_URL = 'https://t.me/royalsolutions_ai';

export function TelegramFloatingButton() {
  return (
    <a
      href={TELEGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
    >
      <Button
        size="lg"
        className="rounded-full w-14 h-14 p-0 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 flex items-center justify-center"
        aria-label="Chat with us on Telegram"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
      <div className="absolute bottom-full right-0 mb-2 bg-gray-900 text-white text-sm px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Chat with us on Telegram
      </div>
    </a>
  );
}

export function TelegramContactLink() {
  return (
    <a
      href={TELEGRAM_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
    >
      <MessageCircle className="w-5 h-5" />
      <span>Message us on Telegram</span>
    </a>
  );
}
