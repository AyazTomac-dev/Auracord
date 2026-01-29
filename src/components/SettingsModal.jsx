import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, User, Shield, Bell, Lock, Palette, Globe, LogOut } from 'lucide-react';

const SettingsModal = ({ isOpen, onClose, username, onUsernameChange, lastChangeDate }) => {
    const [activeTab, setActiveTab] = useState('account');
    const [newName, setNewName] = useState(username);
    const [error, setError] = useState('');

    const canChangeName = () => {
        if (!lastChangeDate) return true;
        const now = new Date();
        const last = new Date(lastChangeDate);
        const diff = (now - last) / (1000 * 60 * 60 * 24); // diff in days
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
        if (newName.trim().length < 3) {
            setError('Vibration sequence too short (min 3 chars).');
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
                <div className={`settings-nav-item ${activeTab === 'privacy' ? 'active' : ''}`} onClick={() => setActiveTab('privacy')}>
                    Privacy & Safety
                </div>

                <div className="settings-section-title">APP SETTINGS</div>
                <div className={`settings-nav-item ${activeTab === 'appearance' ? 'active' : ''}`} onClick={() => setActiveTab('appearance')}>
                    Appearance
                </div>
                <div className={`settings-nav-item ${activeTab === 'notifications' ? 'active' : ''}`} onClick={() => setActiveTab('notifications')}>
                    Notifications
                </div>
                <div className={`settings-nav-item ${activeTab === 'language' ? 'active' : ''}`} onClick={() => setActiveTab('language')}>
                    Language
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
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
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
                                            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Aura Pulse: Balanced</div>
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
                                <div className="settings-hint">Identity can be altered once every 7 sun-cycles.</div>

                                <div style={{ marginTop: '20px' }}>
                                    <button className="aura-btn" onClick={handleSave}>Save Changes</button>
                                    {!canChangeName() && (
                                        <span style={{ marginLeft: '12px', fontSize: '0.8rem', color: '#f23f43' }}>
                                            Cooldown: {getRemainingDays()} days left
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="settings-card">
                                <div className="settings-label">Ethereal Key (Password)</div>
                                <button className="aura-btn" style={{ background: 'var(--bg-dark)' }}>Change Key</button>
                            </div>
                        </div>
                    )}

                    {activeTab !== 'account' && (
                        <div style={{ textAlign: 'center', marginTop: '100px' }}>
                            <Shield size={64} color="var(--aura-primary)" style={{ opacity: 0.3, marginBottom: '20px' }} />
                            <h3 style={{ color: 'var(--text-muted)' }}>This spiritual plane is currently stabilizing.</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Feature manifesting in future updates.</p>
                        </div>
                    )}
                </motion.div>
            </div >
        </div >
    );
};

export default SettingsModal;
