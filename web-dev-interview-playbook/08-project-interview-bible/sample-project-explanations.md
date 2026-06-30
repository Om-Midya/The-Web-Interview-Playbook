# Sample Project Explanations

Three complete examples showing what a strong project explanation sounds like at 2-minute, 5-minute, and key deep-dive moments. Use these as templates — not scripts to copy.

---

## Sample 1: Todo App (TaskFlow)

*A MERN todo app with categories, due dates, and user auth. Common student project — explained well.*

### 2-Minute Pitch

> "I built **TaskFlow** — a task management app for college students who juggle multiple courses and deadlines.
>
> The problem was students use notes apps or paper for tasks, but there's no way to organize by course or set reminders. TaskFlow lets you create categorized task lists, set due dates, and mark tasks complete with a clean drag-and-drop interface.
>
> I used React with React Query on the frontend, Node.js with Express on the backend, and PostgreSQL with Prisma ORM. I built the entire stack myself — API, database schema, and all UI components.
>
> The hardest part was implementing drag-and-drop reordering that persisted to the database. I used `@dnd-kit` on the frontend and created a `PATCH /tasks/reorder` endpoint that updates positions in a single transaction.
>
> It's deployed at taskflow.vercel.app with the API on Railway. My study group of 8 people used it during finals week. Next, I'd add email reminders for due dates using a cron job and SendGrid."

### 5-Minute Architecture Deep Dive

**Problem (30s):** Students need organized task management per course with due dates.

**Architecture (60s):**
- React SPA on Vercel → Express API on Railway → PostgreSQL
- JWT auth, Prisma ORM, Tailwind CSS
- Three main entities: Users, Categories (courses), Tasks

**Deep dive — Drag and drop reorder (90s):**
1. User drags task from position 2 to position 4
2. `@dnd-kit` fires `onDragEnd` with old and new index
3. Frontend optimistically reorders local array
4. `PATCH /api/v1/tasks/reorder` sends `{ taskId, newPosition, categoryId }`
5. Backend runs transaction: shift positions between old and new index, set task's new position
6. Returns updated task list; React Query invalidates cache
7. On error, rollback optimistic update

**Tradeoffs (60s):**
- Chose position integers over linked list — simpler queries but reorder requires updating multiple rows. Fine for < 100 tasks per category.
- React Query over Redux — tasks are server state, not complex client state.
- Would add: WebSocket for real-time sync if multiple users shared a category.

### Key Interview Moments

| Question | Answer |
|----------|--------|
| Hardest bug? | "Reorder API had race condition with concurrent drags — fixed with DB transaction and optimistic rollback" |
| Schema? | "users → categories (1:N) → tasks (1:N). Index on tasks(category_id, position)" |
| Scale? | "Fine for thousands of users. Would add Redis cache for dashboard summary counts" |

---

## Sample 2: E-Commerce App (ShopEasy)

*A fullstack e-commerce app with product catalog, cart, checkout, and admin panel.*

### 2-Minute Pitch

> "I built **ShopEasy** — an online store for a local bookstore that wanted to sell online during COVID.
>
> The problem was the bookstore had no web presence and was losing customers to Amazon. ShopEasy gives them a product catalog, shopping cart, and checkout flow — plus an admin panel to manage inventory.
>
> I used Next.js for the frontend (SSR for SEO on product pages), Node.js with Express for the API, PostgreSQL for data, and Stripe for payments. I personally built the entire checkout flow, admin panel, and deployment pipeline.
>
> The hardest part was handling concurrent orders for limited-stock items. Two users could buy the last item simultaneously. I solved it with a database transaction that checks inventory count before decrementing — if stock hits zero, the second order gets a 409 Conflict.
>
> It processed 50+ real orders during a campus book sale. Next, I'd add order confirmation emails and server-side product search."

### 5-Minute Architecture Deep Dive

**Problem (30s):** Local bookstore needs online sales with inventory management.

**Architecture (60s):**
- Next.js on Vercel (SSR product pages for Google indexing)
- Express API on Railway
- PostgreSQL: users, products, orders, order_items, cart_items
- Stripe for payments, Cloudinary for product images
- Admin panel (role-based access)

