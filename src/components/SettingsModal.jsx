import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, User, Shield, Bell, Lock, Palette, Globe, LogOut, Check, ShieldCheck, ShieldAlert, Key } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, username, onUsernameChange, lastChangeDate, currentTheme, onThemeChange, user }) => {
    const [activeTab, setActiveTab] = useState('account');
    const [newName, setNewName] = useState(username);
    const [error, setError] = useState('');

    const themes = [
        { id: 'aura', name: 'Aura Classic', color: '#7c3aed' },
        { id: 'midnight', name: 'Deep Midnight', color: '#3b82f6' },
        { id: 'sunset', name: 'Crimson Sunset', color: '#dc2626' },
        { id: 'emerald', name: 'Emerald Spirit', color: '#10b981' },
        { id: 'sakura', name: 'Sakura Petals', color: '#ff85a2' },
        { id: 'cyberpunk', name: 'Neon City', color: '#f3f315' },
        { id: 'glacier', name: 'Frost Edge', color: '#a5f3fc' },
        { id: 'coffee', name: 'Late Aroma', color: '#d97706' },
    ];

    const canChangeName = () => {
        if (!lastChangeDate) return true;
        const now = new Date();
        const last = new Date(lastChangeDate);
        const diff = (now - last) / (1000 * 60 * 60 * 24);
        return diff >= 7;
    };

    const getRemainingDays = () => {
        if (!lastChangeDate) return 0;
        const nextChange = new Date(lastChangeDate);
        nextChange.setDate(nextChange.getDate() + 7);
        const diff = (nextChange - new Date()) / (1000 * 60 * 60 * 24);
        return Math.ceil(diff);
    };

    const handleSave = () => {
        if (!canChangeName()) {
            setError(`Identity shift cooling down. You must wait ${getRemainingDays()} more days.`);
            return;
        }
        if (newName.trim() === username) {
            onClose();
            return;
        }
        if (newName.trim().length < 2) {
            setError('Vibration sequence too short.');
            return;
        }
        onUsernameChange(newName.trim());
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="settings-overlay">
            <div className="settings-sidebar">
                <div className="settings-section-title">USER SETTINGS</div>
                <div className={`settings-nav-item ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>
                    My Account
                </div>
                <div className={`settings-nav-item ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
                    Privacy & Security
                </div>

                <div className="settings-section-title">APP SETTINGS</div>
                <div className={`settings-nav-item ${activeTab === 'appearance' ? 'active' : ''}`} onClick={() => setActiveTab('appearance')}>
                    Appearance
                </div>
                <div className={`settings-nav-item ${activeTab === 'vibe' ? 'active' : ''}`} onClick={() => setActiveTab('vibe')}>
                    Aura Vibe
                </div>

                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--glass-border)', paddingTop: '10px' }}>
                    <div className="settings-nav-item" style={{ color: '#f23f43' }} onClick={() => { localStorage.clear(); window.location.reload(); }}>
                        <LogOut size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                        Log Out
                    </div>
                </div>
            </div>

            <div className="settings-content-area">
                <div className="settings-close-btn" onClick={onClose}>
                    <X size={20} />
                    <div style={{ position: 'absolute', bottom: -20, fontSize: '0.7rem', fontWeight: 700 }}>ESC</div>
                </div>

                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} key={activeTab}>
                    {activeTab === 'account' && (
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>My Account</h2>
                            <div className="settings-card" style={{ background: 'var(--aura-gradient)', padding: '2px' }}>
                                <div style={{ background: 'var(--bg-darker)', borderRadius: '6px', padding: '20px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                        <div className="message-avatar" style={{ width: 80, height: 80, fontSize: '2rem' }}>
                                            {username.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>{username}</div>
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.email}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="settings-card">
                                <div className="settings-label">Display Name</div>
                                <input className="settings-input" value={newName} onChange={(e) => { setNewName(e.target.value); setError(''); }} />
                                {error && <div className="error-text">{error}</div>}
                                <div style={{ marginTop: '20px' }}>
                                    <button className="aura-btn" onClick={handleSave}>Save Changes</button>
                                    {!canChangeName() && <span style={{ marginLeft: '12px', fontSize: '0.8rem', color: '#f23f43' }}>Cooldown: {getRemainingDays()} days</span>}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Privacy & Security</h2>

                            <div className="settings-card" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div style={{ background: 'rgba(35, 165, 89, 0.1)', padding: '12px', borderRadius: '12px' }}>
                                    <ShieldCheck color="#23a559" size={32} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 600 }}>Two-Factor Authentication</div>
                                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Protected by Ethereal Key (Active)</div>
                                </div>
                                <button className="aura-btn" style={{ background: 'var(--bg-dark)' }}>Managed</button>
                            </div>

                            <div className="settings-card">
                                <div className="settings-label">Security Protocol</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '0.9rem' }}>Strict Friend-Only Messaging</span>
                                        <Check size={18} color="#23a559" />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '0.9rem' }}>P2P Data Encryption (AES-GCM)</span>
                                        <Check size={18} color="#23a559" />
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '0.9rem' }}>Anti-Spam Rate Limiting</span>
                                        <Check size={18} color="#23a559" />
                                    </div>
                                </div>
                            </div>

                            <div className="settings-card">
                                <div className="settings-label">Backup Sync Keys</div>
                                <div style={{ background: 'var(--bg-deep)', padding: '12px', borderRadius: '4px', fontFamily: 'monospace', fontSize: '0.8rem', marginTop: '8px' }}>
                                    AURA-SYNC-7721-8812-9901-SECURE
                                </div>
                                <div className="settings-hint">Keep this key secret. It is your soul's emergency fallback.</div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Appearance</h2>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
                                {themes.map(t => (
                                    <div key={t.id} className={`settings-card ${currentTheme === t.id ? 'active' : ''}`}
                                        style={{ margin: 0, cursor: 'pointer', border: currentTheme === t.id ? '2px solid var(--aura-primary)' : '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '12px' }}
                                        onClick={() => onThemeChange(t.id)}
                                    >
                                        <div style={{ width: 20, height: 20, borderRadius: '50%', background: t.color }}></div>
                                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'vibe' && (
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Aura Vibe</h2>

                            <div className="settings-card">
                                <div className="settings-label">Glow Intensity</div>
                                <input type="range" min="0" max="100" defaultValue="50" className="vibe-slider"
                                    onChange={(e) => document.documentElement.style.setProperty('--aura-glow', `${e.target.value / 50}`)} />
                                <div className="settings-hint">Control the spiritual radiance of your interface.</div>
                            </div>

                            <div className="settings-card">
                                <div className="settings-label">Background Drift Speed</div>
                                <input type="range" min="5" max="60" defaultValue="20" className="vibe-slider"
                                    onChange={(e) => document.documentElement.style.setProperty('--drift-speed', `${e.target.value}s`)} />
                                <div className="settings-hint">Adjust the temporal flow of background energies.</div>
                            </div>

                            <div className="settings-card">
                                <div className="settings-label">Interface Transparency</div>
                                <input type="range" min="5" max="95" defaultValue="15" className="vibe-slider"
                                    onChange={(e) => document.documentElement.style.setProperty('--glass-alpha', `${e.target.value / 100}`)} />
                                <div className="settings-hint">Dissolve the boundaries between your chat and the void.</div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default SettingsModal;
