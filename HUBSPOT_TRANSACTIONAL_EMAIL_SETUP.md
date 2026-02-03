# HubSpot Transactional Email Setup

This guide explains how to migrate from AWS SES to HubSpot for transactional emails (password resets, login notifications, etc.).

---

## Why Use HubSpot for Transactional Emails?

### Benefits
- ✅ **All-in-one**: Marketing + transactional emails in one place
- ✅ **Better deliverability**: HubSpot manages sender reputation
- ✅ **Professional templates**: Pre-built, mobile-responsive templates
- ✅ **Built-in analytics**: Track open rates, clicks, bounces
- ✅ **Compliance**: Automatic CAN-SPAM and GDPR compliance
- ✅ **No infrastructure**: No need to manage SES, domain verification, etc.

### Cost Comparison

| Service | Free Tier | Paid Tier | Use Case |
|---------|-----------|-----------|----------|
| **HubSpot Marketing Hub** | 2,000 emails/mo | $20/mo (Starter) | Marketing emails only |
| **HubSpot Transactional** | 200 emails/mo | $800/mo (Professional) | Transactional + Marketing |
| **AWS SES** | None | $0.10/1000 emails | Transactional only |

### Recommendation

**Start with this setup:**
1. **HubSpot Free**: Waitlist welcome emails + newsletters (✅ Done!)
2. **AWS SES**: Keep for transactional emails (password resets)
3. **Later**: Upgrade to HubSpot Professional when you have paying customers

**Why?** You get professional marketing emails now, and only pay for transactional when you have revenue to support it.

---

## Current Email Setup (What You Have Now)

Your Python API currently uses AWS SES:

```python
# stack/python-api/src/config.py
aws_access_key_id: str = Field(default="", ...)
aws_secret_access_key: str = Field(default="", ...)
aws_region: str = Field(default="us-east-1", ...)
ses_from_email: str = Field(default="noreply@ocl.network", ...)
ses_enabled: bool = Field(default=False, ...)
```

This sends:
- Password reset emails
- Email verification
- Login notifications
- 2FA codes (if email-based)

---

## Option 1: Keep AWS SES for Now (Recommended for Startups)

**When to use this:**
- You're pre-revenue or early stage
- You want to minimize costs
- You already have SES configured
- You send < 10,000 transactional emails/month

**What you need to do:**
✅ Nothing! Your current setup works fine.

**Costs:**
- $0.10 per 1,000 emails
- Example: 1,000 password resets/month = $0.10/month

**Setup guide:** Your AWS SES is already configured. Just ensure:
1. Domain is verified in AWS SES
2. SES is in production mode (not sandbox)
3. Environment variables are set in `.env`

---

## Option 2: Migrate to HubSpot Transactional Email

**When to use this:**
- You're upgrading to HubSpot Marketing Hub Professional ($800/mo)
- You want all emails in one place
- You need better email analytics
- You want professional transactional email templates

### Step 1: Verify Your Domain in HubSpot

1. **Go to Settings → Website → Domains & URLs**
   - `https://app.hubspot.com/settings/{ACCOUNT_ID}/marketing/email/configuration/sending-domains`

2. **Add Your Domain**
   - Click **Connect a domain**
   - Enter: `alignhealthcare.ai`
   - Click **Connect**

3. **Add DNS Records**
   HubSpot will show you DNS records to add to GoDaddy:
   ```
   Type: TXT
   Host: hs1-<random>
   Value: hs1-<random>.html
   ```

4. **Verify the Domain**
   - Wait 10-15 minutes for DNS propagation
   - Click **Verify** in HubSpot
   - Status should change to "Verified"

### Step 2: Create a HubSpot Private App for Transactional Emails

1. **Go to Settings → Integrations → Private Apps**
2. **Create a new app**: "Transactional Email API"
3. **Add these scopes:**
   - ✅ `transactional-email`
   - ✅ `crm.objects.contacts.read`
4. **Copy the access token**

### Step 3: Create Email Templates in HubSpot

#### Password Reset Email Template

1. **Go to Marketing → Email → Templates**
2. **Click Create template**
3. **Choose "Drag and drop"**
4. **Design your template:**

```html
Subject: Reset Your Password

Hi {{contact.firstname}},

You requested to reset your password for AlignHealthcare.ai.

Click the button below to reset your password:

[Reset Password Button - Links to: {{reset_url}}]

This link expires in 1 hour.

If you didn't request this, you can safely ignore this email.

Best regards,
The AlignHealthcare.ai Team
```

