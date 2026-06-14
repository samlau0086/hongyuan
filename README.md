<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/79664f77-73a0-477f-be70-3ff015add44f

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploy to VPS with GitHub Actions

The workflow in `.github/workflows/deploy-vps.yml` builds the app, uploads the release to your VPS, installs production dependencies, and starts or reloads the app with PM2.

### VPS prerequisites

Use a Debian/Ubuntu VPS user that can run `sudo`, or install Node.js 20 and PM2 on the VPS ahead of time:

```bash
npm install -g pm2
```

The GitHub Actions workflow can install Node.js 20 and PM2 automatically when they are missing and the SSH user has `sudo` permission. Make sure your reverse proxy points to the app port, default `3000`.

### GitHub Secrets

Add these secrets in `Settings -> Secrets and variables -> Actions`:

- `VPS_HOST`: VPS IP or domain.
- `VPS_USER`: SSH username.
- `VPS_SSH_KEY`: private SSH key for deployment.
- `VPS_PORT`: SSH port, optional, defaults to `22`.
- `VPS_DEPLOY_PATH`: deploy directory, optional, defaults to `/var/www/hongyuan`.
- `RFQ_ADMIN_PASSWORD`: password for the RFQ admin page.
- `RFQ_ADMIN_USER`: RFQ admin username, optional, defaults to `admin`.

### One-click deploy

Open `Actions -> Deploy to VPS -> Run workflow` in GitHub. A push to `main` also deploys automatically.

## RFQ Submissions

The Contact form submits RFQ data and drawing files to the app backend.

- Public submit endpoint: `/api/rfq`
- Admin page: `/admin/rfq`
- Default admin username: `admin`
- Admin password: set `RFQ_ADMIN_PASSWORD` in GitHub Actions secrets.
- Stored data on VPS: `$VPS_DEPLOY_PATH/shared/rfq`

Uploaded files are downloadable from the admin page after login.
