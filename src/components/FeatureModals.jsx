import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Search, Rocket, Sparkles, Plus, Users, Hash, Zap, ShieldCheck, Heart, Diamond } from 'lucide-react';

export const FeatureModal = ({ isOpen, onClose, type }) => {
    const [actionState, setActionState] = useState(null);

    if (!isOpen) return null;

    const handleAction = (label) => {
        setActionState(label);
        setTimeout(() => setActionState(null), 2000);
    };

    const content = {
        explore: {
            title: 'Explore Realms',
            icon: Search,
            desc: 'Discover ethereal frequencies and trending auras.',
            items: [
                { name: 'Crystal Garden', members: '1.2k', desc: 'Zen vibes & meditation', color: '#a5f3fc' },
                { name: 'Neon Void', members: '890', desc: 'Cyberpunk chat & music', color: '#f3f315' },
                { name: 'Lofi Library', members: '2.1k', desc: 'Study & focus sanctuary', color: '#7c3aed' },
                { name: 'Nature Echoes', members: '450', desc: 'Serene ambient frequency', color: '#10b981' }
            ]
        },
        boost: {
            title: 'Aura Boost',
            icon: Rocket,
            desc: 'Elevate your soul signature with premium perks.',
            perks: [
                { title: 'Divine Identity', desc: 'Custom animated aura profiles', icon: Sparkles },
                { title: 'Transcendent Files', desc: 'Ethereal upload limit up to 2GB', icon: Zap },
                { title: 'Soul Support', desc: 'Support the Auracord frequency', icon: Heart }
            ]
        },
        create: {
            title: 'Create Realm',
            icon: Plus,
            desc: 'Manifest a new sanctuary for your tribe.'
        },
        energy: {
            title: 'Aura Energy',
            icon: Zap,
            desc: 'Your current spiritual resonance status.',
            stats: [
                { label: 'Energy Level', value: 'Infinite', icon: Zap, color: '#f0b232' },
                { label: 'Sync Status', value: 'Harmonized', icon: ShieldCheck, color: '#23a559' },
                { label: 'Rank', value: 'Ethereal Creator', icon: Diamond, color: '#7c3aed' }
            ]
        }
    };

    const data = content[type] || content.energy;
    const Icon = data.icon;

    return (
        <div className="settings-overlay" style={{ zIndex: 50000 }}>
            <motion.div
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.9, opacity: 0, y: 20 }}
                className="auth-card"
                style={{ maxWidth: '550px', width: '95%', background: 'rgba(10, 10, 15, 0.95)', border: '1px solid var(--aura-primary)' }}
            >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'var(--aura-primary)', padding: '10px', borderRadius: '12px', boxShadow: '0 0 20px var(--aura-primary)' }}>
                            <Icon size={26} color="white" />
                        </div>
                        <h2 style={{ fontSize: '1.7rem', fontWeight: 800, letterSpacing: '-0.02em' }}>{data.title}</h2>
                    </div>
                    <X className="clickable-icon" onClick={onClose} size={24} />
                </div>

                <p style={{ color: 'var(--text-muted)', marginBottom: '32px', fontSize: '1.1rem' }}>{data.desc}</p>

                {type === 'explore' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        {data.items.map((item, idx) => (
                            <div key={idx} className="settings-card" style={{ margin: 0, border: `1px solid ${item.color}33`, position: 'relative', overflow: 'hidden' }}>
                                <div style={{ position: 'absolute', top: 0, left: 0, width: '4px', height: '100%', background: item.color }}></div>
                                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>{item.name}</div>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>{item.desc}</div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>{item.members} syncing</span>
                                    <button className="aura-btn" style={{ padding: '4px 12px' }} onClick={() => handleAction(`sync-${idx}`)}>
                                        {actionState === `sync-${idx}` ? 'Syncing...' : 'Sync'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {type === 'boost' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {data.perks.map((perk, idx) => (
                            <div key={idx} className="settings-card" style={{ display: 'flex', gap: '20px', alignItems: 'center', margin: 0 }}>
                                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '12px', borderRadius: '12px' }}>
                                    <perk.icon size={24} color="var(--aura-primary)" />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{perk.title}</div>
                                    <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>{perk.desc}</div>
                                </div>
                                <Check size={20} color="#23a559" style={{ opacity: 0.5 }} />
                            </div>
                        ))}
                        <button className="aura-btn" style={{ padding: '16px', fontSize: '1.1rem', marginTop: '12px' }} onClick={() => handleAction('boost-main')}>
                            {actionState === 'boost-main' ? 'Transcending...' : 'Begin Ascension'}
                        </button>
                    </div>
                )}

                {type === 'create' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div className="settings-card" style={{ margin: 0 }}>
                            <div className="settings-label">Realm Signature</div>
                            <input className="settings-input" placeholder="Frequency name (e.g. Zen Den)" style={{ fontSize: '1.1rem', padding: '12px' }} />
                        </div>
                        <div className="settings-card" style={{ margin: 0 }}>
                            <div className="settings-label">Aura Frequency</div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '10px' }}>
                                {['Public', 'Hidden', 'Eternal'].map(f => (
                                    <button key={f} className="aura-btn" style={{ background: f === 'Public' ? 'var(--aura-primary)' : 'var(--bg-dark)', border: f === 'Public' ? 'none' : '1px solid var(--glass-border)' }}>{f}</button>
                                ))}
                            </div>
                        </div>
                        <button className="aura-btn" style={{ padding: '16px', fontSize: '1.1rem' }} onClick={() => handleAction('create-main')}>
                            {actionState === 'create-main' ? 'Manifesting...' : 'Manifest Realm'}
                        </button>
                    </div>
                )}

                {type === 'energy' && (
                    <div style={{ display: 'grid', gap: '16px' }}>
                        {data.stats.map((stat, idx) => (
                            <div key={idx} className="settings-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: 0 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <stat.icon size={20} color={stat.color} />
                                    <span style={{ fontWeight: 600 }}>{stat.label}</span>
                                </div>
                                <span style={{ color: stat.color, fontWeight: 800 }}>{stat.value}</span>
                            </div>
                        ))}
                        <div className="settings-card" style={{ margin: 0, textAlign: 'center', background: 'var(--aura-gradient)', opacity: 0.9 }}>
                            <div style={{ fontWeight: 800 }}>ENERGY OVERLOAD</div>
                            <div style={{ fontSize: '0.8rem' }}>Your presence strengthens the collective aura.</div>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};
