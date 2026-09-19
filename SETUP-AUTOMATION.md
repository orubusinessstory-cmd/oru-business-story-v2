# Automatic Daily Business Content System — Setup Guide

ഇത് ഒരു one-time setup ആണ്. താഴെ പറയുന്ന ക്രമത്തിൽ തന്നെ ചെയ്യുക.

## എന്തൊക്കെ പുതിയതായി ചേർത്തു

```
app/api/cron/generate-article/route.ts   ← Vercel Cron ദിവസവും call ചെയ്യുന്ന endpoint
app/admin/automation/page.tsx            ← Admin Panel-ലെ പുതിയ "Automation" page
app/admin/automation/automation.css
lib/automation/categories.ts             ← 12 categories, rotation order
lib/automation/anthropicClient.ts        ← Claude API call + Malayalam prompt
lib/automation/unsplash.ts               ← fetches a matching real photo from Unsplash
lib/automation/runDailyGeneration.ts     ← ഒരു run-ന്റെ പൂർണ്ണ logic (generate → dedupe → insert → log)
lib/supabase/admin.ts                    ← service-role Supabase client (server-only)
lib/slugify.ts                           ← (app/admin/actions.ts-ൽ നിന്ന് extract ചെയ്തത്, reuse ചെയ്യാൻ)
supabase/automation-setup.sql            ← DB migration
vercel.json                              ← Cron schedule
```

മാറ്റം വന്നത് (existing files, additive only — ഒന്നും delete/break ചെയ്തിട്ടില്ല):

```
app/admin/actions.ts        ← slugify import + 3 പുതിയ automation actions ചേർത്തു
app/admin/AdminSidebarNav.tsx ← "Automation" nav link ചേർത്തു
.env.example                 ← 4 പുതിയ env var names ചേർത്തു
lib/data.ts                  ← imageCreditName/imageCreditUrl fields ചേർത്തു (Idea type-ൽ)
app/(site)/idea/[slug]/page.tsx ← image ഉള്ളപ്പോൾ ചെറിയ "Photo by ... on Unsplash" caption കാണിക്കും
```

## Step 1 — Supabase-ൽ SQL run ചെയ്യുക

Supabase Dashboard → SQL Editor → New query → `supabase/automation-setup.sql`-ലെ content മുഴുവൻ paste ചെയ്ത് Run ചെയ്യുക.

ഇത് ചെയ്യുന്നത്:
- `ideas` table-ൽ `is_ai_generated` എന്ന column ചേർക്കും (default false — existing rows touch ചെയ്യില്ല)
- `automation_settings`, `automation_history` എന്നീ 2 പുതിയ tables ഉണ്ടാക്കും
- 12 categories `categories` table-ൽ ചേർക്കും (ഏതെങ്കിലും slug already ഉണ്ടെങ്കിൽ skip ചെയ്യും, duplicate ഉണ്ടാകില്ല)

**ശ്രദ്ധിക്കുക:** നിങ്ങളുടെ നിലവിലുള്ള categories-ൽ ചിലത് (e.g. "Agriculture", "Manufacturing") ഈ 12-ൽ ചിലതുമായി പേരിൽ സാമ്യം ഉള്ളതാകാം. Slug exact ആയി match ആയാൽ മാത്രമേ skip ആകൂ. SQL run ചെയ്ത ശേഷം Admin → Categories-ൽ പോയി duplicate-ആയി തോന്നുന്നവ ഉണ്ടെങ്കിൽ ഒന്നുകിൽ delete ചെയ്യുകയോ, പേര് ഒന്നാക്കി edit ചെയ്യുകയോ ചെയ്യാം.

## Step 2 — API keys എടുക്കുക

**Anthropic (article text):** https://console.anthropic.com → API Keys → Create Key.

**Unsplash (article photo, optional but recommended):** https://unsplash.com/oauth/applications → "New Application" → free "Demo" app (per-hour limit 50 requests, ഈ use-case-ന് ധാരാളം) → **Access Key** copy ചെയ്യുക. ഇത് skip ചെയ്താലും system work ചെയ്യും — photo-ക്ക് പകരം icon (💼) കാണിക്കും.

## Step 3 — Environment variables ചേർക്കുക

**Vercel** → Project → Settings → Environment Variables → ഇവ ചേർക്കുക (Production + Preview രണ്ടിലും):

