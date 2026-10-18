NJR MOVIES PRO — SUPABASE ADMIN PANEL

Files:
- index.html: public movie website
- admin.html: owner login and movie management panel
- admin.js: admin login, upload, edit and delete logic
- app.js / styles.css: website UI
- config.js: TMDB + Supabase public configuration

IMPORTANT SETUP BEFORE DEPLOYING
1) Supabase Authentication user must match the configured NJR_ADMIN_UID in config.js.
2) Keep the Supabase publishable key only. Never add a secret/service_role key to frontend files.
3) The SQL table and admin-only movie policies must already exist.
4) Storage buckets expected: movie-posters and movie-videos.
5) For posters to display, set movie-posters bucket to Public.
6) For uploaded videos to play on the public site, set movie-videos bucket to Public. This makes files publicly readable by URL; only upload videos you own or have distribution permission for. Admin-only insert/update/delete Storage policies should remain in place.
7) The admin panel limits poster files to 5 MB and video files to 50 MB. Supabase plan upload/bandwidth limits still apply. For large files or many viewers, use a dedicated video streaming service.
8) Deploy the contents of the njr-movies-pro folder to Netlify. Open /admin.html to log in.
9) Public custom movies appear under NJR Library on the home page. External links are opened with Watch Now.

SECURITY NOTES
- Browser-visible publishable key is expected. Security relies on Supabase RLS/Storage policies.
- Only the configured User ID can manage movie rows and upload/delete files under the policies already created.
- Never share account passwords, database passwords, or any secret/service_role key.
- Upload only content you own or are licensed to distribute.


LATEST UPDATE (October 2026)
- Added attractive Admin Login and Request Movie quick-access buttons directly under the scrolling headline.
- Added a Bengali “যেকোনো মুভির জন্য রিকুয়েস্ট করুন” section with the owner Facebook profile button.
- Admin-posted movies continue to appear in the NJR Library section on the homepage.
- To publish: upload the contents of this ZIP to your existing Netlify site, replacing the old files. Keep config.js in the same folder as index.html and admin.html.
