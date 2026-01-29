import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Key } from 'lucide-react';

const Auth = ({ onAuthComplete }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [tfaCode, setTfaCode] = useState('');
    const [showTfa, setShowTfa] = useState(false);
    const [loading, setLoading] = useState(false);

    // Security: Simulated 2FA Key
    const SECURITY_KEY = "AURA-2FA-SECURE";

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        if (isLogin && !showTfa) {
            setTimeout(() => {
                setShowTfa(true);
                setLoading(false);
            }, 1000);
            return;
        }

        setTimeout(() => {
            // Security: 2FA Validation
            if (showTfa && tfaCode !== "123456") {
                alert("Invalid Ethereal Key (2FA). Hint: 123456");
                setLoading(false);
                return;
            }

            const userData = {
                email,
                displayName: isLogin ? (localStorage.getItem('auracord_username') || 'AuraUser') : username,
                uid: btoa(email).substr(0, 15), // Stable ID from email
                isTfaEnabled: true
            };

            onAuthComplete(userData);
            setLoading(false);
        }, 1500);
    };

    return (
        <div className="auth-overlay">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="auth-card"
            >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '64px', height: '64px', borderRadius: '20px',
                        background: 'var(--aura-gradient)', margin: '0 auto 16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 8px 16px rgba(124, 58, 237, 0.3)'
                    }}>
                        <ShieldCheck color="white" size={32} />
                    </div>
                    <h1 className="auracord-title" style={{ fontSize: '2rem' }}>Auracord</h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        {showTfa ? '2-Step Verification Active' : (isLogin ? 'Ascend with your frequency.' : 'Initialize your soul signature.')}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {!showTfa ? (
                        <>
                            {!isLogin && (
                                <div className="chat-input-wrapper">
                                    <User size={20} color="var(--text-muted)" style={{ marginRight: 12 }} />
                                    <input className="chat-input" placeholder="Identity Name" required value={username} onChange={(e) => setUsername(e.target.value)} />
                                </div>
                            )}
                            <div className="chat-input-wrapper">
                                <Mail size={20} color="var(--text-muted)" style={{ marginRight: 12 }} />
                                <input className="chat-input" type="email" placeholder="Soul Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="chat-input-wrapper">
                                <Lock size={20} color="var(--text-muted)" style={{ marginRight: 12 }} />
                                <input className="chat-input" type="password" placeholder="Vibration Key" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </>
                    ) : (
                        <div className="chat-input-wrapper">
                            <Key size={20} color="var(--aura-primary)" style={{ marginRight: 12 }} />
                            <input
                                className="chat-input"
                                placeholder="6-Digit Sync Code (123456)"
                                maxLength={6}
                                required
                                value={tfaCode}
                                onChange={(e) => setTfaCode(e.target.value)}
                            />
                        </div>
                    )}

                    <button className="aura-btn" disabled={loading} style={{ padding: '12px' }}>
                        {loading ? 'Securing...' : (showTfa ? 'Verify Infinity' : (isLogin ? 'Ascend' : 'Create Signature'))}
                    </button>
                </form>

                {!showTfa && (
                    <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem' }}>
                        <button style={{ background: 'none', border: 'none', color: 'var(--aura-primary)', fontWeight: 600 }} onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? 'Create new signature' : 'Already have a signal?'}
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default Auth;
