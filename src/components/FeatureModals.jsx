import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Rocket, Sparkles, Plus, Users, Hash } from 'lucide-react';

export const FeatureModal = ({ isOpen, onClose, type }) => {
    if (!isOpen) return null;

    const content = {
        explore: {
            title: 'Explore Realms',
            icon: Search,
            desc: 'Discover ethereal frequencies and trending auras.',
            items: [
                { name: 'Crystal Garden', members: 1240, desc: 'Zen vibes & meditation' },
                { name: 'Neon Void', members: 890, desc: 'Cyberpunk chat & music' },
                { name: 'Lofi Library', members: 2100, desc: 'Study & focus sanctuary' }
            ]
        },
        boost: {
            title: 'Aura Boost',
            icon: Rocket,
            desc: 'Elevate your soul signature with premium perks.',
            perks: [
                { title: 'Divine Identity', desc: 'Animated aura avatars' },
                { title: 'Transcendent Files', desc: 'Send up to 1GB of data' },
                { title: 'Global Echo', desc: 'Exclusive reaction badges' }
            ]
        },
        create: {
            title: 'Create Realm',
            icon: Plus,
            desc: 'Manifest a new sanctuary for your tribe.'
        }
    };

    const data = content[type];
    const Icon = data.icon;

    return (
        <div className="settings-overlay" style={{ zIndex: 50000 }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="auth-card"
                style={{ maxWidth: '500px', width: '90%' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'var(--aura-primary)', padding: '8px', borderRadius: '10px' }}>
                            <Icon size={24} color="white" />
                        </div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{data.title}</h2>
                    </div>
                    <X className="clickable-icon" onClick={onClose} />
                </div>

                <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>{data.desc}</p>

                {type === 'explore' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {data.items.map((item, idx) => (
                            <div key={idx} className="settings-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                                </div>
                                <button className="aura-btn" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>Sync</button>
                            </div>
                        ))}
                    </div>
                )}

                {type === 'boost' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '12px' }}>
                        {data.perks.map((perk, idx) => (
                            <div key={idx} className="settings-card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <Sparkles size={20} color="var(--aura-primary)" />
                                <div>
                                    <div style={{ fontWeight: 600 }}>{perk.title}</div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{perk.desc}</div>
                                </div>
                            </div>
                        ))}
                        <button className="aura-btn" style={{ marginTop: '12px' }}>Ascend to Premium</button>
                    </div>
                )}

                {type === 'create' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div className="settings-card">
                            <div className="settings-label">Realm Name</div>
                            <input className="settings-input" placeholder="Enter sanctuary name..." />
                        </div>
                        <div className="settings-card">
                            <div className="settings-label">Frequency Type</div>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                                <button className="aura-btn" style={{ flex: 1, background: 'var(--bg-dark)' }}>Public</button>
                                <button className="aura-btn" style={{ flex: 1, border: '1px solid var(--aura-primary)' }}>Hidden</button>
                            </div>
                        </div>
                        <button className="aura-btn">Manifest Realm</button>
                    </div>
                )}
            </motion.div>
        </div>
    );
};
