# The London Salon | Guest Registry

A premium, "Quiet Luxury" client feedback application designed for high-end boutique environments. This system captures artisan-level performance data and environmental feedback, while providing an AI-powered personalized thank-you experience for the guest.

## Features

- **Artisan Evaluation**: Multi-stylist selection with granular star-based performance metrics.
- **Sophisticated UX**: Minimalist design with smooth transitions, progress tracking, and a "Quiet Luxury" aesthetic.
- **AI Personalization**: Integrated with Google Gemini API to generate tailored, warm, and professional responses based on specific guest feedback.
- **Enterprise Registry**: Robust dual-sync architecture supporting Google Sheets and Airtable via asynchronous webhooks and APIs.
- **Aesthetic Intentionality**: Deliberate performance pacing ("Intentional Delay") to signify security and importance during data synchronization.

## Integration Setup

### Google Sheets
1. Create a new Google Sheet.
2. Navigate to `Extensions > Apps Script`.
3. Use the `doPost` function provided in `services/dataService.ts`.
4. Deploy as a Web App (Access: Anyone).
5. Update `GOOGLE_SHEETS_WEBHOOK_URL` in `services/dataService.ts`.

### Airtable
1. Create a Base named "The London Salon Feedback".
2. Create a Table named "Feedback".
3. Configure columns: `Date`, `Stylists`, `Ratings`, `FirstVisit`, `Satisfied`, `Comments`.
4. Update `AIRTABLE_API_KEY`, `BASE_ID`, and `TABLE_NAME` in `services/dataService.ts`.

## Tech Stack
- **Frontend**: React 19 (Hooks/Memoization), Tailwind CSS
- **Intelligence**: Google Gemini (via @google/genai)
- **Data Persistence**: Google Apps Script, Airtable API
- **Design**: Playfair Display (Serif) & Inter (Sans)

---
© 2024 The London Salon. Elegance Defined By Craft.
