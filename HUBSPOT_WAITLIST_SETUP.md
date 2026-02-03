# HubSpot Waitlist Integration - Setup Guide

This guide will walk you through setting up the HubSpot integration for your waitlist signup form.

---

## Overview

The waitlist integration consists of:
- **Frontend Form**: `/waitlist` page where users enter their information
- **API Route**: `/api/waitlist/signup` that sends data to HubSpot
- **HubSpot**: Stores contacts and manages email campaigns

---

## Step 1: Create a HubSpot Account (if you don't have one)

1. Go to [HubSpot.com](https://www.hubspot.com/)
2. Click "Get started free"
3. Create your account
4. Choose "Marketing Hub" (free tier is fine to start)

---

## Step 2: Create a HubSpot Private App

A Private App gives you an access token to use the HubSpot API.

1. **Navigate to Settings**
   - Click the settings icon (⚙️) in the top navigation bar
   - Or go to: `https://app.hubspot.com/settings/{YOUR_ACCOUNT_ID}/`

2. **Go to Integrations → Private Apps**
   - In the left sidebar, click **Integrations**
   - Click **Private Apps**
   - Click **Create a private app**

3. **Configure the App**
   - **Name**: "AlignHealthcare Waitlist Integration"
   - **Description**: "API integration for waitlist signups"

4. **Set Scopes (Permissions)**
   Click the **Scopes** tab and enable these:
   - ✅ `crm.objects.contacts.write` - Create and update contacts
   - ✅ `crm.lists.write` - Add contacts to lists
   - ✅ `crm.objects.contacts.read` - Read contact data (for updating existing)

5. **Create the App**
   - Click **Create app**
   - **IMPORTANT**: Copy the access token that appears
   - Save it securely - you won't see it again!

---

## Step 3: Create a Waitlist List in HubSpot

Lists help you segment contacts and send targeted email campaigns.

1. **Navigate to Contacts → Lists**
   - Go to `https://app.hubspot.com/contacts/{YOUR_ACCOUNT_ID}/lists`
   - Click **Create list**

2. **Configure the List**
   - **Name**: "Waitlist Signups"
   - **Type**: Choose "Active list" (automatically updates) or "Static list" (manual)
   - **Purpose**: "Marketing"

3. **Add Filter Criteria (for Active Lists)**
   If you chose Active list:
   - Add filter: `Contact property` → `Waitlist Status` → `is equal to` → `pending`
   - This will automatically add anyone with waitlist_status = "pending"

4. **Create the List**
   - Click **Save**
   - Note the **List ID** from the URL: `https://app.hubspot.com/contacts/{ACCOUNT_ID}/lists/{LIST_ID}`
   - Save this List ID for the next step

---

## Step 4: Create Custom Properties (Optional but Recommended)

Custom properties let you store additional data about contacts.

1. **Navigate to Settings → Data Management → Properties**
   - Go to: `https://app.hubspot.com/property-settings/{YOUR_ACCOUNT_ID}/properties`
   - Select **Contact properties**

2. **Create "Use Case" Property**
   - Click **Create property**
   - **Group**: Contact Information
   - **Label**: "Use Case"
   - **Field type**: "Multi-line text"
   - **Internal name**: `use_case`
   - **Description**: "What the contact wants to build with AlignHealthcare.ai"
   - Click **Create**

3. **Create "Waitlist Status" Property**
   - Click **Create property**
   - **Group**: Contact Information
   - **Label**: "Waitlist Status"
   - **Field type**: "Single-line text"
   - **Internal name**: `waitlist_status`
   - **Description**: "Current status in the waitlist (pending, approved, etc.)"
   - Click **Create**

4. **Create "Waitlist Signup Date" Property**
   - Click **Create property**
   - **Group**: Contact Information
   - **Label**: "Waitlist Signup Date"
   - **Field type**: "Date picker"
   - **Internal name**: `waitlist_signup_date`
   - **Description**: "Date the contact joined the waitlist"
   - Click **Create**

---

## Step 5: Configure Environment Variables

Add your HubSpot credentials to your `.env.local` file.

1. **Open or Create `.env.local`**
   ```bash
   cd /Users/Owner/opencitylabs/alignhealthcare
   touch .env.local
   ```

2. **Add HubSpot Configuration**
   ```bash
   # HubSpot Configuration
   HUBSPOT_ACCESS_TOKEN=pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   HUBSPOT_WAITLIST_LIST_ID=123
   ```

   Replace with your actual values:
   - `HUBSPOT_ACCESS_TOKEN`: The token you copied in Step 2
   - `HUBSPOT_WAITLIST_LIST_ID`: The list ID from Step 3

3. **Restart Your Development Server**
   ```bash
   npm run dev
   ```

---

## Step 6: Test the Integration

1. **Start the Development Server**
   ```bash
   npm run dev
   ```

2. **Navigate to the Waitlist Page**
   - Go to: `http://localhost:3000/waitlist`

3. **Fill Out the Form**
   - Enter test data (use your own email so you can verify)
   - Submit the form

4. **Verify in HubSpot**
   - Go to HubSpot → Contacts
   - Search for the email you used
   - Verify the contact was created with all the fields
   - Check that they appear in your "Waitlist Signups" list

5. **Check the Success Page**
   - After submitting, you should see a success message
   - "You're on the Waitlist!"

---

## Step 7: Set Up Email Automation (Optional)

Send welcome emails to waitlist signups automatically.

1. **Navigate to Automation → Workflows**
   - Go to: `https://app.hubspot.com/workflows/{YOUR_ACCOUNT_ID}/`
   - Click **Create workflow**

2. **Configure Workflow Trigger**
   - **Type**: "Contact-based"
   - **Trigger**: "Contact is added to list"
   - **List**: Select "Waitlist Signups"

3. **Add Email Action**
   - Click **+** to add an action
   - Select **Send email**
   - Create a welcome email template:

   **Example Email Template:**
   ```
   Subject: Welcome to the AlignHealthcare.ai Waitlist!

   Hi {{contact.firstname}},

   Thank you for joining the AlignHealthcare.ai waitlist!

   You're officially on our list, and we're excited to have you.

   What happens next?
   - You'll receive updates as we get closer to launch
   - If you're in the first 100 signups, you'll get a FREE account!
   - We'll reach out when your account is ready

   In the meantime, feel free to reply to this email with any questions.

   Best regards,
   The AlignHealthcare.ai Team
   ```

4. **Activate the Workflow**
   - Review the workflow
   - Click **Activate** in the top right

Now every new waitlist signup will automatically receive a welcome email!

---

## Step 8: Deploy to Production

When you're ready to deploy to production:

1. **Add Environment Variables to Vercel/Your Host**
   ```bash
   HUBSPOT_ACCESS_TOKEN=pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
   HUBSPOT_WAITLIST_LIST_ID=123
   ```

2. **Verify the Production URL**
   - Test the form at: `https://alignhealthcare.ai/waitlist`
   - Submit a test signup
   - Check HubSpot to verify it worked

---

## Troubleshooting

### "Failed to join waitlist" Error

**Check the following:**

1. **Environment Variables**
   ```bash
   # Verify they're set correctly
   echo $HUBSPOT_ACCESS_TOKEN
   echo $HUBSPOT_WAITLIST_LIST_ID
   ```

2. **HubSpot Access Token**
   - Make sure you copied the full token
   - Verify the token hasn't expired
   - Check that the Private App is enabled

3. **API Scopes**
   - Ensure your Private App has the required scopes:
     - `crm.objects.contacts.write`
     - `crm.lists.write`
     - `crm.objects.contacts.read`

4. **Check Server Logs**
   ```bash
   # Development
   npm run dev

   # Look for error messages in the terminal
   ```

5. **Test the HubSpot API Directly**
   ```bash
   curl -X POST https://api.hubapi.com/crm/v3/objects/contacts \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
     -d '{
       "properties": {
         "email": "test@example.com",
         "firstname": "Test",
         "lastname": "User"
       }
     }'
   ```

### Contact Already Exists Error

This is handled automatically! The API route will:
1. Search for the existing contact
2. Update their information
3. Add them to the waitlist list

### List Addition Fails

If contacts are being created but not added to the list:
- Verify the `HUBSPOT_WAITLIST_LIST_ID` is correct
- Check that your Private App has `crm.lists.write` scope
- Try manually adding a contact to the list in HubSpot to verify the list works

---

## Files Created

### Frontend
- **`src/app/[locale]/(unauth)/waitlist/page.tsx`**
  - Waitlist signup form page
  - Collects: first name, last name, email, company, role, use case
  - Shows success message after submission

### Backend
- **`src/app/api/waitlist/signup/route.ts`**
  - API endpoint that integrates with HubSpot
  - Creates/updates contacts
  - Adds contacts to the waitlist list

### Configuration
- **`src/templates/Hero.tsx`**
  - Updated button to link to `/waitlist` instead of Calendly

---

## Next Steps

### 1. Customize the Form
Edit `src/app/[locale]/(unauth)/waitlist/page.tsx` to:
- Add more fields (phone, company size, etc.)
- Change styling to match your brand
- Modify the success message

### 2. Create Email Sequences
In HubSpot, set up:
- Welcome email (immediate)
- Follow-up email after 3 days
- Status update email when account is ready
- Newsletter updates

### 3. Track Conversions
Set up analytics to track:
- How many people visit `/waitlist`
- Conversion rate (visitors → signups)
- Drop-off points in the form

### 4. A/B Test
Try different versions:
- Different copy ("Join Waitlist" vs "Get Early Access")
- Different form lengths (fewer fields = higher conversion)
- Different incentives ("First 100 get free" vs "Get 20% off")

---

## HubSpot Resources

- **HubSpot API Documentation**: https://developers.hubspot.com/docs/api/overview
- **Private Apps Guide**: https://developers.hubspot.com/docs/api/private-apps
- **Contacts API**: https://developers.hubspot.com/docs/api/crm/contacts
- **Lists API**: https://developers.hubspot.com/docs/api/crm/lists
- **HubSpot Academy** (Free Courses): https://academy.hubspot.com/

---

## Support

If you need help:
1. Check the [HubSpot Community](https://community.hubspot.com/)
2. Contact HubSpot Support (available on all plans)
3. Review the API logs in your application

---

**Setup Complete!** 🎉

Your waitlist is now integrated with HubSpot and ready to collect signups!
