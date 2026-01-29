import React, { useState, useEffect } from 'react';
import { usePeer } from './hooks/usePeer';
import Sidebar from './components/Sidebar';
import ChannelList from './components/ChannelList';
import ChatArea from './components/ChatArea';
import Auth from './components/Auth';
import SettingsModal from './components/SettingsModal';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('auracord_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [username, setUsername] = useState(() => user?.displayName || 'Aura Spirit');
  const [lastChangeDate, setLastChangeDate] = useState(() => localStorage.getItem('auracord_last_name_change'));
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    myId, connections, messages, setMessages, connectToPeer,
    sendMessage, sendReaction, broadcastNameChange, clearMessages, error
  } = usePeer(username);

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

  const activeChats = Object.keys(connections).map(id => ({
    id,
    name: connections[id].remoteUsername || 'Ethereal Being',
    status: 'online'
  }));

  const filteredMessages = messages.filter(m =>
    (m.sender === selectedPeer && !m.isMe) || (m.recipient === selectedPeer && m.isMe)
  );

  const handleUsernameChange = (newName) => {
    setUsername(newName);
    broadcastNameChange(newName);
    const now = new Date().toISOString();
    setLastChangeDate(now);
    localStorage.setItem('auracord_last_name_change', now);
    setUser({ ...user, displayName: newName });
  };

  if (!user) {
    return <Auth onAuthComplete={handleAuthComplete} />;
  }

  return (
    <div className="app-container">
      <div className="aura-bg-blob blob-1"></div>
      <div className="aura-bg-blob blob-2"></div>

      <Sidebar onOpenSettings={() => setIsSettingsOpen(true)} />

      <ChannelList
        chats={activeChats}
        onSelect={setSelectedPeer}
        selectedId={selectedPeer}
        myId={myId}
        onConnect={connectToPeer}
        username={username}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      <ChatArea
        selectedPeer={selectedPeer}
        messages={filteredMessages}
        onSendMessage={(text) => sendMessage(selectedPeer, text)}
        onSendReaction={(msg, emoji) => sendReaction(selectedPeer, msg, emoji)}
        peerName={activeChats.find(c => c.id === selectedPeer)?.name}
        onClearChat={clearMessages}
        onUpdateMessages={(newMsgs) => setMessages(newMsgs)}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        username={username}
        lastChangeDate={lastChangeDate}
        onUsernameChange={handleUsernameChange}
      />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="aura-glass"
            style={{
              position: 'fixed', bottom: 20, right: 20,
              background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444',
              color: '#ef4444', padding: '12px 24px', borderRadius: '8px', zIndex: 2000
            }}
          >
            Aura Error: {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
