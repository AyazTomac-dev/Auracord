import React, { useState } from 'react';
import { MessageSquare, Settings, Copy, Check, Plus, Edit3 } from 'lucide-react';

const ChannelList = ({ chats, onSelect, selectedId, myId, onConnect, username, onOpenSettings }) => {
    const [copied, setCopied] = useState(false);
    const [showConnect, setShowConnect] = useState(false);
    const [remoteIdInput, setRemoteIdInput] = useState('');

    const copyId = () => {
        if (!myId) return;
        navigator.clipboard.writeText(myId);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleConnect = () => {
        if (remoteIdInput.trim()) {
            onConnect(remoteIdInput.trim());
            setRemoteIdInput('');
            setShowConnect(false);
        }
    };

    return (
        <div className="channel-list">
            <div className="channel-list-header">
                <span className="auracord-title" style={{ margin: 0, fontSize: '1.2rem' }}>Auracord</span>
            </div>

            <div className="channel-items">
                <div className="channel-item active">
                    <MessageSquare size={20} />
                    <span>Friends</span>
                </div>

                <div style={{ marginTop: '10px', padding: '0 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>DIRECT MESSAGES</span>
                    <Plus size={14} className="clickable-icon" onClick={() => setShowConnect(true)} />
                </div>

                {chats.length === 0 && (
                    <div style={{ padding: '20px 10px', fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>
                        No ethereal connections yet.
                    </div>
                )}

                {chats.map(chat => (
                    <div
                        key={chat.id}
                        className={`channel-item ${selectedId === chat.id ? 'active' : ''}`}
                        onClick={() => onSelect(chat.id)}
                    >
                        <div className="message-avatar" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                            {chat.name.charAt(0).toUpperCase()}
                        </div>
                        <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis' }}>{chat.name}</span>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#23a559' }} />
                    </div>
                ))}
            </div>

            <div className="id-section">
                <div style={{ color: 'var(--text-muted)', marginBottom: '4px', fontSize: '0.7rem' }}>YOUR AURA ID</div>
                <div className="my-id-box" onClick={copyId}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '140px' }}>
                        {myId || 'Awakening...'}
                    </span>
                    {copied ? <Check size={14} color="#23a559" /> : <Copy size={14} />}
                </div>
            </div>

            {showConnect && (
                <div className="connect-modal">
                    <h3 className="auracord-title">Summon Peer</h3>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Enter the Aura ID of the spirit you wish to connect with.</p>
                    <input
                        className="modal-input"
                        placeholder="Aura ID..."
                        value={remoteIdInput}
                        onChange={(e) => setRemoteIdInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                    />
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button onClick={() => setShowConnect(false)} style={{ background: 'transparent', color: 'white', border: 'none' }}>Vanish</button>
                        <button className="aura-btn" onClick={handleConnect}>Summon</button>
                    </div>
                </div>
            )}

            <div style={{
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'rgba(0,0,0,0.4)',
                borderTop: '1px solid var(--glass-border)'
            }}>
                <div className="message-avatar" style={{ width: 32, height: 32, fontSize: '0.8rem' }}>
                    {username.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, overflow: 'hidden' }}>
                    <div style={{ fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                        {username}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#23a559' }}>Online</div>
                </div>
                <div className="clickable-icon" onClick={onOpenSettings}>
                    <Settings size={18} color="var(--text-muted)" />
                </div>
            </div>
        </div>
    );
};

export default ChannelList;
