# Design a Chat App (Student-Level Walkthrough)

A complete interview-style answer for a real-time chat application using WebSockets. Practice with a whiteboard.

---

## Step 1: Clarify Requirements (2–3 min)

| Question | Assumed answer |
|----------|----------------|
| 1-on-1 or group chat? | Both (start with 1-on-1, mention group extension) |
| Real-time delivery? | Yes, messages appear within 1 second |
| Message history? | Yes, load last 50 messages on open, paginate older |
| Online presence? | Show online/offline status |
| Read receipts? | Out of scope for MVP |
| Scale? | 50K DAU, 5K concurrent WebSocket connections |

**Functional requirements:**
1. User registration and login
2. Start 1-on-1 conversation with another user
3. Send and receive messages in real time
4. View message history when opening a chat
5. See if the other user is online

**Non-functional requirements:**
- Messages must be persisted (reload shouldn't lose history)
- Messages delivered in order within a conversation
- System handles reconnect gracefully

---

## Step 2: Rough Estimates (2 min)

| Metric | Estimate |
|--------|----------|
| 50K DAU | ~5K concurrent at peak (10% online) |
| Messages per day | 50K users × 30 messages = 1.5M messages/day |
| Avg message size | ~200 bytes text |
| Storage per year | 1.5M × 200B × 365 ≈ 110 GB (very manageable) |
| WebSocket connections | 5K concurrent |

---

## Step 3: High-Level Architecture

```
┌──────────┐  WebSocket + REST   ┌─────────────────┐
│  React   │ ◄──────────────────►│  Chat Server    │
│  Client  │                     │  (Node.js +     │
└──────────┘                     │   Socket.io)    │
                                 └────────┬────────┘
                                          │
                         ┌────────────────┼────────────────┐
                         ▼                ▼                ▼
                   ┌──────────┐    ┌──────────┐    ┌──────────┐
                   │  Redis   │    │ Postgres │    │  Redis   │
                   │ (pub/sub)│    │   (DB)   │    │(presence)│
                   └──────────┘    └──────────┘    └──────────┘
```

**Why two Redis uses?**
- **Pub/Sub:** Broadcast messages across multiple chat server instances
- **Presence:** Store online user IDs with TTL heartbeat

**Why REST + WebSocket?**
- **REST:** Login, fetch conversation list, paginate message history
- **WebSocket:** Real-time send/receive, typing indicators, presence

---

## Step 4: Database Schema

```sql
users (
  id            UUID PK,
  username      VARCHAR(50) UNIQUE,
  email         VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  created_at    TIMESTAMPTZ
)

conversations (
  id            UUID PK,
  created_at    TIMESTAMPTZ
)

conversation_members (
  conversation_id UUID FK → conversations,
  user_id         UUID FK → users,
  joined_at       TIMESTAMPTZ,
  PRIMARY KEY (conversation_id, user_id)
)

messages (
  id              UUID PK,
  conversation_id UUID FK → conversations,
  sender_id       UUID FK → users,
  body            TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
)
-- INDEX: (conversation_id, created_at DESC) for history pagination
```

**Finding or creating a 1-on-1 conversation:**
```sql
-- Check if conversation exists between two users
SELECT c.id FROM conversations c
JOIN conversation_members cm1 ON c.id = cm1.conversation_id AND cm1.user_id = $userA
JOIN conversation_members cm2 ON c.id = cm2.conversation_id AND cm2.user_id = $userB;
-- If none, create conversation + two member rows
```

---

## Step 5: API Endpoints (REST)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/conversations` | List user's conversations (with last message preview) |
| POST | `/api/v1/conversations` | Create/get 1-on-1 conversation `{ userId }` |
| GET | `/api/v1/conversations/:id/messages?cursor=&limit=50` | Message history |

---

## Step 6: WebSocket Protocol

### Connection Flow

```
1. Client logs in via REST → gets session cookie / JWT
2. Client opens WebSocket: wss://api.example.com/ws?token=...
3. Server validates token on handshake
4. Server marks user online in Redis: SET online:userId 1 EX 60
5. Client sends heartbeat every 30s → refreshes TTL
6. On disconnect → remove from online set, broadcast offline
```

### Message Events

```javascript
// Client → Server: send message
{
  "type": "message:send",
  "payload": {
    "conversationId": "uuid",
    "body": "Hey, how are you?"
  }
}

// Server → Client: new message (to all conversation members)
{
  "type": "message:new",
  "payload": {
    "id": "uuid",
    "conversationId": "uuid",
    "senderId": "uuid",
    "body": "Hey, how are you?",
    "createdAt": "2025-06-30T10:00:00Z"
  }
}

// Server → Client: user online/offline
{
  "type": "presence:update",
  "payload": { "userId": "uuid", "status": "online" }
}
```

### Server-Side Message Handler

```
1. Receive message:send from client
2. Validate: is sender a member of this conversation?
3. Insert message into Postgres
4. Publish to Redis channel: conversation:{conversationId}
5. All server instances subscribed to that channel → push to connected clients
6. Send ack to sender with message id (confirms delivery to server)
```

---

## Step 7: Deep Dive — Scaling WebSockets

### Problem: Multiple Server Instances

User A connects to Server-1. User B connects to Server-2. How does A's message reach B?

### Solution: Redis Pub/Sub

```
User A → Server-1 → INSERT message → PUBLISH conversation:123
                                              │
                         Server-1 ◄───────────┤
                         Server-2 ◄───────────┘
                              │
                         User B receives message
```

```javascript
// On message send (Server-1)
await db.insertMessage({ conversationId, senderId, body });
await redis.publish(`conversation:${conversationId}`, JSON.stringify(message));

// On server startup (all instances)
redis.subscribe(`conversation:*`, (channel, data) => {
  const message = JSON.parse(data);
  const members = getConnectedSocketsForConversation(message.conversationId);
  members.forEach(socket => socket.emit('message:new', message));
});
```

### Load Balancer Consideration

- WebSocket connections are long-lived
- Use **sticky sessions** (IP hash) so reconnect goes to same server — OR —
- Use Redis pub/sub so any server can handle any connection (preferred)

### Reconnection Handling

```javascript
// Client-side (Socket.io handles most of this)
const socket = io('wss://api.example.com', {
  auth: { token },
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionAttempts: 10,
});

socket.on('connect', () => {
  // Rejoin conversation rooms
  activeConversations.forEach(id => socket.emit('conversation:join', { id }));
  // Fetch messages missed while offline via REST
  syncMissedMessages();
});
```

---

## Step 8: Presence System

```javascript
// On connect
await redis.setex(`online:${userId}`, 60, '1');
broadcastToFriends(userId, { type: 'presence:update', status: 'online' });

// Heartbeat every 30 seconds
setInterval(() => redis.setex(`online:${userId}`, 60, '1'), 30_000);

// On disconnect
await redis.del(`online:${userId}`);
broadcastToFriends(userId, { type: 'presence:update', status: 'offline' });

// Check if user is online
const isOnline = await redis.exists(`online:${userId}`);
```

**Tradeoff:** 60-second TTL means "offline" detection has up to 60s delay. Acceptable for student apps.

---

## Step 9: Frontend Architecture

```
features/chat/
├── ChatPage.tsx           # Main layout: sidebar + active chat
├── ConversationList.tsx   # List of conversations
├── MessageList.tsx        # Virtualized message list
├── MessageInput.tsx       # Send box
├── useChatSocket.ts       # WebSocket connection hook
├── useMessages.ts         # React Query for history
└── chatStore.ts           # Zustand: active conversation, typing state
```

**State split:**
- **React Query:** Message history (server state), conversation list
- **Zustand/local state:** Real-time messages not yet in cache, typing indicators
- **WebSocket hook:** Connection management, event routing

**Optimistic UI for sending:**
1. User hits send → immediately show message in UI (gray/pending)
2. Server acks with real ID → update message status
3. On error → show retry button, remove optimistic message

---

## Step 10: Tradeoffs Summary

| Decision | Choice | Why | Alternative |
|----------|--------|-----|-------------|
| Transport | WebSocket | Bidirectional, low latency | SSE (server→client only), long polling (simpler but wasteful) |
| Message store | PostgreSQL | Durable, queryable history | Cassandra at massive scale |
| Multi-server sync | Redis Pub/Sub | Simple, fast fan-out | Dedicated message broker (Kafka — overkill here) |
| Presence | Redis TTL keys | Fast, auto-expires | DB polling (too slow) |
| Ordering | DB timestamp + single writer per conversation | Good enough for 1-on-1 | Vector clocks (distributed systems) |

---

## Step 11: Security

- Authenticate WebSocket handshake (reject unauthenticated connections)
- Verify sender is conversation member before accepting message
- Sanitize message body (prevent XSS if rendered as HTML)
- Rate limit: 30 messages/minute per user
- WSS (WebSocket Secure) in production — always TLS
- Don't log message content in production logs (privacy)

---

## Extending to Group Chat

- `conversations` table already supports N members via `conversation_members`
- Fan-out: publish to `conversation:{id}` — all members on any server receive it
- Group-specific: show member list, admin can add/remove members
- Scale concern: 500-member group → 500 socket pushes per message (batch or lazy load)

---

## Whiteboard Diagram

```
[Client A]───WS───[Server 1]───[Redis Pub/Sub]───[Server 2]───WS───[Client B]
                      │                                              │
                      └────────────[Postgres]────────────────────────┘
```

---

## Common Follow-Up Questions

**Q: What if a user is offline when a message is sent?**
A: Message is persisted in DB. When user reconnects, REST API fetches messages since `lastSeenMessageId`.

**Q: How do you guarantee message order?**
A: `created_at` timestamp from DB (single source of truth). Client sorts by timestamp. For same-millisecond messages, use UUID as tiebreaker.

**Q: End-to-end encryption?**
A: Out of scope for MVP. Would encrypt on client, server stores ciphertext only. Mention as future improvement.

---

**Practice tip:** Draw the WebSocket + Redis pub/sub flow — interviewers love seeing you handle the multi-server case.
