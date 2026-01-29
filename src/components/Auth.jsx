import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

const Auth = ({ onAuthComplete }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        // Simulate auth for demo, since we need real Firebase keys for actual work
        // In a real app, you'd use signInWithEmailAndPassword or createUserWithEmailAndPassword here
        setTimeout(() => {
            onAuthComplete({
                email,
                displayName: isLogin ? (localStorage.getItem('auracord_username') || 'AuraUser') : username,
                uid: Math.random().toString(36).substr(2, 9)
            });
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
                        {isLogin ? 'Welcome back to the ethereal realm.' : 'Join columns of aura light.'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {!isLogin && (
                        <div className="chat-input-wrapper">
                            <User size={20} color="var(--text-muted)" style={{ marginRight: 12 }} />
                            <input
                                className="chat-input"
                                placeholder="Spiritual Identity (Username)"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    )}

                    <div className="chat-input-wrapper">
                        <Mail size={20} color="var(--text-muted)" style={{ marginRight: 12 }} />
                        <input
                            className="chat-input"
                            type="email"
                            placeholder="Email frequency"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="chat-input-wrapper">
                        <Lock size={20} color="var(--text-muted)" style={{ marginRight: 12 }} />
                        <input
                            className="chat-input"
                            type="password"
                            placeholder="Vibration Key (Password)"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button
                        className="aura-btn"
                        style={{ padding: '12px', fontSize: '1rem', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                        disabled={loading}
                    >
                        {loading ? 'Manifesting...' : (isLogin ? 'Ascend' : 'Initialize')}
                        <ArrowRight size={18} />
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.9rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                        {isLogin ? "Don't have an frequency?" : "Already part of the light?"}
                    </span>
                    <button
                        style={{ background: 'none', border: 'none', color: 'var(--aura-primary)', marginLeft: '8px', fontWeight: 600 }}
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? 'Create one' : 'Connect now'}
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Auth;
