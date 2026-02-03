# Cloud Run Deployment Guide for alignhealthcare.ai

## Prerequisites

1. Google Cloud CLI installed: `brew install google-cloud-sdk`
2. Authenticated with Google Cloud: `gcloud auth login`
3. Set your project ID:
   ```bash
   gcloud config set project YOUR_PROJECT_ID
   ```

## Step 1: Build and Deploy

Deploy to Cloud Run using Cloud Build:

```bash
# Make sure you're in the project directory
cd /Users/Owner/opencitylabs/alignhealthcare

# Submit the build (this will build, push, and deploy)
gcloud builds submit --config cloudbuild.yaml
```

This command will:
- Build the Docker image
- Push it to Google Container Registry
- Deploy to Cloud Run service named "alignhealthcare"
- Service will be available at a `.run.app` URL

## Step 2: Get the Service URL

After deployment, get your Cloud Run service URL:

```bash
gcloud run services describe alignhealthcare \
  --region us-central1 \
  --format='value(status.url)'
```

Test the deployment:
```bash
curl <YOUR_CLOUD_RUN_URL>
```

## Step 3: Configure Custom Domain (alignhealthcare.ai)

### A. Add domain mapping in Cloud Run

```bash
gcloud run domain-mappings create \
  --service alignhealthcare \
  --domain alignhealthcare.ai \
  --region us-central1
```

This will output DNS records you need to add.

### B. Update DNS Records

You'll need to add DNS records with your domain registrar:

1. **Get the required records:**
   ```bash
   gcloud run domain-mappings describe \
     --domain alignhealthcare.ai \
     --region us-central1
   ```

2. **Add these records to your DNS provider:**
   - Type: `A` or `AAAA` or `CNAME` (as specified)
   - Name: `@` (for root domain) or `www`
   - Value: (as provided by the command above)

### C. Verify domain mapping status

```bash
gcloud run domain-mappings describe \
  --domain alignhealthcare.ai \
  --region us-central1
```

Wait for status to show "Active" (can take up to 15 minutes).

## Step 4: Configure www subdomain (Optional)

If you want www.alignhealthcare.ai to work:

```bash
gcloud run domain-mappings create \
  --service alignhealthcare \
  --domain www.alignhealthcare.ai \
  --region us-central1
```

Then add the DNS records for the www subdomain as well.

## Step 5: Update Environment Variables (if needed)

If you need to add more environment variables:

```bash
gcloud run services update alignhealthcare \
  --region us-central1 \
  --set-env-vars "MONGODB_URI=your-value,SESSION_SECRET=your-value"
```

Or use secrets:

```bash
# Create a secret
echo -n "your-secret-value" | gcloud secrets create mongodb-uri --data-file=-

# Grant access to Cloud Run service
gcloud secrets add-iam-policy-binding mongodb-uri \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT" \
  --role="roles/secretmanager.secretAccessor"

# Update service to use secret
gcloud run services update alignhealthcare \
  --region us-central1 \
  --set-secrets="MONGODB_URI=mongodb-uri:latest"
```

## Useful Commands

### View service details
```bash
gcloud run services describe alignhealthcare --region us-central1
```

### View logs
```bash
gcloud run services logs read alignhealthcare --region us-central1 --limit 50
```

### Update resource allocation
```bash
gcloud run services update alignhealthcare \
  --region us-central1 \
  --memory 4Gi \
  --cpu 2 \
  --max-instances 20
```

### Redeploy latest image
```bash
gcloud builds submit --config cloudbuild.yaml
```

### Rollback to previous revision
```bash
# List revisions
gcloud run revisions list --service alignhealthcare --region us-central1

# Route traffic to specific revision
gcloud run services update-traffic alignhealthcare \
  --region us-central1 \
  --to-revisions REVISION_NAME=100
```

## Replacing ocl.network

If you want to replace the existing ocl.network site with this deployment:

1. **Option A: Update domain mapping**
   ```bash
   # Remove old mapping (if exists)
   gcloud run domain-mappings delete --domain ocl.network --region us-central1

   # Add new mapping
   gcloud run domain-mappings create \
     --service alignhealthcare \
     --domain ocl.network \
     --region us-central1
   ```

2. **Option B: Update DNS directly**
   - Point ocl.network DNS records to the new alignhealthcare Cloud Run service
   - Update the CNAME/A records in your DNS provider

## Cost Optimization

To minimize costs when traffic is low:

```bash
gcloud run services update alignhealthcare \
  --region us-central1 \
  --min-instances 0 \
  --max-instances 10 \
  --cpu-throttling
```

This allows the service to scale to zero when not in use.

## Troubleshooting

### Build fails
- Check logs: `gcloud builds log $(gcloud builds list --limit 1 --format='value(id)')`
- Verify package.json has all dependencies

### Deployment fails
- Check Cloud Run logs: `gcloud run services logs read alignhealthcare --region us-central1`
- Verify environment variables are set correctly

### Domain mapping issues
- DNS propagation can take up to 24-48 hours
- Verify DNS records are correct: `dig alignhealthcare.ai`
- Check SSL certificate status (auto-provisioned by Google)

### Site not loading
- Check if service is running: `gcloud run services describe alignhealthcare --region us-central1`
- Test with curl: `curl -I https://YOUR_CLOUD_RUN_URL`
- Check application logs for errors
