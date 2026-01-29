import { useState, useEffect, useCallback, useRef } from 'react';
import { Peer } from 'peerjs';
import { v4 as uuidv4 } from 'uuid';
import { sanitize, detectInjection } from '../utils/security';

export const usePeer = (username, userId) => {
    const [peer, setPeer] = useState(null);
    const [myId, setMyId] = useState('');
    const [connections, setConnections] = useState({});
    const [friends, setFriends] = useState(() => {
        const saved = localStorage.getItem('auracord_friends');
        return saved ? JSON.parse(saved) : [];
    });
    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem('auracord_messages');
        return saved ? JSON.parse(saved) : [];
    });
    const [error, setError] = useState(null);
    const [pendingRequests, setPendingRequests] = useState([]);
    const [auraEnergy, setAuraEnergy] = useState(() => {
        const saved = localStorage.getItem('auracord_energy');
        return saved ? parseInt(saved) : 100;
    });

    // Rate limiting
    const lastMsgTime = useRef(0);
    const msgCount = useRef(0);

    // Media states
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [isCalling, setIsCalling] = useState(false);
    const [incomingCall, setIncomingCall] = useState(null);
    const currentCall = useRef(null);

    useEffect(() => {
        localStorage.setItem('auracord_messages', JSON.stringify(messages));
        localStorage.setItem('auracord_friends', JSON.stringify(friends));
        localStorage.setItem('auracord_energy', auraEnergy.toString());
    }, [messages, friends, auraEnergy]);

    useEffect(() => {
        if (!userId) return;

        const newPeer = new Peer(userId, {
            debug: 1,
            config: {
                'iceServers': [
                    { url: 'stun:stun.l.google.com:19302' },
                    { url: 'stun:stun1.l.google.com:19302' }
                ]
            }
        });

        newPeer.on('open', (id) => setMyId(id));
        newPeer.on('connection', (conn) => setupConnection(conn));
        newPeer.on('call', (call) => {
            if (friends.some(f => f.id === call.peer)) {
                setIncomingCall(call);
            } else {
                call.close();
            }
        });

        newPeer.on('error', (err) => {
            if (err.type === 'peer-not-found') setError("Spirit not found.");
            else console.error('PeerJS Error:', err);
        });

        setPeer(newPeer);
        return () => newPeer.destroy();
    }, [userId, friends]);

    const setupConnection = useCallback((conn) => {
        conn.on('open', () => {
            setConnections((prev) => ({ ...prev, [conn.peer]: conn }));
            conn.send({ type: 'handshake', username, isFriend: friends.some(f => f.id === conn.peer) });
        });

        conn.on('data', (data) => {
            if (typeof data !== 'object') return;

            switch (data.type) {
                case 'friend-request':
                    setPendingRequests(prev => [...prev, { id: conn.peer, name: data.username }]);
                    break;

                case 'friend-accept':
                    setFriends(prev => {
                        if (prev.some(f => f.id === conn.peer)) return prev;
                        return [...prev, { id: conn.peer, name: data.username }];
                    });
                    break;

                case 'message':
                    if (friends.some(f => f.id === conn.peer)) {
                        const isMalicious = detectInjection(data.text);
                        if (isMalicious) {
                            setError("High-frequency interference detected (Malicious Pattern Blocked).");
                            return;
                        }

                        setAuraEnergy(prev => prev + 5);
                        setMessages((prev) => [...prev, {
                            id: uuidv4(),
                            sender: conn.peer,
                            senderName: sanitize(data.username),
                            text: sanitize(data.text).substring(0, 2000),
                            timestamp: new Date().toISOString(),
                            isMe: false
                        }]);
                    }
                    break;

                case 'reaction':
                    if (friends.some(f => f.id === conn.peer)) {
                        setMessages((prev) => prev.map(m => {
                            if (m.id === data.msgId) {
                                const reactions = m.reactions || {};
                                reactions[data.emoji] = (reactions[data.emoji] || 0) + 1;
                                return { ...m, reactions };
                            }
                            return m;
                        }));
                    }
                    break;

                case 'handshake':
                    setConnections((prev) => ({
                        ...prev,
                        [conn.peer]: { ...prev[conn.peer], remoteUsername: data.username }
                    }));
                    break;
            }
        });

        const cleanup = () => {
            setConnections((prev) => {
                const newConns = { ...prev };
                delete newConns[conn.peer];
                return newConns;
            });
        };
        conn.on('close', cleanup);
        conn.on('error', cleanup);
    }, [username, friends]);

    const sendFriendRequest = (remoteId) => {
        const conn = peer.connect(remoteId, { reliable: true });
        conn.on('open', () => {
            conn.send({ type: 'friend-request', username });
        });
        setupConnection(conn);
    };

    const acceptFriend = (requestId) => {
        const conn = connections[requestId];
        if (conn) {
            conn.send({ type: 'friend-accept', username });
            setFriends(prev => [...prev, { id: requestId, name: pendingRequests.find(p => p.id === requestId)?.name || 'Soul' }]);
        }
        setPendingRequests(prev => prev.filter(p => p.id !== requestId));
    };

    const rejectFriend = (requestId) => {
        setPendingRequests(prev => prev.filter(p => p.id !== requestId));
    };

    const sendMessage = useCallback((remoteId, text) => {
        const now = Date.now();
        if (now - lastMsgTime.current < 1000) {
            msgCount.current++;
            if (msgCount.current > 5) {
                setError("Vibration frequency too high. Breathing slow...");
                return;
            }
        } else {
            msgCount.current = 0;
        }
        lastMsgTime.current = now;

        if (!friends.some(f => f.id === remoteId)) {
            setError("Soul sync required. Must be friends to chant.");
            return;
        }

        const conn = connections[remoteId];
        if (conn && conn.open) {
            conn.send({ type: 'message', text, username });
            setAuraEnergy(prev => prev + 10);
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
    }, [connections, myId, username, friends]);

    const startCall = async (remoteId, video = false) => {
        if (!friends.some(f => f.id === remoteId)) return;
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video });
            setLocalStream(stream);
            const call = peer.call(remoteId, stream);
            currentCall.current = call;
            setIsCalling(true);
            call.on('stream', (rs) => setRemoteStream(rs));
            call.on('close', () => endCall());
        } catch (err) { setError("Camera/Mic access denied."); }
    };

    const endCall = () => {
        if (currentCall.current) currentCall.current.close();
        if (localStream) localStream.getTracks().forEach(t => t.stop());
        setLocalStream(null);
        setRemoteStream(null);
        setIsCalling(false);
        setIncomingCall(null);
    };

    return {
        myId, connections, messages, friends, pendingRequests, auraEnergy,
        sendFriendRequest, acceptFriend, rejectFriend, sendMessage,
        startCall, answerCall: async () => {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
            setLocalStream(stream);
            incomingCall.answer(stream);
            setIsCalling(true);
            incomingCall.on('stream', (rs) => setRemoteStream(rs));
        },
        endCall, isCalling, incomingCall, localStream, remoteStream,
        setMessages, clearMessages: () => { setMessages([]); localStorage.removeItem('auracord_messages'); },
        error, setError
    };
};
