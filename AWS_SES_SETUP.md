# AWS SES Setup for AlignHealthcare.ai

## Overview

AlignHealthcare.ai uses AWS SES (Simple Email Service) to send transactional emails for:
- Email verification during account creation
- Password reset emails
- 2FA codes (future)

## Prerequisites

- AWS Account with SES access
- Domain: `alignhealthcare.ai` (already registered)

---

## Step 1: Verify Email Domain in AWS SES

### 1.1 Navigate to AWS SES Console

```
https://console.aws.amazon.com/ses/home?region=us-east-1
```

### 1.2 Verify Domain

1. Go to **Configuration** → **Verified identities**
2. Click **Create identity**
3. Select **Domain**
4. Enter: `alignhealthcare.ai`
5. Check **"Use a custom MAIL FROM domain"** (optional but recommended)
   - MAIL FROM domain: `mail.alignhealthcare.ai`
6. Click **Create identity**

### 1.3 Add DNS Records

AWS will provide DNS records to add to your DNS provider (Cloudflare):

**Note on MX Priority:** When adding MX records, use **Priority: 10**. Lower numbers = higher priority. Since AWS SES is your only mail server, 10 is the standard value.

**DNS Records to Add:**
```
Type: TXT
Name: _amazonses.alignhealthcare.ai
Value: [AWS-PROVIDED-VALUE]

Type: CNAME
Name: [AWS-PROVIDED-DKIM-1]._domainkey.alignhealthcare.ai
Value: [AWS-PROVIDED-VALUE]

Type: CNAME
Name: [AWS-PROVIDED-DKIM-2]._domainkey.alignhealthcare.ai
Value: [AWS-PROVIDED-VALUE]

Type: CNAME
Name: [AWS-PROVIDED-DKIM-3]._domainkey.alignhealthcare.ai
Value: [AWS-PROVIDED-VALUE]

Type: MX (optional - for bounce handling)
Name: mail
Value: feedback-smtp.us-east-1.amazonses.com
Priority: 10
TTL: Auto (or 3600)
```

### 1.4 Wait for Verification

- Verification can take up to 72 hours
- Check status in **Verified identities** section
- Status should change from "Pending verification" to "Verified"

---

## Step 2: Request Production Access (Move Out of Sandbox)

By default, SES accounts are in **sandbox mode** with these limitations:
- Can only send to verified email addresses
- Limited to 200 emails/day
- 1 email/second send rate

### 2.1 Request Production Access

1. Go to **Account dashboard**
2. Click **Request production access**
3. Fill out the form:
   - **Mail type:** Transactional
   - **Website URL:** https://alignhealthcare.ai
   - **Use case description:**
     ```
     AlignHealthcare.ai is a healthcare AI training platform that sends
     transactional emails for:
     - Email verification during account creation
     - Password reset requests
     - Two-factor authentication codes

     We send approximately 100-500 emails per day. All emails are
     transactional (not marketing). Users explicitly opt-in during
     account creation.
     ```
   - **Additional contacts:** matt@opencitylabs.com
   - **Acknowledge compliance:** Check all boxes

4. Submit request
5. AWS typically approves within 24 hours

---

## Step 3: Create IAM User for SES Access

### 3.1 Create IAM User

1. Go to **IAM Console** → **Users** → **Create user**
2. User name: `alignhealthcare-ses-user`
3. Select **Access key - Programmatic access**
4. Click **Next**

### 3.2 Attach Permissions

1. Click **Attach policies directly**
2. Search for and select: **AmazonSESFullAccess**
3. Click **Next** → **Create user**

### 3.3 Create Access Keys

1. Go to the new user
2. Click **Security credentials** tab
3. Click **Create access key**
4. Select **Application running outside AWS**
5. Click **Next** → **Create access key**
6. **IMPORTANT:** Save these credentials securely:
   - Access key ID: `AKIAXXXXXXXXXXXXXXXX`
   - Secret access key: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

---

## Step 4: Configure Environment Variables

### 4.1 Python API Environment Variables

Add these to your Python API environment (Cloud Run service or local `.env`):

