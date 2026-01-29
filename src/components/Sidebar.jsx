import React, { useState } from 'react';
import { Home, Compass, Plus, Download, Hash, Rocket, Ghost, Zap } from 'lucide-react';

const Sidebar = () => {
    const [active, setActive] = useState('home');

    const icons = [
        { id: 'home', Icon: Home, tooltip: 'Aura Home', color: 'inherit' },
        { id: 'compass', Icon: Compass, tooltip: 'Explore Auras', color: 'inherit' },
        { id: 'aura-plus', Icon: Rocket, tooltip: 'Boost Aura', color: '#7c3aed' },
        { id: 'add', Icon: Plus, tooltip: 'Create Realm', color: '#23a559' },
    ];

    return (
        <div className="sidebar">
            {icons.map(({ id, Icon, tooltip, color }) => (
                <div
                    key={id}
                    className={`sidebar-icon ${active === id ? 'active' : ''}`}
                    onClick={() => setActive(id)}
                >
                    <Icon size={28} color={color === 'inherit' ? undefined : color} />
                    <div className="tooltip">{tooltip}</div>
                </div>
            ))}

            <div className="sidebar-separator" />

            <div className="sidebar-icon">
                <Zap size={24} color="#f0b232" />
                <div className="tooltip">Aura Energy</div>
            </div>

            <div style={{ marginTop: 'auto' }} className="sidebar-icon">
                <Download size={24} color="#23a559" />
                <div className="tooltip">Ethereal Client</div>
            </div>
        </div>
    );
};

export default Sidebar;
