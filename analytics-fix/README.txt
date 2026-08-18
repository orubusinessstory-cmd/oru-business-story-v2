HOW TO ADD VISITOR ANALYTICS
=============================

STEP 1 — Create the table in Supabase
--------------------------------------
Open Supabase → SQL Editor → New query.
Paste and run the contents of: sql/create_page_views.sql

STEP 2 — Add the view tracker to your site
--------------------------------------------
Copy PageViewTracker.tsx into: components/PageViewTracker.tsx

Then open your root layout file (usually app/layout.tsx) and:
1. Import it at the top:
     import PageViewTracker from "@/components/PageViewTracker";
2. Add <PageViewTracker /> once, inside the <body> tag, e.g.:

     <body>
       <PageViewTracker />
       {children}
     </body>

This logs one row per page visit (admin pages are skipped automatically).

STEP 3 — Add the analytics query helpers
-------------------------------------------
Copy analytics.ts into: lib/analytics.ts

STEP 4 — Add the Analytics panel to your admin dashboard
------------------------------------------------------------
Copy AnalyticsPanel.tsx into: components/admin/AnalyticsPanel.tsx

Open your admin dashboard page (wherever the stat cards / welcome
banner currently live) and:
1. Import it:
     import AnalyticsPanel from "@/components/admin/AnalyticsPanel";
2. Render it wherever you want the analytics section to appear:
     <AnalyticsPanel />

STEP 5 — Add the CSS
-----------------------
Open analytics.css and paste its contents at the END of your
global CSS file (the same one used for admin dashboard styles).

STEP 6 — Deploy
-----------------
git add .
git commit -m "Add visitor analytics with date range filters"
git push

WHAT YOU GET
-------------
- A "Total Visits" number for the selected period (every visit
  counted, repeats included)
- Week / Month / Year quick filters, plus a Custom date range picker
- A simple daily bar chart for the selected period
- A "By Page" table showing which pages got the most views

NOTES
------
- Views are logged from the visitor's browser, so ad blockers /
  privacy extensions may block a small percentage of real visits —
  this is normal for any lightweight analytics setup.
- The table can grow large over time; if you ever want to keep it
  lean, you can periodically delete rows older than e.g. 1 year.
