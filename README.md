# 晨星家長客服 CRM

LINE 家長客服 CRM MVP：把官方 LINE 的家長訊息導入團隊工作台，依「家長 → 負責員工」隔離資料。

## 已完成的第一版

- Next.js App Router + TypeScript + Tailwind CSS 工作台 UI
- `/login` 登入介面、`/inbox` 雙欄收件匣、`/customers`、管理頁路由
- 家長列表、未讀提示、對話訊息、送出訊息的互動式 prototype
- Supabase schema migration：employees、customers、line_accounts、students、conversations、messages、webhook_events、customer_notes、audit_logs
- PostgreSQL RLS：employee 只能讀自己的家長與對話；admin 可讀全部
- LINE webhook raw body signature 驗證、webhookEventId 冪等去重、unknown user 自動建立待分派家長、follow/unfollow 狀態
- `/api/health`、`/api/me`、`/api/customers`
- `.env.example`、seed 說明與 LINE signature unit test

> 目前工作台以可操作的 MVP 介面資料呈現；接上 Supabase Auth 與正式資料後，API 會依 RLS 回傳真實資料。LINE outbound push route 與 admin CRUD 是下一個 implementation slice。

## 本機啟動

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

未填入環境變數時可先瀏覽 UI prototype；若要使用登入、資料庫與 webhook，必須填入所有 server-side credentials。

## 環境變數

只設定名稱，不將 secret commit 到 Git：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`（只可 server-side）
- `LINE_CHANNEL_SECRET`（只可 server-side）
- `LINE_CHANNEL_ACCESS_TOKEN`（只可 server-side）
- `NEXT_PUBLIC_APP_URL`

## Supabase

1. 建立 production 與 development 兩個 Supabase project。
2. 在 SQL Editor 或 Supabase CLI 套用 `supabase/migrations/202610020001_initial.sql`。
3. 先於 Supabase Auth 建立第一位 admin，再以其 auth UUID 插入 `employees`，`role='admin'`、`status='active'`。
4. 不開啟公開 sign-up；員工由 admin invitation flow 建立。
5. 填入 Vercel 的 production / preview environment variables。Preview 不要連 production LINE channel。

## LINE Developer Console

Webhook URL：`https://<你的正式網域>/api/line/webhook`

1. 在 Messaging API channel 設定 Webhook URL。
2. 開啟 Use webhook，執行 Verify。
3. 將 Channel secret 與 Channel access token 放入 Vercel Production Variables。
4. 用真實 LINE 使用者測試 unknown user、分派後訊息與 unfollow。

## Vercel / GitHub

- GitHub `main` 為 production；feature/fix branch 為 Preview。
- 在 Vercel Import Git Repository，選 `pank4s29-oss/client-communication`。
- Framework Preset 選 Next.js，Root Directory 為 repository root。
- 加入上述 Production env vars 後部署；每次修改環境變數都要重新部署。
- Production URL 應填回 `NEXT_PUBLIC_APP_URL`，再把 webhook URL 設回 LINE Console。

## 驗證

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## 已知限制與下一步

- 本版尚未在本工作階段綁定實際 Supabase project、LINE channel、Vercel project，因此尚未宣稱 production E2E 完成。
- 下一個 slice 應完成：Supabase SSR login/logout 與 middleware、admin customer/assignment CRUD、conversation message API + LINE Push API、employee invitation、Playwright E2E/RLS integration tests。
- 不能把 Preview webhook 接到 production LINE channel。
