import { useState, useEffect, useCallback, useRef } from 'react';
import { Peer } from 'peerjs';
import { v4 as uuidv4 } from 'uuid';

export const usePeer = (username) => {
    const [peer, setPeer] = useState(null);
    const [myId, setMyId] = useState('');
    const [connections, setConnections] = useState({});
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('auracord_messages');
        return saved ? JSON.parse(saved) : [];
    });
    const [error, setError] = useState(null);

    useEffect(() => {
        localStorage.setItem('auracord_messages', JSON.stringify(messages));
    }, [messages]);

    useEffect(() => {
        const newPeer = new Peer(uuidv4(), { debug: 1 });
        newPeer.on('open', (id) => setMyId(id));
        newPeer.on('connection', (conn) => setupConnection(conn));
        newPeer.on('error', (err) => setError(err.message));
        setPeer(newPeer);
        return () => newPeer.destroy();
    }, []);

    const setupConnection = useCallback((conn) => {
        conn.on('open', () => {
            setConnections((prev) => ({ ...prev, [conn.peer]: conn }));
            conn.send({ type: 'handshake', username });
        });

        conn.on('data', (data) => {
            if (data.type === 'message') {
                setMessages((prev) => [...prev, {
                    id: uuidv4(),
                    sender: conn.peer,
                    senderName: data.username,
                    text: data.text,
                    timestamp: new Date().toISOString(),
                    isMe: false
                }]);
            } else if (data.type === 'reaction') {
                setMessages((prev) => prev.map(m => {
                    if (m.id === data.msgId || (m.text === data.msgText && m.timestamp === data.msgTimestamp)) {
                        const reactions = m.reactions || {};
                        reactions[data.emoji] = (reactions[data.emoji] || 0) + 1;
                        return { ...m, reactions };
                    }
                    return m;
                }));
            } else if (data.type === 'handshake') {
                setConnections((prev) => ({
                    ...prev,
                    [conn.peer]: { ...prev[conn.peer], remoteUsername: data.username }
                }));
            } else if (data.type === 'nameChange') {
                setConnections((prev) => ({
                    ...prev,
                    [conn.peer]: { ...prev[conn.peer], remoteUsername: data.newUsername }
                }));
            }
        });

        conn.on('close', () => {
            setConnections((prev) => {
                const newConns = { ...prev };
                delete newConns[conn.peer];
                return newConns;
            });
        });
    }, [username]);

    const connectToPeer = useCallback((remoteId) => {
        if (!peer || connections[remoteId]) return;
        const conn = peer.connect(remoteId);
        setupConnection(conn);
    }, [peer, connections, setupConnection]);

    const sendMessage = useCallback((remoteId, text) => {
        const conn = connections[remoteId];
        if (conn) {
            conn.send({ type: 'message', text, username });
            setMessages((prev) => [...prev, {
                id: uuidv4(),
                sender: myId,
                senderName: username,
                text,
                timestamp: new Date().toISOString(),
                isMe: true,
                recipient: remoteId
            }]);
        }
    }, [connections, myId, username]);

    const sendReaction = useCallback((remoteId, msg, emoji) => {
        const conn = connections[remoteId];
        if (conn) {
            conn.send({
                type: 'reaction',
                emoji,
                msgId: msg.id,
                msgText: msg.text,
                msgTimestamp: msg.timestamp
            });
        }
    }, [connections]);

    const broadcastNameChange = useCallback((newUsername) => {
        Object.values(connections).forEach(conn => {
            if (conn.open) conn.send({ type: 'nameChange', newUsername });
        });
    }, [connections]);

    const clearMessages = useCallback(() => {
        setMessages([]);
        localStorage.removeItem('auracord_messages');
    }, []);

    return { myId, connections, messages, setMessages, connectToPeer, sendMessage, sendReaction, broadcastNameChange, clearMessages, error };
};
