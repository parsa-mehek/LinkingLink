import React, { useRef, useEffect, useState } from 'react';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';

interface Message { id: string; sender_id: string; receiver_id: string; content: string; created_at: string; pending?: boolean }

interface Props {
  messages: Message[];
  activeFriend: string | null;
  currentUserId?: string;
  loading: boolean;
  sending: boolean;
  text: string;
  setText: (v: string) => void;
  onSend: (e: React.FormEvent) => void;
  onTyping: () => void;
  typingActive: boolean;
  onLoadOlder?: () => void;
  hasMore?: boolean;
}

export const ChatWindow: React.FC<Props> = ({ messages, activeFriend, currentUserId, loading, sending, text, setText, onSend, onTyping, typingActive, onLoadOlder, hasMore }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const restoreRef = useRef<{ prevScrollHeight: number; prevScrollTop: number } | null>(null);
  const atBottomRef = useRef<boolean>(true);
  const [showNewIndicator, setShowNewIndicator] = useState(false);
  const lastMessageIdRef = useRef<string | null>(null);
  const [showJump, setShowJump] = useState(false);

  // Track if user is at (near) bottom before update
  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    const handler = () => {
      const gap = el.scrollHeight - el.scrollTop - el.clientHeight;
      atBottomRef.current = gap < 80; // within 80px counts as bottom
      setShowJump(gap > 240); // show jump if > 240px away from bottom
      if (gap < 80) setShowNewIndicator(false); // hide new indicator if user reaches bottom manually
    };
    el.addEventListener('scroll', handler);
    handler();
    return () => el.removeEventListener('scroll', handler);
  }, []);

  // Scroll behavior after messages change
  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    if (restoreRef.current) {
      // We just prepended older messages; restore previous visual position
      const { prevScrollHeight, prevScrollTop } = restoreRef.current;
      const diff = el.scrollHeight - prevScrollHeight;
      el.scrollTop = prevScrollTop + diff;
      restoreRef.current = null;
      return;
    }
    const last = messages[messages.length - 1];
    if (!last) return;
    const isNew = lastMessageIdRef.current && lastMessageIdRef.current !== last.id;
    const inbound = last.sender_id !== currentUserId;
    // Auto-scroll if user at bottom OR it's own outbound message
    if (atBottomRef.current || last.sender_id === currentUserId) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      setShowNewIndicator(false);
    } else if (isNew && inbound) {
      setShowNewIndicator(true);
    }
    lastMessageIdRef.current = last.id;
  }, [messages, typingActive, currentUserId]);

  const handleLoadOlder = () => {
    if (!onLoadOlder) return;
    const el = containerRef.current; if (!el) { onLoadOlder(); return; }
    restoreRef.current = { prevScrollHeight: el.scrollHeight, prevScrollTop: el.scrollTop };
    onLoadOlder();
  };

  return (
    <section className="flex-1 flex flex-col bg-white shadow-inner">
      <div className="px-4 py-3 border-b flex items-center justify-between bg-white">
        {activeFriend ? <p className="text-sm font-medium text-[#3B3B1A]">Chat with User {activeFriend.slice(0,8)}</p> : <p className="text-sm text-[#3B3B1A]/60">Select a friend</p>}
        <TypingIndicator active={typingActive} />
      </div>
      <div ref={containerRef} className="relative flex-1 overflow-y-auto p-4 space-y-3 bg-[#E7EFC7]/40">
        {hasMore && !loading && (
          <button onClick={handleLoadOlder} className="mx-auto mb-2 text-[11px] underline text-[#3B3B1A]/70 hover:text-[#3B3B1A]">Load older messages</button>
        )}
        {loading && <p className="text-sm text-[#3B3B1A]/60">Loading...</p>}
        {!loading && messages.length === 0 && activeFriend && <p className="text-sm text-[#3B3B1A]/60">No messages yet. Say hi! 👋</p>}
        {messages.map(m => (
          <MessageBubble key={m.id} content={m.content} isOwn={m.sender_id === currentUserId} timestamp={m.created_at} pending={m.pending} />
        ))}
        <div ref={bottomRef} />
        {/* New messages indicator */}
        {showNewIndicator && (
          <button
            onClick={() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); setShowNewIndicator(false); }}
            aria-live="polite"
            className="animate-slide-up-fade absolute left-1/2 -translate-x-1/2 bottom-4 bg-[#3B3B1A] text-[#E7EFC7] text-xs px-3 py-1 rounded-full shadow hover:bg-[#3B3B1A]/90 focus:outline-none focus-ring"
          >
            New messages below
          </button>
        )}
        {/* Jump to latest button (when far up) */}
        {showJump && !showNewIndicator && (
          <button
            onClick={() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }}
            aria-label="Jump to latest messages"
            className="animate-fade-in absolute right-4 bottom-4 bg-[#8A784E] text-[#E7EFC7] text-xs px-2.5 py-1.5 rounded-full shadow hover:bg-[#8A784E]/90 focus:outline-none focus-ring"
          >
            Jump to latest
          </button>
        )}
      </div>
      <form onSubmit={onSend} className="p-3 border-t flex gap-2 bg-white">
        <input
          type="text"
          value={text}
          onChange={e => { setText(e.target.value); onTyping(); }}
          placeholder={activeFriend ? 'Type a message...' : 'Select a friend to start chatting'}
          disabled={!activeFriend || sending}
          className="flex-1 border rounded px-3 py-2 text-sm disabled:opacity-50"
        />
        <button disabled={!activeFriend || sending || !text.trim()} className="bg-[#8A784E] text-[#E7EFC7] px-4 py-2 rounded text-sm disabled:opacity-50">Send</button>
      </form>
    </section>
  );
};

export default ChatWindow;
