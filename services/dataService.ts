
import { SurveyData } from "../types";

/**
 * THE LONDON SALON | DATA REGISTRY SERVICE
 * 
 * For Google Sheets setup instructions, please read: GOOGLE_SHEETS_SETUP.md
 */

// REPLACE THIS WITH YOUR DEPLOYED WEB APP URL
const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxBloTRMQGBLXAXqn63djRrtyxenMWYS7aeGJYqfURAt19N_bnX4Npri1lxV4sLLL5e/exec';

// AIRTABLE CONFIGURATION
const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY || 'pat.PLACEHOLDER';
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID || 'appPLACEHOLDER';
const AIRTABLE_TABLE_NAME = import.meta.env.VITE_AIRTABLE_TABLE_NAME || 'Feedback';

export const syncFeedbackToRegistry = async (data: SurveyData): Promise<boolean> => {
  // A 3-second intentional delay ensures the "Syncing with Registry" animation 
  // feels sophisticated and provides a sense of security and importance.
  const minimumDelay = new Promise(resolve => setTimeout(resolve, 3000));

  const payload = {
    ...data,
    mobile: data.mobileNumber || "N/A",
    stylists: data.stylistRatings.map(s => s.name).join(", "),
    ratings: data.stylistRatings.map(s => `${s.name}: ${s.rating}/5`).join(" | "),
    timestamp: new Date().toISOString()
  };

  console.log("Registry: Final Sync Payload:", payload);
  if (!data.mobileNumber) {
    console.warn("Registry Warning: No mobile number found in state during sync.");
  }

  try {
    const syncTasks: Promise<any>[] = [];

    // 1. Google Sheets Integration
    if (GOOGLE_SHEETS_WEBHOOK_URL && !GOOGLE_SHEETS_WEBHOOK_URL.includes('PLACEHOLDER')) {
      console.log("Registry: Sending request to Google Sheets...", GOOGLE_SHEETS_WEBHOOK_URL);

      const sheetsTask = fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        // Using 'no-cors' is common for GAS to avoid preflight, but it means we can't read the response.
        // However, the POST will still reach the server.
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8'
        },
        body: JSON.stringify(payload)
      })
        .then(() => {
          console.log("Registry: Google Sheets sync request completed (Note: GAS responses are opaque in no-cors mode).");
        })
        .catch(err => {
          console.error("Registry: Google Sheets Error:", err);
        });

      syncTasks.push(sheetsTask);
    } else {
      console.warn("Registry: Google Sheets URL is missing or placeholder.");
    }

    // 2. Airtable Integration
    if (AIRTABLE_API_KEY && !AIRTABLE_API_KEY.includes('PLACEHOLDER')) {
      console.log("Registry: Sending request to Airtable...", { baseId: AIRTABLE_BASE_ID, table: AIRTABLE_TABLE_NAME });

      const airtableTask = fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fields: {
            "Date": payload.timestamp,
            "Mobile": payload.mobile,
            "Stylists": payload.stylists,
            "Ratings": payload.ratings,
            "FirstVisit": payload.isFirstVisit,
            "Satisfied": payload.isSatisfied,
            "Welcoming": payload.isWelcoming,
            "Timely": payload.isTimely,
            "TeaOffered": payload.teaOffered,
            "PackagesExplained": payload.packagesExplained,
            "ReviewRequested": payload.reviewRequested,
            "CouponReceived": payload.couponReceived,
            "Comments": payload.additionalComments
          }
        })
      })
        .then(async response => {
          if (response.ok) {
            console.log("Registry: Airtable sync successful.");
          } else {
            const errorData = await response.json().catch(() => ({}));
            console.error("Registry: Airtable sync failed.", response.status, errorData);
          }
        })
        .catch(err => console.error("Registry: Airtable Error:", err));

      syncTasks.push(airtableTask);
    } else {
      console.warn("Registry: Airtable configuration is missing or placeholder.");
    }

    // Wait for network requests and the aesthetic delay to complete
    await Promise.allSettled([...syncTasks, minimumDelay]);

    return true;
  } catch (error) {
    console.error("Registry Synchronisation Error:", error);
    // We wait for the delay even on error to maintain the UI flow
    await minimumDelay;
    return true;
  }
};