```bash
# AWS SES Configuration
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_REGION=us-east-1

# SES Settings
SES_ENABLED=true
SES_FROM_EMAIL=hello@alignhealthcare.ai
SES_FROM_NAME=AlignHealthcare.ai

# Application Base URL
APP_BASE_URL=https://alignhealthcare.ai
```

### 4.2 Set Environment Variables on Cloud Run (if deployed)

```bash
gcloud run services update [YOUR-PYTHON-API-SERVICE] \
  --region us-central1 \
  --set-env-vars="
AWS_ACCESS_KEY_ID=AKIAXXXXXXXXXXXXXXXX,
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx,
AWS_REGION=us-east-1,
SES_ENABLED=true,
SES_FROM_EMAIL=hello@alignhealthcare.ai,
SES_FROM_NAME=AlignHealthcare.ai,
APP_BASE_URL=https://alignhealthcare.ai
"
```

---

## Step 5: Test Email Sending

### 5.1 Test in Sandbox Mode (Before Production Access)

While in sandbox, you can only send to verified email addresses:

1. Go to **SES Console** → **Verified identities**
2. Click **Create identity**
3. Select **Email address**
4. Enter your email: `matt@opencitylabs.com`
5. Click **Create identity**
6. Check your inbox and click verification link
7. Now you can test sending to this address

### 5.2 Test Account Creation

1. Go to: https://alignhealthcare.ai/sign-up
2. Create a test account with your verified email
3. Check inbox for verification email
4. Click verification link
5. Confirm account is verified

---

## Step 6: Monitor Email Sending

### 6.1 CloudWatch Metrics

Monitor email sending in CloudWatch:
- **Delivery Rate:** Should be > 95%
- **Bounce Rate:** Should be < 5%
- **Complaint Rate:** Should be < 0.1%

### 6.2 Reputation Dashboard

Check your sending reputation:
1. Go to **SES Console** → **Reputation dashboard**
2. Monitor bounce and complaint rates
3. Set up CloudWatch alarms for high rates

---

## Troubleshooting

### Issue: Emails Not Sending

**Check:**
1. SES_ENABLED=true in environment variables
2. AWS credentials are correct
3. Domain is verified in SES
4. Account is out of sandbox (or recipient is verified)
5. Check CloudWatch logs for errors

### Issue: Emails Going to Spam

**Solutions:**
1. Complete domain verification (DKIM records)
2. Add SPF record:
   ```
   Type: TXT
   Name: @
   Value: v=spf1 include:amazonses.com ~all
   ```
3. Add DMARC record:
   ```
   Type: TXT
   Name: _dmarc
   Value: v=DMARC1; p=none; rua=mailto:dmarc@alignhealthcare.ai
   ```

### Issue: Domain Verification Pending

**Check:**
1. DNS records are correctly added to GoDaddy
2. Wait up to 72 hours for propagation
3. Verify DNS with:
   ```bash
   dig TXT _amazonses.alignhealthcare.ai
   dig CNAME [dkim-token]._domainkey.alignhealthcare.ai
   ```

---

## Cost Estimates

AWS SES Pricing (us-east-1):
- **First 62,000 emails/month:** FREE (if sent from EC2)
- **After that:** $0.10 per 1,000 emails
- **Data transfer:** $0.12 per GB

**Estimated monthly cost:**
- 500 emails/day = 15,000/month
- Cost: **FREE** (under free tier)

---

## Security Best Practices

1. **Use IAM user** with only SES permissions (not root account)
2. **Rotate credentials** every 90 days
3. **Enable MFA** on IAM user
4. **Monitor CloudWatch** for unusual activity
5. **Set up bounce handling** to remove invalid emails
6. **Never commit credentials** to git (use environment variables)

---

## Next Steps

After SES is configured:
1. Test email verification flow
2. Test password reset flow
3. Monitor delivery rates
4. Set up bounce/complaint handling
5. Configure email templates (already done in code)

---

## Support

- **AWS SES Documentation:** https://docs.aws.amazon.com/ses/
- **Troubleshooting Guide:** https://docs.aws.amazon.com/ses/latest/dg/troubleshoot.html
- **Support:** matt@opencitylabs.com