5. **Save the template**
6. **Note the template ID** from the URL

#### Email Verification Template

```html
Subject: Verify Your Email Address

Hi {{contact.firstname}},

Welcome to AlignHealthcare.ai!

Please verify your email address by clicking the button below:

[Verify Email Button - Links to: {{verification_url}}]

This link expires in 24 hours.

Best regards,
The AlignHealthcare.ai Team
```

### Step 4: Update Python API to Use HubSpot

#### Install HubSpot SDK

```bash
cd stack/python-api
pip install hubspot-api-client
```

#### Create HubSpot Email Service

Create `stack/python-api/src/services/hubspot_email_service.py`:

```python
"""
HubSpot Transactional Email Service

Sends transactional emails via HubSpot instead of AWS SES.
"""

from typing import Optional
from hubspot import HubSpot
from hubspot.crm.contacts import ApiException
import os

class HubSpotEmailService:
    """Service for sending transactional emails via HubSpot"""

    def __init__(self):
        self.api_key = os.getenv('HUBSPOT_ACCESS_TOKEN')
        if not self.api_key:
            raise ValueError("HUBSPOT_ACCESS_TOKEN not configured")

        self.client = HubSpot(access_token=self.api_key)

    async def send_transactional_email(
        self,
        to_email: str,
        template_id: int,
        personalization: dict,
        contact_properties: Optional[dict] = None
    ):
        """
        Send a transactional email using HubSpot.

        Args:
            to_email: Recipient email address
            template_id: HubSpot template ID
            personalization: Custom properties for template (e.g., reset_url)
            contact_properties: Optional contact properties to update/create
        """
        try:
            # Step 1: Ensure contact exists
            contact_id = await self._ensure_contact_exists(
                to_email,
                contact_properties or {}
            )

            # Step 2: Send email using Single Send API
            email_request = {
                "emailId": template_id,
                "message": {
                    "to": to_email,
                },
                "contactProperties": personalization,
            }

            response = self.client.marketing.transactional.send_api.send_email(
                email_request
            )

            return {
                "success": True,
                "message_id": response.id,
                "status": response.status
            }

        except ApiException as e:
            print(f"HubSpot email error: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def _ensure_contact_exists(
        self,
        email: str,
        properties: dict
    ) -> str:
        """Create or update contact in HubSpot"""
        try:
            # Try to find existing contact
            search_result = self.client.crm.contacts.search_api.do_search(
                public_object_search_request={
                    "filterGroups": [
                        {
                            "filters": [
                                {
                                    "propertyName": "email",
                                    "operator": "EQ",
                                    "value": email
                                }
                            ]
                        }
                    ]
                }
            )

            if search_result.results:
                # Contact exists, update it
                contact_id = search_result.results[0].id
                self.client.crm.contacts.basic_api.update(
                    contact_id=contact_id,
                    simple_public_object_input={"properties": properties}
                )
                return contact_id
            else:
                # Create new contact
                properties["email"] = email
                result = self.client.crm.contacts.basic_api.create(
                    simple_public_object_input={"properties": properties}
                )
                return result.id

        except ApiException as e:
            print(f"Contact creation error: {e}")
            raise

    async def send_password_reset(
        self,
        to_email: str,
        reset_token: str,
        user_name: str
    ):
        """Send password reset email"""
        reset_url = f"https://alignhealthcare.ai/reset-password?token={reset_token}"

        return await self.send_transactional_email(
            to_email=to_email,
            template_id=int(os.getenv('HUBSPOT_PASSWORD_RESET_TEMPLATE_ID')),
            personalization={
                "reset_url": reset_url,
            },
            contact_properties={
                "firstname": user_name.split()[0] if user_name else "",
                "lastname": " ".join(user_name.split()[1:]) if len(user_name.split()) > 1 else "",
            }
        )

    async def send_verification_email(
        self,
        to_email: str,
        verification_token: str,
        user_name: str
    ):
        """Send email verification"""
        verification_url = f"https://alignhealthcare.ai/verify-email?token={verification_token}"

        return await self.send_transactional_email(
            to_email=to_email,
            template_id=int(os.getenv('HUBSPOT_VERIFICATION_TEMPLATE_ID')),
            personalization={
                "verification_url": verification_url,
            },
            contact_properties={
                "firstname": user_name.split()[0] if user_name else "",
                "lastname": " ".join(user_name.split()[1:]) if len(user_name.split()) > 1 else "",
            }
        )

# Initialize service
hubspot_email_service = HubSpotEmailService()
```

