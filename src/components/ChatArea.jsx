import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Hash, Phone, Video, Users, Bell, Search, Inbox, HelpCircle, PlusCircle, Gift, Sticker, Smile, Trash2, X } from 'lucide-react';
import ContextMenu from './ContextMenu';

const ChatArea = ({ selectedPeer, messages, onSendMessage, onSendReaction, peerName, onClearChat, onUpdateMessages }) => {
    const [inputText, setInputText] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [contextMenu, setContextMenu] = useState(null);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (inputText.trim()) {
            onSendMessage(inputText.trim());
            setInputText('');
        }
    };

    const handleContextMenu = (e, msgId) => {
        e.preventDefault();
        setContextMenu({
            x: e.clientX,
            y: e.clientY,
            msgId
        });
    };

    const handleInteract = (type, data) => {
        if (!contextMenu) return;
        const { msgId } = contextMenu;
        const msg = messages.find(m => m.id === msgId);

        switch (type) {
            case 'copy':
                navigator.clipboard.writeText(msg.text);
                break;
            case 'react':
                // Local update
                const updated = messages.map(m => {
                    if (m.id === msgId) {
                        const reactions = m.reactions || {};
                        reactions[data] = (reactions[data] || 0) + 1;
                        return { ...m, reactions };
                    }
                    return m;
                });
                onUpdateMessages(updated);
                // Peer update
                onSendReaction(msg, data);
                break;
            case 'delete':
                onUpdateMessages(messages.filter(m => m.id !== msgId));
                break;
            default:
                break;
        }
        setContextMenu(null);
    };

    const filteredMessages = useMemo(() => {
        if (!searchTerm.trim()) return messages;
        return messages.filter(m => m.text.toLowerCase().includes(searchTerm.toLowerCase()));
    }, [messages, searchTerm]);

    if (!selectedPeer) {
        return (
            <div className="chat-area" style={{ justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ textAlign: 'center', padding: '40px' }}>
                    <div className="aura-bg-blob" style={{ position: 'relative', margin: '0 auto', width: '200px', height: '200px', opacity: 0.4 }}></div>
                    <h2 className="auracord-title" style={{ fontSize: '3.5rem', marginTop: '-140px' }}>Auracord</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', maxWidth: '400px', margin: '20px auto' }}>
                        Enter the ethereal frequency. Connect with friends and share the aura.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-area">
            <div className="chat-header">
                <Hash size={24} color="var(--text-muted)" style={{ marginRight: 8 }} />
                <span style={{ fontWeight: 600 }}>{peerName || 'Wandering Soul'}</span>

                <div style={{ marginLeft: 'auto', display: 'flex', gap: '16px', color: 'var(--text-muted)', alignItems: 'center' }}>
                    {showSearch ? (
                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', padding: '2px 8px' }}>
                            <input
                                autoFocus
                                style={{ background: 'transparent', border: 'none', color: 'white', fontSize: '0.8rem', outline: 'none', width: '120px' }}
                                placeholder="Search vibrations..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <X size={14} className="clickable-icon" onClick={() => { setShowSearch(false); setSearchTerm(''); }} />
                        </div>
                    ) : (
                        <Search size={20} className="clickable-icon" onClick={() => setShowSearch(true)} />
                    )}

                    <Phone size={20} className="clickable-icon" />
                    <Video size={20} className="clickable-icon" />
                    <Trash2 size={20} className="clickable-icon" style={{ color: '#f23f43' }} onClick={() => onClearChat()} />
                    <div style={{ width: '1px', height: '24px', background: 'var(--glass-border)' }} />
                    <Bell size={20} className="clickable-icon" />
                    <Users size={20} className="clickable-icon" />
                </div>
            </div>

            <div className="messages-container">
                {filteredMessages.map((msg) => (
                    <div
                        key={msg.id}
                        className="message-group"
                        onContextMenu={(e) => handleContextMenu(e, msg.id)}
                    >
                        <div className="message-avatar">
                            {msg.senderName.charAt(0).toUpperCase()}
                        </div>
                        <div className="message-content">
                            <div className="message-info">
                                <span className="message-sender" style={{ color: msg.isMe ? 'var(--aura-accent)' : 'inherit' }}>
                                    {msg.senderName}
                                </span>
                                <span className="message-time">
                                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <div className="message-text">{msg.text}</div>

                            {msg.reactions && (
                                <div className="message-reaction-list">
                                    {Object.entries(msg.reactions).map(([emoji, count]) => (
                                        <div key={emoji} className="reaction-chip" onClick={() => handleInteract('react', emoji)}>
                                            <span>{emoji}</span>
                                            <span style={{ fontSize: '0.7rem', opacity: 0.8 }}>{count}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            {contextMenu && (
                <ContextMenu
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onInteract={handleInteract}
                    onClose={() => setContextMenu(null)}
                />
            )}

            <div className="chat-input-area">
                <form onSubmit={handleSubmit} className="chat-input-wrapper">
                    <PlusCircle size={24} color="var(--text-muted)" className="clickable-icon" style={{ marginRight: 16 }} />
                    <input
                        className="chat-input"
                        placeholder={`Chant to @${peerName || 'Soul'}...`}
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                    />
                    <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)' }}>
                        <Gift size={24} className="clickable-icon" />
                        <Smile size={24} className="clickable-icon" />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChatArea;