| Name | Value |
|---|---|
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` key (secret, anon key അല്ല) |
| `ANTHROPIC_API_KEY` | Step 2-ൽ എടുത്ത Anthropic key |
| `UNSPLASH_ACCESS_KEY` | Step 2-ൽ എടുത്ത Unsplash key (optional) |
| `CRON_SECRET` | ഏതെങ്കിലും random നീണ്ട string സ്വയം ഉണ്ടാക്കുക (e.g. terminal-ൽ `openssl rand -hex 32`) |

**പ്രധാനം:** ഈ മൂന്നിനും `NEXT_PUBLIC_` prefix കൊടുക്കരുത് — അങ്ങനെ ചെയ്താൽ browser-ലേക്ക് expose ആകും. Code-ൽ ഇവ server-side മാത്രമേ read ചെയ്യുന്നുള്ളൂ.

Local development-ന് വേണമെങ്കിൽ `.env.local`-ലും ഇതേ 3 വേരിയബിളുകൾ ചേർക്കുക.

## Step 4 — Commit & Deploy

എല്ലാ പുതിയ/മാറ്റം വന്ന files-ഉം git repo-യിലേക്ക് ചേർത്ത് push ചെയ്യുക. `vercel.json` root-ൽ ആയിരിക്കണം (package.json ഉള്ള അതേ folder-ൽ). Vercel automatic ആയി deploy ചെയ്യുകയും, Project → Settings → Cron Jobs tab-ൽ പുതിയ cron job കാണിക്കുകയും ചെയ്യും.

## Step 5 — Test ചെയ്യുക

1. `/admin/automation` തുറക്കുക (sidebar-ൽ പുതിയ "Automation" link ഉണ്ടാകും).
2. Automation **OFF** ആയി തന്നെ ഇരിക്കട്ടെ.
3. **"Generate Now (test)"** button click ചെയ്യുക. ~10-20 സെക്കന്റിനുള്ളിൽ ഒരു പുതിയ article generate ആയി "Last Generated Article"-ൽ കാണിക്കും, "Automation History"-ൽ ഒരു row വരും.
4. Admin → Businesses-ൽ പോയി ആ article open ചെയ്ത് content ശരിയാണോ, category/investment/profit fields ശരിയാണോ എന്ന് നോക്കുക.
5. ശരിയാണെങ്കിൽ, "Turn ON" click ചെയ്യുക. ഇനി ദിവസവും ഒരിക്കൽ automatic ആയി publish ആകും, നിങ്ങൾ "Turn OFF" ചെയ്യുന്നത് വരെ.

## Publishing Time-നെ കുറിച്ച് ഒരു സത്യസന്ധമായ കുറിപ്പ്

Vercel-ന്റെ **Hobby (free) plan**-ൽ ഒരു cron job-ന് ദിവസം ഒരു തവണ മാത്രമേ run ചെയ്യാൻ പറ്റൂ, exact minute-ന് guarantee ഇല്ല (±1 hour വരെ വ്യത്യാസം വരാം — ഇത് Vercel-ന്റെ തന്നെ limitation ആണ്). അതുകൊണ്ട്:

- Admin panel-ലെ "Publishing Time" field ഒരു **record/reference** ആണ് — ഇത് save ചെയ്യുന്നത് കൊണ്ട് മാത്രം actual trigger time മാറില്ല.
- Actual trigger time നിശ്ചയിക്കുന്നത് `vercel.json`-ലെ ഈ line ആണ്:
  ```json
  "schedule": "30 3 * * *"
  ```
  ഇത് UTC 3:30 AM ആണ് = **9:00 AM IST** (ഇപ്പോൾ default ആയി set ചെയ്തിരിക്കുന്നത്). സമയം മാറ്റണമെങ്കിൽ ഈ line edit ചെയ്ത് redeploy ചെയ്യുക. IST-യിൽ നിന്ന് UTC കണക്കാക്കാൻ: `UTC = IST - 5:30`.
- Vercel **Pro plan** ആണെങ്കിൽ per-minute cron schedules possible ആണ്, കൂടുതൽ accurate ആയി control ചെയ്യാം.
- എത്ര തവണ trigger ആയാലും (Vercel retry ചെയ്താലും, ആരെങ്കിലും manually route hit ചെയ്താലും), system ഒരു ദിവസം ഒരു article-ൽ കൂടുതൽ publish ചെയ്യില്ല — ഇത് code-ൽ തന്നെ (IST date check) ഉറപ്പാക്കിയിട്ടുണ്ട്.

## Security

- `ANTHROPIC_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` എന്നിവ ഒരിക്കലും browser-ലേക്ക് അയക്കുന്നില്ല — cron route (`app/api/cron/...`) ഉം `lib/automation/*` ഉം server-only code ആണ്.
- Cron endpoint `CRON_SECRET` വഴി protect ചെയ്തിട്ടുണ്ട് — Vercel-ന്റെ സ്വന്തം cron invocations-ന് മാത്രമേ ഇത് work ചെയ്യൂ, പുറത്ത് നിന്ന് ആർക്കും ഈ URL hit ചെയ്ത് article generate ചെയ്യിക്കാൻ പറ്റില്ല.
- Unsplash-ന്റെ API Guidelines അനുസരിച്ച് ഓരോ photo-യ്ക്കും ഫോട്ടോഗ്രാഫറുടെ പേര് ചെറുതായി credit ചെയ്യണം — idea page-ൽ image-ന് താഴെ ചെറിയ "Photo by ... on Unsplash" caption ഇതിനായി automatic ആയി കാണിക്കും (manual ആയി ചേർത്ത ideas-നെ ഇത് ബാധിക്കില്ല, image_credit_name null ആയതിനാൽ caption കാണിക്കില്ല).
