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
  const [theme, setTheme] = useState(() => localStorage.getItem('auracord_theme') || 'aura');
  const [selectedPeer, setSelectedPeer] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const {
    myId, connections, messages, setMessages, connectToPeer,
    sendMessage, sendReaction, broadcastNameChange, clearMessages, error, setError
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

  return (
    <div className="app-container">
      {!user && <Auth onAuthComplete={handleAuthComplete} />}

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
        currentTheme={theme}
        onThemeChange={setTheme}
      />

      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="aura-glass"
            onClick={() => setError(null)}
            style={{
              position: 'fixed', bottom: 20, right: 20, cursor: 'pointer',
              background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444',
              color: 'white', padding: '12px 24px', borderRadius: '8px', zIndex: 30000,
              backdropFilter: 'blur(10px)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)'
            }}
          >
            {error}
            <div style={{ fontSize: '0.7rem', marginTop: '4px', opacity: 0.7 }}>Click to vanish</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
