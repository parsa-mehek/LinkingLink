import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useAuth } from '../components/AuthProvider';
import { chatService } from '../services/chatService';
import { friendsService } from '../services/friendsService';
import { supabase } from '../lib/supabaseClient';
import ChatSidebar from '../components/chat/ChatSidebar';
import ChatWindow from '../components/chat/ChatWindow';

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  created_at: string;
}

interface FriendRow {
  id: string;
  requester_id: string;
  receiver_id: string;
  status: string;
  // May extend with joined profile data later
}

export const ChatPage: React.FC = () => {
  const { user } = useAuth();
  const [friends, setFriends] = useState<FriendRow[]>([]);
  const [activeFriend, setActiveFriend] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [unread, setUnread] = useState<Record<string, number>>({});
  const [presence, setPresence] = useState<any[]>([]);
  const [sending, setSending] = useState(false);
  const [text, setText] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null); // retained for potential future external scroll control
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const typingTimeouts = useRef<Record<string, any>>({});

  // simple presence/typing channel (ephemeral) - local only fallback
  const typingChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);

  const loadFriends = useCallback(async () => {
    const { data, error } = await friendsService.list();
    if (!error && data) {
      const accepted = (data as any[]).filter(r => r.status === 'accepted');
      setFriends(accepted);
      if (!activeFriend && accepted.length) {
        const first = accepted.find(r => r.requester_id !== user?.id)?.requester_id || accepted[0].receiver_id;
        setActiveFriend(first === user?.id ? accepted[0].receiver_id : first);
      }
    }
  }, [activeFriend, user?.id]);

  const loadMessages = useCallback(async (friendId: string) => {
    setLoadingMessages(true);
    const { data, error } = await chatService.history(friendId, 30);
    if (!error && data) {
      setMessages(data as Message[]);
      setHasMore(data.length === 30); // simplistic heuristic
      chatService.markRead(friendId);
      refreshUnread();
    }
    setLoadingMessages(false);
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50);
  }, []);

  const loadOlder = async () => {
    if (!activeFriend || messages.length === 0) return;
    const oldest = messages[0].created_at;
    const { data, error } = await chatService.history(activeFriend, 30, oldest);
    if (!error && data && data.length) {
      setMessages(prev => [...data as Message[], ...prev]);
      setHasMore(data.length === 30);
    } else if (!error && data && data.length === 0) {
      setHasMore(false);
    }
  };

  const refreshUnread = useCallback(async () => {
    const { data } = await chatService.getUnreadCounts();
    if (data) setUnread(data);
  }, []);

  const refreshPresence = useCallback(async () => {
    const peerIds = friends.map(f => f.requester_id === user?.id ? f.receiver_id : f.requester_id);
    if (peerIds.length) {
      const { data } = await chatService.getPresence(peerIds);
      if (data) setPresence(data);
    }
  }, [friends, user?.id]);

  useEffect(() => { loadFriends(); }, [loadFriends]);
  useEffect(() => { if (activeFriend) loadMessages(activeFriend); }, [activeFriend, loadMessages]);
  useEffect(() => { refreshUnread(); }, [refreshUnread]);
  useEffect(() => { refreshPresence(); const id = setInterval(()=>{ chatService.touchPresence('online'); refreshPresence(); }, 15000); return ()=>clearInterval(id); }, [refreshPresence]);
  useEffect(() => { chatService.touchPresence('online'); return () => { chatService.touchPresence('offline'); }; }, []);

  // realtime subscription to new messages
  useEffect(() => {
    const unsub = chatService.subscribe(payload => {
      const newMsg: Message = payload.new;
      if (!user) return;
      const peer = activeFriend;
      if (peer && ( (newMsg.sender_id === user.id && newMsg.receiver_id === peer) || (newMsg.sender_id === peer && newMsg.receiver_id === user.id) )) {
        setMessages(prev => [...prev, newMsg]);
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 30);
      }
    });
    return () => { unsub(); };
  }, [activeFriend, user]);

  // typing indicator using realtime broadcast (optional - fallback no-op if channel fails)
  useEffect(() => {
    if (!user) return;
    const ch = supabase.channel('typing').on('broadcast', { event: 'typing' }, payload => {
      const from = (payload.payload as any).user_id;
      const to = (payload.payload as any).to;
      if (to !== user.id) return; // ensure directed typing event
      setTypingUsers(prev => new Set(prev).add(from));
      if (typingTimeouts.current[from]) clearTimeout(typingTimeouts.current[from]);
      typingTimeouts.current[from] = setTimeout(() => {
        setTypingUsers(prev => { const next = new Set(prev); next.delete(from); return next; });
      }, 1500);
    }).subscribe();
    typingChannelRef.current = ch;
    return () => { supabase.removeChannel(ch); };
  }, [user]);

  const sendTyping = () => {
    if (!typingChannelRef.current || !user || !activeFriend) return;
    typingChannelRef.current.send({ type: 'broadcast', event: 'typing', payload: { user_id: user.id, to: activeFriend }});
  };

  const send = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeFriend || !text.trim() || !user) return;
    const tempId = 'temp-' + Date.now();
    const optimistic: Message = { id: tempId, sender_id: user.id, receiver_id: activeFriend, content: text.trim(), created_at: new Date().toISOString(), pending: true } as any;
    setMessages(prev => [...prev, optimistic]);
    const content = text.trim();
    setText('');
    setSending(true);
    const { data, error } = await chatService.send(activeFriend, content);
    setSending(false);
    if (error) {
      setMessages(prev => prev.filter(m => m.id !== tempId));
      alert('Failed to send: ' + error.message);
    } else if (data) {
      setMessages(prev => prev.map(m => m.id === tempId ? data as any : m));
      chatService.markRead(activeFriend); // ensure local read after our own send
    }
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 40);
  };

  const activeTyping = [...typingUsers].filter(id => id !== user?.id && id === activeFriend).length > 0;

  return (
    <div className="flex h-[calc(100vh-4rem)] -mx-4 sm:mx-0 bg-[#E7EFC7]">
      <ChatSidebar
        friends={friends}
        currentUserId={user?.id}
        activeFriend={activeFriend}
        onSelect={setActiveFriend}
        unread={unread}
        presence={presence}
      />
      <ChatWindow
        messages={messages}
        activeFriend={activeFriend}
        currentUserId={user?.id}
        loading={loadingMessages}
        sending={sending}
        text={text}
        setText={setText}
        onSend={send}
        onTyping={sendTyping}
        typingActive={activeTyping}
        onLoadOlder={loadOlder}
        hasMore={hasMore}
      />
    </div>
  );
};

export default ChatPage;
