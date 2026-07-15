# Nikah Manzil — Next.js 15 (Frontend + Backend)

Ye project ab **Next.js 15 (App Router)** pe migrate ho chuka hai, aur isi Next.js app ke andar
ek pura **backend bhi ban chuka hai** jo **MongoDB (Mongoose)** use karta hai. Frontend ka UI/design
bilkul same rakha gaya hai — sirf routing framework (React Router → Next.js App Router) badla hai
aur real backend add kiya gaya hai.

## Setup (sirf 3 steps)

1. Dependencies install karein:
   ```bash
   npm install
   ```

2. `.env.example` ko copy karke `.env.local` banayein aur apni MongoDB connection string laga dein:
   ```bash
   cp .env.example .env.local
   ```
   Phir `.env.local` mein `MONGODB_URI` update karein — MongoDB Atlas se milne wali connection
   string ya apni local MongoDB ki string. `JWT_SECRET` mein koi bhi random string rakh dein.

3. Dev server chalayein:
   ```bash
   npm run dev
   ```
   Phir browser mein `http://localhost:3000` khol lein.

Bas! Connection string laga dene ke baad Register/Login/Profile Setup/Payment sab MongoDB ke
saath kaam karenge.

## Backend kya kya karta hai

Sab kuch Next.js ke andar hi hai (`src/app/api/...` route handlers), alag se koi Node/Express
server nahi chalana:

- **Auth**: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/logout`,
  `GET /api/auth/me` — bcrypt se password hash hota hai, JWT ek httpOnly cookie mein store hota hai.
- **Profiles**: `GET /api/profiles` (search/filter), `GET /api/profiles/[id]`,
  `GET|POST /api/profiles/me` (apni profile save/update).
- **Payments**: `GET|POST /api/payments`, `PATCH /api/payments/[id]` (admin approve/reject).
- **Success Stories**: `GET|POST /api/success-stories`, `PATCH|DELETE /api/success-stories/[id]`.
- **Admin**: `GET /api/admin/users`, `PATCH /api/admin/users/[id]`,
  `GET|POST /api/admin/access-requests`, `PATCH /api/admin/access-requests/[id]`,
  `GET /api/admin/stats` (overview counts).
- **Settings**: `GET|POST /api/settings` (website settings key-value store).

MongoDB models `src/models/` mein hain: `User`, `Profile`, `Payment`, `SuccessStory`,
`AccessRequest`, `Setting`.

## Kya wire kiya gaya hai

- **Register / Login / Logout** — asal MongoDB users ke saath kaam karte hain (`AuthContext`).
- **Profile Setup Wizard** — finish karne pe profile `/api/profiles/me` mein save hoti hai.
- **Payment page** — submit karne pe `/api/payments` mein record ban jata hai.

Baaqi dashboard/admin display pages abhi bhi demo data (`src/data/*.js`) dikhate hain jaisे pehle
the — inko bhi asani se in naye API routes se connect kiya ja sakta hai jab chahein.

## Notes

- Next.js 15 App Router use kiya gaya hai (`src/app`).
- Purane React Router code (`Link`, `NavLink`, `useNavigate`, `useLocation`, `useSearchParams`)
  bilkul waisa hi chhoda gaya hai — ek chota compatibility layer (`src/lib/router-compat.jsx`)
  unko Next.js ke equivalents pe map karta hai, taake UI code mein zyada tabdeeli na karni pare.
- Tailwind v3 config waisa hi hai jaisa pehle tha.
- Production build ke liye: `npm run build` phir `npm start`.

## Admin Panel — Full Control (Update)

Admin panel ab **live MongoDB data** ke saath kaam karta hai — pehle ye demo/mock data dikhata tha,
ab har action seedha database update karta hai.

### Admin login (automatic, koi alag script nahi chalana)

Admin account ab **apne aap ban jata hai** — jab bhi app pehli baar database se connect hota hai
(matlab jab aap `npm run dev` ya `npm start` karke koi bhi page/API hit karte hain), agar admin
account exist nahi karta to khud ba khud bana diya jata hai. Alag se koi script chalane ki zaroorat
nahi hai.

Default admin login:

- **Email:** `rishtacenter@gmail.com`
- **Password:** `rishta123`

`/login` pe yehi email/password daal kar login karein — role `admin` hone ki wajah se aap seedha
`/admin` panel mein pahonch jayenge.

Agar aap default email/password change karna chahte hain, `.env.local` mein
`DEFAULT_ADMIN_EMAIL` aur `DEFAULT_ADMIN_PASSWORD` set kar dein (dekhein `.env.example`) — phir
wahi naya email/password use hoga jab account banega. (Agar admin already ban chuka hai purane
email se, to naya email dobara ek nayi admin entry bana dega — purana admin bhi active rahega.)

Agar aap manually kisi existing user ko admin banana chahein, `npm run create-admin -- email
password "Name"` script bhi available hai, lekin default admin ke liye ye zaroori nahi hai.

`/admin/*` ke tamam pages server-side protected hain (`src/app/admin/layout.jsx`) — koi bhi
non-admin user URL type karke bhi in pages ko access nahi kar sakta, use `/login` ya `/dashboard`
pe redirect kar diya jata hai. Same tarah `/dashboard/*` bhi login-required hai.

### Admin kya kya control kar sakta hai

- **User Management** (`/admin/users`) — har user ko Active / Pending / Suspended kar sakta hai.
- **Profiles & Photos** (`/admin/profiles`) — naya page. Har profile ko Activate/Deactivate aur
  Verify/Unverify kar sakte hain, aur "Manage Photos" click karke us member ki har photo individually
  Hide/Show ya permanently Delete kar sakte hain. Admin ki "Hide" hamesha final hoti hai — member
  khud usse unhide nahi kar sakta.
- **Payment Management** (`/admin/payments`) — har payment ka screenshot dekh kar Approve/Reject
  kar sakte hain. Approve karte hi us user ka payment status "paid" aur profile "active" ho jata
  hai automatically.
- **Access Requests** (`/admin/access`) — members jo dusre profile ka contact/hidden photos maangte
  hain unhe Approve/Deny kar sakte hain.
- **Overview** (`/admin`) — total users, active profiles, pending payments, pending access requests
  — sab live count database se.

### Member side (photo control)

`/dashboard/photos` par har member apni photos upload kar sakta hai, aur har photo ko khud
Hide/Unhide ya Delete kar sakta hai. Agar admin ne wo photo already hide kar rakhi ho, member ko
"Hidden by admin" dikhta hai aur wo use unhide nahi kar sakta — sirf admin hi wapas show kar sakta
hai.