#### Update Auth Routes

In `stack/python-api/src/routes/auth.py`, replace AWS SES with HubSpot:

```python
# OLD (AWS SES)
from src.services.email_service import send_password_reset_email

# NEW (HubSpot)
from src.services.hubspot_email_service import hubspot_email_service

# In your forgot-password route:
@router.post("/forgot-password")
async def forgot_password(request: ForgotPasswordRequest):
    # ... (your existing logic)

    # OLD:
    # await send_password_reset_email(email, reset_token)

    # NEW:
    await hubspot_email_service.send_password_reset(
        to_email=email,
        reset_token=reset_token,
        user_name=user.get("full_name", "")
    )

    return {"message": "Password reset email sent"}
```

### Step 5: Update Environment Variables

Add to `.env`:

```bash
# HubSpot Transactional Email
HUBSPOT_ACCESS_TOKEN=pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
HUBSPOT_PASSWORD_RESET_TEMPLATE_ID=12345678
HUBSPOT_VERIFICATION_TEMPLATE_ID=87654321

# (Optional) Disable AWS SES
SES_ENABLED=false
```

### Step 6: Test the Integration

```bash
# Send a test password reset
curl -X POST http://localhost:8082/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "your-test-email@example.com"}'

# Check your inbox for the HubSpot email
```

---

## Hybrid Approach: Use Both (Recommended)

**Best practice for most startups:**

| Email Type | Service | Why |
|------------|---------|-----|
| **Waitlist welcome** | HubSpot (Free) | Marketing email, better engagement |
| **Newsletters** | HubSpot (Free) | Unsubscribe management, analytics |
| **Password resets** | AWS SES | Very low volume, saves money |
| **Email verification** | AWS SES | Transactional, no tracking needed |
| **2FA codes** | AWS SES | Time-sensitive, needs to be instant |

**Setup:**
```python
# Use HubSpot for marketing
if email_type == "marketing":
    await hubspot_email_service.send_marketing_email(...)
# Use AWS SES for transactional
else:
    await ses_email_service.send_transactional_email(...)
```

**Cost example (1000 users/month):**
- HubSpot Free: $0 (2000 marketing emails)
- AWS SES: $0.50 (5000 transactional emails)
- **Total: $0.50/month**

vs.

- HubSpot Professional: $800/month
- **Total: $800/month**

---

## Migration Checklist

### Phase 1: Waitlist (Done! ✅)
- [x] HubSpot account created
- [x] Waitlist form integrated
- [x] Welcome email workflow set up

### Phase 2: Marketing Emails (Next)
- [ ] Create newsletter list in HubSpot
- [ ] Design email templates
- [ ] Set up automated sequences
- [ ] Migrate existing email subscribers (if any)

### Phase 3: Transactional Emails (Future)
- [ ] Upgrade to HubSpot Professional (when revenue supports it)
- [ ] Verify domain in HubSpot
- [ ] Create transactional email templates
- [ ] Install HubSpot SDK in Python API
- [ ] Update auth routes to use HubSpot
- [ ] Test password resets, verifications
- [ ] Disable AWS SES

---

## Recommended Timeline

### Now (Month 1-2)
- ✅ Use HubSpot Free for waitlist
- ✅ Keep AWS SES for transactional
- ✅ Focus on getting users

### Later (Month 3-6, post-launch)
- Upgrade to HubSpot Starter ($20/mo) if you need more marketing emails
- Keep AWS SES for transactional (still cheap)

### Future (Month 6+, post-revenue)
- Consider HubSpot Professional ($800/mo) when you have:
  - $5K+ MRR (so email cost is ~16% of revenue)
  - 10K+ transactional emails/month
  - Need for advanced CRM features

---

## Support Resources

- **HubSpot Transactional Email Docs**: https://developers.hubspot.com/docs/api/marketing/transactional-email
- **Python SDK**: https://github.com/HubSpot/hubspot-api-python
- **Template Builder**: https://knowledge.hubspot.com/email/create-marketing-emails
- **HubSpot Academy** (Free): https://academy.hubspot.com/

---

## Summary

✅ **For Waitlist**: Use HubSpot (Done!)
✅ **For Transactional**: Keep AWS SES for now (saves $800/mo)
📅 **Upgrade Later**: When you have revenue to support it

This gives you professional waitlist emails now while keeping costs low. When you're ready to scale, HubSpot is there waiting for you!