**Deep dive — Checkout flow (90s):**
1. User clicks Checkout → frontend calls `POST /api/v1/orders` with cart items
2. API starts database transaction
3. For each cart item: `SELECT stock FROM products WHERE id = ? FOR UPDATE` (row lock)
4. If any item insufficient stock → rollback, return 409
5. Create order + order_items, decrement stock
6. Create Stripe PaymentIntent, return `clientSecret`
7. Frontend shows Stripe Elements form
8. User pays → Stripe webhook `payment_intent.succeeded`
9. Webhook handler marks order as "paid" (idempotent — checks if already paid)
10. Clear user's cart

**Tradeoffs (60s):**
- SSR for product pages (SEO) but CSR for cart/checkout (no SEO needed, faster interactions)
- Stripe over custom payment — PCI compliance is not something I want to handle
- Stock locking with `FOR UPDATE` — simple and correct for low concurrency; at scale would use inventory reservation queue

### Key Interview Moments

| Question | Answer |
|----------|--------|
| Security? | "Stripe handles card data — my server never touches PAN. Webhook signature verified. Admin routes check role server-side" |
| Inventory race? | "Row-level lock in transaction. Learned about this after a manual test with two browser tabs" |
| Admin panel? | "Separate route group with `authorize('admin')` middleware. CRUD for products with image upload to Cloudinary" |

---

## Sample 3: Chat App (CampusChat)

*Real-time chat app with 1-on-1 and group messaging, built for a college campus.*

### 2-Minute Pitch

> "I built **CampusChat** — a real-time messaging app for students in the same university to find and chat with classmates by course.
>
> The problem was students use WhatsApp groups that get messy, or they don't know who's in their section. CampusChat lets you join course-based chat rooms and DM classmates directly.
>
> I used React on the frontend, Node.js with Express and Socket.io for real-time messaging, PostgreSQL for message persistence, and Redis for online presence. I built the WebSocket layer, message persistence, and the entire React chat UI.
>
> The hardest part was making messages persist across page refreshes while still delivering in real time. I solved it with a dual approach: WebSocket for live delivery, REST API to fetch message history on room open, and a sync-on-reconnect that fetches messages since the last seen timestamp.
>
> 30+ classmates used it during a group project period. Next, I'd add push notifications and message search."

### 5-Minute Architecture Deep Dive

**Problem (30s):** Students need course-based chat with DMs, without the noise of WhatsApp.

**Architecture (60s):**
- React SPA on Vercel
- Express + Socket.io on Railway
- PostgreSQL: users, conversations, conversation_members, messages
- Redis: online presence (TTL keys), pub/sub for multi-server message fan-out
- REST for history, WebSocket for real-time

**Deep dive — Message send flow (90s):**
1. User types message, hits Enter
2. Frontend emits `message:send` via Socket.io with `{ conversationId, body }`
3. Server validates: is user a member of this conversation?
4. Insert message into `messages` table (Postgres)
5. Publish to Redis channel `conversation:{id}`
6. All server instances subscribed → push `message:new` to connected clients in that room
7. Sender gets ack with message ID and timestamp
8. Frontend adds message to local state (already shown optimistically in gray)
9. On ack, message turns solid — confirmed by server
10. If recipient is offline, message waits in DB — fetched on next room open

**Tradeoffs (60s):**
- Socket.io over raw WebSocket — auto-reconnect and polling fallback worth the dependency
- Messages in Postgres, not Redis — durability matters more than microsecond latency
- Presence via Redis TTL (60s) — simple but up to 60s delay detecting offline. Good enough for campus app
- Would add: Redis pub/sub is ready for horizontal scaling if user base grows

### Key Interview Moments

| Question | Answer |
|----------|--------|
| WebSocket scaling? | "Redis pub/sub broadcasts across server instances. LB sticky sessions as backup" |
| Message ordering? | "Sorted by `created_at` from DB. UUID tiebreaker for same-millisecond messages" |
| Offline messages? | "Persisted in Postgres. On reconnect, REST fetch with `?since=lastMessageTimestamp`" |

---

## How to Use These Samples

1. **Read all three** — notice the structure is identical even though projects differ
2. **Pick the closest to your project** — adapt the deep-dive section
3. **Write your version** using [how-to-explain-your-project.md](./how-to-explain-your-project.md) templates
4. **Practice out loud** — these read in ~2 minutes each when spoken naturally

---

**Next:** [mock-project-interview.md](./mock-project-interview.md)
