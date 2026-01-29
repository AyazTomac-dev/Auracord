import React, { useEffect } from 'react';
import { Copy, Trash2, Smile, Reply, Share2, MessageSquareText } from 'lucide-react';

const ContextMenu = ({ x, y, onInteract, onClose, reactions }) => {
    useEffect(() => {
        const handleGlobalClick = () => onClose();
        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, [onClose]);

    const commonReactions = ['✨', '🔥', '💖', '👋', '🙏', '💯'];

    return (
        <div className="context-menu" style={{ top: y, left: x }} onClick={(e) => e.stopPropagation()}>
            <div className="reaction-bar">
                {commonReactions.map(emoji => (
                    <div key={emoji} className="reaction-btn" onClick={() => onInteract('react', emoji)}>
                        {emoji}
                    </div>
                ))}
                <Smile size={16} style={{ margin: 'auto' }} />
            </div>

            <div className="context-menu-item" onClick={() => onInteract('copy')}>
                <Copy size={18} />
                <span>Copy Essence</span>
            </div>

            <div className="context-menu-item" onClick={() => onInteract('reply')}>
                <Reply size={18} />
                <span>Sync Reply</span>
            </div>

            <div className="context-menu-item" onClick={() => onInteract('edit')}>
                <MessageSquareText size={18} />
                <span>Alter Vibration</span>
            </div>

            <div style={{ margin: '4px 0', height: '1px', background: 'var(--glass-border)' }} />

            <div className="context-menu-item" style={{ color: '#f23f43' }} onClick={() => onInteract('delete')}>
                <Trash2 size={18} />
                <span>Dissolve</span>
            </div>
        </div>
    );
};

export default ContextMenu;
