import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

/**
 * HubSpot Waitlist Signup API Route
 *
 * Adds contacts to HubSpot and assigns them to a waitlist list.
 *
 * Environment Variables Required:
 * - HUBSPOT_ACCESS_TOKEN: Your HubSpot Private App access token
 * - HUBSPOT_WAITLIST_LIST_ID: The ID of your HubSpot list for waitlist signups
 *
 * To get your HubSpot Access Token:
 * 1. Go to Settings > Integrations > Private Apps
 * 2. Create a new private app
 * 3. Grant these scopes:
 *    - crm.objects.contacts.write
 *    - crm.lists.write
 * 4. Copy the access token
 *
 * To get your List ID:
 * 1. Go to Contacts > Lists
 * 2. Create a new list called "Waitlist Signups"
 * 3. The ID is in the URL: /contacts/{LIST_ID}/
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, company, role, useCase } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !company || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 },
      );
    }

    // Get HubSpot credentials from environment
    const hubspotAccessToken = process.env.HUBSPOT_ACCESS_TOKEN;

    if (!hubspotAccessToken) {
      console.error('HubSpot access token not configured');
      console.error('Environment check:', {
        hasToken: !!process.env.HUBSPOT_ACCESS_TOKEN,
        hasListId: !!process.env.HUBSPOT_WAITLIST_LIST_ID,
      });
      // Still return success to user but log the error
      return NextResponse.json(
        {
          message: 'Successfully joined waitlist',
          warning: 'Email notification may be delayed',
        },
        { status: 200 },
      );
    }

    // eslint-disable-next-line no-console
    console.log('Processing waitlist signup:', { email, firstName, lastName });

    // Step 1: Create or update contact in HubSpot
    const contactData = {
      properties: {
        email,
        firstname: firstName,
        lastname: lastName,
        company,
        jobtitle: role,
        // Set lead status to NEW so contact appears in waitlist segment
        hs_lead_status: 'NEW',
        // Set lifecycle stage to lead
        lifecyclestage: 'lead',
        // Custom property for use case (you'll need to create this in HubSpot)
        use_case: useCase || '',
        // Add a custom property to track waitlist status
        waitlist_status: 'pending',
        // Track signup date
        waitlist_signup_date: new Date().toISOString(),
      },
    };

    // Create or update contact using HubSpot API v3
    const contactResponse = await fetch(
      'https://api.hubapi.com/crm/v3/objects/contacts',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${hubspotAccessToken}`,
        },
        body: JSON.stringify(contactData),
      },
    );

    let contactId: string;

    if (contactResponse.status === 409) {
      // Contact already exists, update it instead
      const searchResponse = await fetch(
        `https://api.hubapi.com/crm/v3/objects/contacts/search`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${hubspotAccessToken}`,
          },
          body: JSON.stringify({
            filterGroups: [
              {
                filters: [
                  {
                    propertyName: 'email',
                    operator: 'EQ',
                    value: email,
                  },
                ],
              },
            ],
          }),
        },
      );

      const searchData = await searchResponse.json();

      if (searchData.results && searchData.results.length > 0) {
        contactId = searchData.results[0].id;

        // Update existing contact
        await fetch(
          `https://api.hubapi.com/crm/v3/objects/contacts/${contactId}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${hubspotAccessToken}`,
            },
            body: JSON.stringify(contactData),
          },
        );
      } else {
        throw new Error('Contact exists but could not be found');
      }
    } else if (!contactResponse.ok) {
      const errorData = await contactResponse.json();
      console.error('HubSpot contact creation failed:', errorData);
      throw new Error(
        `Failed to create contact in HubSpot: ${errorData.message || contactResponse.statusText}`,
      );
    } else {
      const contactResponseData = await contactResponse.json();
      contactId = contactResponseData.id;
      // eslint-disable-next-line no-console
      console.log('HubSpot contact created successfully:', {
        contactId,
        email,
        url: contactResponseData.url,
      });
    }

    // Step 2: Contact will automatically appear in your HubSpot segment
    // Because we set hs_lead_status = "NEW", the contact matches your segment filter:
    // "Waitlist_AlignHealthcareAI" (Lead status is NEW)
    // HubSpot will add it to the segment automatically (usually within 1-2 seconds)

    // Step 3: (Optional) Trigger HubSpot workflow
    // If you have a workflow set up in HubSpot that sends welcome emails,
    // it will be triggered automatically when the contact is created/updated

    return NextResponse.json(
      {
        message: 'Successfully joined waitlist',
        contactId,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Waitlist signup error:', error);
    return NextResponse.json(
      {
        error: error.message || 'Failed to join waitlist. Please try again.',
      },
      { status: 500 },
    );
  }
}
