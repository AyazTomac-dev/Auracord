import { useState, useEffect, useCallback, useRef } from 'react';
import { Peer } from 'peerjs';
import { v4 as uuidv4 } from 'uuid';

export const usePeer = (username, userId) => {
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
        if (!userId) return;

        // Use a stable ID based on user unique identifier
        const newPeer = new Peer(userId, {
            debug: 1,
            config: {
                'iceServers': [
                    { url: 'stun:stun.l.google.com:19302' },
                    { url: 'stun:stun1.l.google.com:19302' }
                ]
            }
        });

        newPeer.on('open', (id) => {
            setMyId(id);
            setError(null);
        });

        newPeer.on('connection', (conn) => {
            setupConnection(conn);
        });

        newPeer.on('error', (err) => {
            if (err.type === 'peer-not-found') {
                setError("Spirit not found. They might be offline or in another realm.");
            } else if (err.type === 'unavailable-id') {
                // ID already taken (maybe open in another tab)
                setError("Identity already active in another portal. Please close other tabs.");
            } else {
                setError("Aura Connection Interrupted: " + err.message);
            }
            console.error('PeerJS Error:', err);
        });

        setPeer(newPeer);
        return () => newPeer.destroy();
    }, [userId]);

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
                    if (m.id === data.msgId) {
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

        const removeConnection = () => {
            setConnections((prev) => {
                const newConns = { ...prev };
                delete newConns[conn.peer];
                return newConns;
            });
        };

        conn.on('close', removeConnection);
        conn.on('error', removeConnection);
    }, [username]);

    const connectToPeer = useCallback((remoteId) => {
        if (!peer || connections[remoteId]) return;
        setError(null);
        try {
            const conn = peer.connect(remoteId, {
                reliable: true
            });
            setupConnection(conn);
        } catch (err) {
            setError("Failed to manifest connection: " + err.message);
        }
    }, [peer, connections, setupConnection]);

    const sendMessage = useCallback((remoteId, text) => {
        const conn = connections[remoteId];
        if (conn && conn.open) {
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
        } else {
            setError("Connection lost. Trying to re-summon...");
            // Attempt to reconnect
            connectToPeer(remoteId);
        }
    }, [connections, myId, username, connectToPeer]);

    const sendReaction = useCallback((remoteId, msg, emoji) => {
        const conn = connections[remoteId];
        if (conn && conn.open) {
            conn.send({
                type: 'reaction',
                emoji,
                msgId: msg.id
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

    return { myId, connections, messages, setMessages, connectToPeer, sendMessage, sendReaction, broadcastNameChange, clearMessages, error, setError };
};
