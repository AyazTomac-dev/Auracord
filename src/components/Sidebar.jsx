import React, { useState } from 'react';
import { Home, Compass, Plus, Rocket, Zap, Settings as SettingsIcon, Menu } from 'lucide-react';

const Sidebar = ({ onOpenSettings, onToggleMenu }) => {
    const [active, setActive] = useState('home');

    const icons = [
        { id: 'home', Icon: Home, tooltip: 'Aura Home', color: 'inherit', action: () => setActive('home') },
        { id: 'compass', Icon: Compass, tooltip: 'Explore Auras', color: 'inherit', action: () => alert('Exploration frequency synchronizing...') },
        { id: 'aura-plus', Icon: Rocket, tooltip: 'Boost Aura', color: '#7c3aed', action: () => alert('Aura Boosting is manifesting.') },
        { id: 'add', Icon: Plus, tooltip: 'Create Realm', color: '#23a559', action: () => alert('Realm creation initializing...') },
    ];

    return (
        <div className="sidebar">
            <div className="sidebar-icon mobile-only" onClick={onToggleMenu}>
                <Menu size={28} color="var(--aura-primary)" />
            </div>

            {icons.map(({ id, Icon, tooltip, color, action }) => (
                <div
                    key={id}
                    className={`sidebar-icon ${active === id ? 'active' : ''}`}
                    onClick={action}
                >
                    <Icon size={28} color={color === 'inherit' ? undefined : color} />
                    <div className="tooltip">{tooltip}</div>
                </div>
            ))}

            <div className="sidebar-separator" />

            <div className="sidebar-icon" onClick={() => alert('Aura Energy: Infinite')}>
                <Zap size={24} color="#f0b232" />
                <div className="tooltip">Aura Energy</div>
            </div>

            <div style={{ marginTop: 'auto' }} className="sidebar-icon" onClick={onOpenSettings}>
                <SettingsIcon size={24} color="var(--text-muted)" />
                <div className="tooltip">Identity Settings</div>
            </div>
        </div>
    );
};

export default Sidebar;
