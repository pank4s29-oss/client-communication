# LINE 家長客服 CRM — MVP 實作報告

日期：2026-10-02

## 已完成

- Next.js App Router + TypeScript + Tailwind CSS 專案骨架
- `/login`、`/inbox`、`/customers`、`/customers/:id`、`/admin/unassigned`、`/admin/customers`、`/admin/employees` 路由
- 雙欄收件匣 UI：家長列表、未讀提示、對話訊息、送出互動、手機版列表優先
- Supabase migration：employees、customers、line_accounts、students、customer_students、conversations、messages、webhook_events、customer_notes、audit_logs
- exposed tables 啟用 RLS；employee scope 以 `assigned_employee_id` 與 server-side function 控制
- LINE raw body HMAC-SHA256 signature 驗證
- webhookEventId duplicate detection
- unknown LINE user 建立 unassigned customer / account / conversation / inbound message
- follow / unfollow 更新 `is_blocked`，不刪除歷史資料
- `/api/health`、`/api/me`、`/api/customers`
- `/api/conversations/:id/messages`：權限檢查、pending → LINE Push → sent/failed state
- `.env.example`、README、seed 說明、routes manifest
- LINE signature unit tests
- GitHub main branch push
- Vercel GitHub project link 與 production alias

## 驗證結果

- `pnpm lint`：通過
- `pnpm typecheck`：通過
- `pnpm test`：通過，3 tests
- `pnpm build`：通過
- local `/api/health`：`200 {"ok":true,"service":"line-parent-crm"}`
- Vercel `/api/health`：通過
- Vercel `/login`：HTTP 200

## 部署結果

- GitHub：`pank4s29-oss/client-communication`
- Branch：`main`
- Vercel project：`line-parent-crm`
- Production alias：`https://line-parent-crm.vercel.app`
- Webhook endpoint：`https://line-parent-crm.vercel.app/api/line/webhook`

## 尚未完成／需外部設定

1. 尚未填入正式 Supabase URL、publishable key、service role key。
2. 尚未建立 production / development Supabase project 並執行 migration。
3. 尚未在 Supabase Auth 建立第一位 admin 及其 `employees` profile。
4. 尚未填入 LINE Channel Secret / Access Token，故尚未做真實 LINE 訊息 E2E。
5. 前端工作台目前用 prototype data 呈現；接上 session 後需把 UI query 改接 API。
6. Admin customer CRUD、assignment dialog、employee invitation/status UI 尚為下一個 slice。
7. RLS integration tests、Playwright E2E、failed message retry UI 尚未加入。

## 風險與注意

- 不可把 `SUPABASE_SERVICE_ROLE_KEY`、LINE secrets 放進 GitHub 或 `NEXT_PUBLIC_*`。
- Preview 環境不可連正式 LINE channel；建議建立獨立 dev Supabase 與 LINE channel。
- LINE webhook 驗證必須保留 raw request body；不要先 parse 再驗證。
- Vercel 環境變數更新後必須重新部署。
