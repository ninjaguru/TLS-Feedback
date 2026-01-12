
import { SurveyData } from "../types";

/**
 * THE LONDON SALON | DATA REGISTRY SERVICE
 * 
 * For Google Sheets setup instructions, please read: GOOGLE_SHEETS_SETUP.md
 */

// REPLACE THIS WITH YOUR DEPLOYED WEB APP URL
const GOOGLE_SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxBloTRMQGBLXAXqn63djRrtyxenMWYS7aeGJYqfURAt19N_bnX4Npri1lxV4sLLL5e/exec';

// AIRTABLE CONFIGURATION
const AIRTABLE_API_KEY = 'pat.PLACEHOLDER';
const AIRTABLE_BASE_ID = 'appPLACEHOLDER';
const AIRTABLE_TABLE_NAME = 'Feedback';

export const syncFeedbackToRegistry = async (data: SurveyData): Promise<boolean> => {
  // A 3-second intentional delay ensures the "Syncing with Registry" animation 
  // feels sophisticated and provides a sense of security and importance.
  const minimumDelay = new Promise(resolve => setTimeout(resolve, 3000));

  const payload = {
    ...data,
    stylists: data.stylistRatings.map(s => s.name).join(", "),
    ratings: data.stylistRatings.map(s => `${s.name}: ${s.rating}/5`).join(" | "),
    timestamp: new Date().toISOString(),
    mobile: data.mobileNumber || "N/A"
  };

  try {
    const syncTasks: Promise<any>[] = [];

    // 1. Google Sheets Integration
    if (GOOGLE_SHEETS_WEBHOOK_URL && !GOOGLE_SHEETS_WEBHOOK_URL.includes('PLACEHOLDER')) {
      syncTasks.push(
        fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
          method: 'POST',
          mode: 'no-cors', // Essential for Google Apps Script redirects in browsers
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        }).catch(err => console.error("Sheets Registry Error:", err))
      );
    }

    // 2. Airtable Integration
    if (AIRTABLE_API_KEY && !AIRTABLE_API_KEY.includes('PLACEHOLDER')) {
      syncTasks.push(
        fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}`, {
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
              "Comments": payload.additionalComments
            }
          })
        }).catch(err => console.error("Airtable Registry Error:", err))
      );
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
