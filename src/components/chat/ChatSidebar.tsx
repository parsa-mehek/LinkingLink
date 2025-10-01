import React from 'react';

interface FriendRow { id: string; requester_id: string; receiver_id: string; status: string }

interface Presence { user_id: string; status: string; last_seen_at?: string }

interface Props {
  friends: FriendRow[];
  currentUserId?: string;
  activeFriend: string | null;
  onSelect: (userId: string) => void;
  unread?: Record<string, number>;
  presence?: Presence[];
}

export const ChatSidebar: React.FC<Props> = ({ friends, currentUserId, activeFriend, onSelect, unread = {}, presence = [] }) => {
  const presenceMap = Object.fromEntries(presence.map(p => [p.user_id, p]));
  return (
    <aside className="w-56 md:w-64 bg-[#AEC8A4] p-4 flex flex-col gap-4 overflow-y-auto">
      <h2 className="text-sm font-semibold tracking-wide text-[#3B3B1A] uppercase">Friends</h2>
      <ul className="space-y-1">
        {friends.length === 0 && <li className="text-xs text-[#3B3B1A]/70">No accepted friends yet.</li>}
        {friends.map(f => {
          const peerId = f.requester_id === currentUserId ? f.receiver_id : f.requester_id;
          const isActive = peerId === activeFriend;
          const pres = presenceMap[peerId];
          const online = pres?.status === 'online' && (!!pres?.last_seen_at ? (Date.now() - new Date(pres.last_seen_at).getTime()) < 1000 * 60 * 2 : true);
          const badge = unread[peerId];
          return (
            <li key={f.id}>
              <button
                onClick={() => onSelect(peerId)}
                className={`relative w-full text-left px-3 py-2 rounded text-sm font-medium transition flex items-center justify-between ${isActive ? 'bg-[#8A784E] text-[#E7EFC7]' : 'hover:bg-[#8A784E]/20 text-[#3B3B1A]'}`}
              >
                <span className="truncate">User {peerId.slice(0,8)}</span>
                <span className="flex items-center gap-2">
                  {badge ? <span className="bg-[#8A784E] text-[#E7EFC7] text-[10px] px-2 py-0.5 rounded-full">{badge}</span> : null}
                  <span className={`w-2 h-2 rounded-full ${online ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

export default ChatSidebar;
