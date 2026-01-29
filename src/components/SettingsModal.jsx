import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, User, Shield, Bell, Lock, Palette, Globe, LogOut, Check } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, username, onUsernameChange, lastChangeDate, currentTheme, onThemeChange }) => {
    const [activeTab, setActiveTab] = useState('account');
    const [newName, setNewName] = useState(username);
    const [error, setError] = useState('');

    const themes = [
        { id: 'aura', name: 'Aura Classic', color: '#7c3aed' },
        { id: 'midnight', name: 'Deep Midnight', color: '#3b82f6' },
        { id: 'sunset', name: 'Crimson Sunset', color: '#dc2626' },
        { id: 'emerald', name: 'Emerald Spirit', color: '#10b981' },
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
                <div className={`settings-nav-item ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
                    User Profile
                </div>

                <div className="settings-section-title">APP SETTINGS</div>
                <div className={`settings-nav-item ${activeTab === 'appearance' ? 'active' : ''}`} onClick={() => setActiveTab('appearance')}>
                    Appearance
                </div>
                <div className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                    Notifications
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

                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={activeTab}
                >
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
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Aura Frequency: Stable</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="settings-card">
                                <div className="settings-label">Display Name</div>
                                <input
                                    className="settings-input"
                                    value={newName}
                                    onChange={(e) => { setNewName(e.target.value); setError(''); }}
                                />
                                {error && <div className="error-text">{error}</div>}
                                <div className="settings-hint">You can alter your ethereal identity once every 7 sun-cycles.</div>

                                <div style={{ marginTop: '20px' }}>
                                    <button className="aura-btn" onClick={handleSave}>Save Changes</button>
                                    {!canChangeName() && (
                                        <span style={{ marginLeft: '12px', fontSize: '0.8rem', color: '#f23f43' }}>
                                            Cooldown: {getRemainingDays()} days left
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>Appearance</h2>
                            <div className="settings-label">Ethereal Themes</div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '12px' }}>
                                {themes.map(t => (
                                    <div
                                        key={t.id}
                                        className={`settings-card ${currentTheme === t.id ? 'active' : ''}`}
                                        style={{
                                            margin: 0,
                                            cursor: 'pointer',
                                            border: currentTheme === t.id ? '2px solid var(--aura-primary)' : '1px solid var(--glass-border)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            position: 'relative'
                                        }}
                                        onClick={() => onThemeChange(t.id)}
                                    >
                                        <div style={{ width: 24, height: 24, borderRadius: '50%', background: t.color }}></div>
                                        <span style={{ fontWeight: 600 }}>{t.name}</span>
                                        {currentTheme === t.id && (
                                            <div style={{ position: 'absolute', right: 12 }}>
                                                <Check size={16} color="var(--aura-primary)" />
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {['profile', 'notifications'].includes(activeTab) && (
                        <div style={{ textAlign: 'center', marginTop: '100px' }}>
                            <Shield size={64} color="var(--aura-primary)" style={{ opacity: 0.3, marginBottom: '20px' }} />
                            <h3 style={{ color: 'var(--text-muted)' }}>This spiritual plane is currently stabilizing.</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Fully functional sync manifesting soon.</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default SettingsModal;
