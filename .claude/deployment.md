# AlignHealthcare.ai Deployment Information

## Deployment Platform

**Google Cloud Run** (NOT Vercel)

- **Service Name:** `alignhealthcare`
- **Region:** `us-central1`
- **Project ID:** Set via `$PROJECT_ID` in Cloud Build
- **Domain:** https://alignhealthcare.ai
- **API Domain:** https://api.alignhealthcare.ai

## Deployment Method

### Automated via Cloud Build

Deployment is triggered automatically via Cloud Build when pushing to the `main` branch.

**Configuration file:** `cloudbuild.yaml`

**Build steps:**
1. Build Docker image with Next.js app
2. Push to Google Container Registry (GCR)
3. Deploy to Cloud Run

### Container Specifications

- **Memory:** 2Gi
- **CPU:** 2
- **Min instances:** 0 (scales to zero)
- **Max instances:** 10
- **Timeout:** 300 seconds
- **Port:** 8080

## Environment Variables

Environment variables are set in the Cloud Run deployment via `--set-env-vars` flag in `cloudbuild.yaml`.

**Currently configured:**
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_API_URL`
- `NODE_ENV`
- `MONGODB_URI` (placeholder)
- `MONGODB_DATABASE` (placeholder)

**Recently added (need to add to Cloud Run):**
- `HUBSPOT_ACCESS_TOKEN` - HubSpot Private App token for waitlist integration
- `HUBSPOT_WAITLIST_LIST_ID` - HubSpot segment ID for waitlist contacts

## How to Deploy

### Automatic Deployment (Recommended)

```bash
git add .
git commit -m "feat: your changes"
git push origin main
```

Cloud Build automatically:
1. Detects push to main branch
2. Triggers build from `cloudbuild.yaml`
3. Builds Docker image
4. Deploys to Cloud Run

### Manual Deployment via gcloud CLI

```bash
# Build and deploy manually
gcloud builds submit --config cloudbuild.yaml

# Or deploy directly (if image already built)
gcloud run deploy alignhealthcare \
  --image gcr.io/$PROJECT_ID/alignhealthcare:latest \
  --region us-central1 \
  --platform managed \
  --allow-unauthenticated
```

## Adding New Environment Variables

### Option 1: Update cloudbuild.yaml (Recommended)

Add to the `--set-env-vars` argument in `cloudbuild.yaml`:

```yaml
- --set-env-vars
- 'EXISTING_VARS...,NEW_VAR=value'
```

Then push to trigger rebuild.

### Option 2: Update via gcloud CLI

```bash
gcloud run services update alignhealthcare \
  --region us-central1 \
  --set-env-vars "NEW_VAR=value"
```

### Option 3: Update via Google Cloud Console

1. Go to Cloud Run → Services → alignhealthcare
2. Click "Edit & Deploy New Revision"
3. Go to "Variables & Secrets" tab
4. Add new environment variables
5. Click "Deploy"

## Current Deployment Status

**Last deployed:** Check Cloud Run console or run:
```bash
gcloud run services describe alignhealthcare \
  --region us-central1 \
  --format="value(status.url,status.latestReadyRevisionName)"
```

## Dockerfile

Multi-stage build process:
1. **deps** - Install dependencies
2. **builder** - Build Next.js app
3. **runner** - Production image (minimal, runs as non-root user)

## Monitoring & Logs

View logs:
```bash
gcloud run services logs read alignhealthcare --region us-central1
```

Or in Google Cloud Console:
- Cloud Run → Services → alignhealthcare → Logs

## Cost Optimization

- Scales to zero when not in use (no cost)
- Only charged for actual usage
- 2Gi memory, 2 CPU optimal for Next.js SSR

## HubSpot Environment Variables

**IMPORTANT:** HubSpot credentials are NOT stored in `cloudbuild.yaml` for security.

They must be set via `gcloud` command after deployment:

```bash
gcloud run services update alignhealthcare \
  --region us-central1 \
  --set-env-vars "HUBSPOT_ACCESS_TOKEN=pat-na1-...,HUBSPOT_WAITLIST_LIST_ID=121"
```

**Why?** GitHub blocks commits with API tokens. Environment variables must be set separately via CLI or Secret Manager.

### Current HubSpot Configuration

- **Access Token:** Set via gcloud (not in git)
- **Waitlist List ID:** 121 (can be in git, not a secret)
