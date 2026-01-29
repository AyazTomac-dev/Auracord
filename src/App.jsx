import React, { useState, useEffect } from 'react';
import { usePeer } from './hooks/usePeer';
import Sidebar from './components/Sidebar';
import ChannelList from './components/ChannelList';
import ChatArea from './components/ChatArea';
import Auth from './components/Auth';
import SettingsModal from './components/SettingsModal';
import { FeatureModal } from './components/FeatureModals';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Check, X } from 'lucide-react';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auracord_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [username, setUsername] = useState(() => user?.displayName || 'Aura Spirit');
  const [lastChangeDate, setLastChangeDate] = useState(() => localStorage.getItem('auracord_last_name_change'));
  const [theme, setTheme] = useState(() => localStorage.getItem('auracord_theme') || 'aura');
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeFeature, setActiveFeature] = useState(null);

  const {
    myId, connections, messages, setMessages, friends, pendingRequests,
    sendFriendRequest, acceptFriend, sendMessage, sendReaction, broadcastNameChange, clearMessages,
    error, setError,
    startCall, answerCall, endCall, isCalling, incomingCall, localStream, remoteStream
  } = usePeer(username, user?.uid);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('auracord_theme', theme);
  }, [theme]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('auracord_user', JSON.stringify(user));
      setUsername(user.displayName);
    }
  }, [user]);

  const handleAuthComplete = (userData) => {
    setUser(userData);
    setUsername(userData.displayName);
  };

  const handleUsernameChange = (newName) => {
    setUsername(newName);
    broadcastNameChange(newName);
    const now = new Date().toISOString();
    setLastChangeDate(now);
    localStorage.setItem('auracord_last_name_change', now);
    setUser({ ...user, displayName: newName });
  };

  if (!user) return <Auth onAuthComplete={handleAuthComplete} />;

  return (
    <div className="app-container">
      <div className="aura-bg-blob blob-1"></div>
      <div className="aura-bg-blob blob-2"></div>

      {pendingRequests.length > 0 && (
        <div className="friend-request-toast aura-glass">
          <UserPlus size={20} />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{pendingRequests[0].name} wishes to sync.</div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Check className="clickable-icon" color="#23a559" onClick={() => acceptFriend(pendingRequests[0].id)} />
            <X className="clickable-icon" color="#f23f43" />
          </div>
        </div>
      )}

      <Sidebar
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenFeature={(type) => setActiveFeature(type)}
      />

      <ChannelList
        chats={friends}
        onSelect={(id) => setSelectedPeer(id)}
        selectedId={selectedPeer}
        myId={myId}
        onConnect={sendFriendRequest} // Connect now sends friend request
        username={username}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <ChatArea
        selectedPeer={selectedPeer}
        messages={messages.filter(m => (m.sender === selectedPeer && !m.isMe) || (m.recipient === selectedPeer && m.isMe))}
        onSendMessage={(text) => sendMessage(selectedPeer, text)}
        onSendReaction={(msg, emoji) => sendReaction(selectedPeer, msg, emoji)}
        peerName={friends.find(c => c.id === selectedPeer)?.name}
        onClearChat={clearMessages}
        onUpdateMessages={(newMsgs) => setMessages(newMsgs)}
        onStartCall={(video) => startCall(selectedPeer, video)}
        onAnswerCall={answerCall}
        onEndCall={endCall}
        isCalling={isCalling}
        incomingCall={incomingCall}
        localStream={localStream}
        remoteStream={remoteStream}
      />

      <SettingsModal
        isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)}
        username={username} lastChangeDate={lastChangeDate} onUsernameChange={handleUsernameChange}
        currentTheme={theme} onThemeChange={setTheme}
        user={user}
      />

      <FeatureModal
        isOpen={!!activeFeature}
        onClose={() => setActiveFeature(null)}
        type={activeFeature}
      />

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }}
            className="aura-error-toast" onClick={() => setError(null)}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
