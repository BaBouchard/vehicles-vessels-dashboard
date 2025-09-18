# Google Sheets Setup Guide

## 🚀 Quick Setup (5 Minutes)

### **Step 1: Create Your Google Sheet**

1. **Go to Google Sheets**: https://sheets.google.com
2. **Create new spreadsheet**: "Vehicles & Vessels Inventory"
3. **Create 3 sheets**:
   - `Vehicles` - For car inventory
   - `Vessels` - For yacht inventory  
   - `Sales` - For completed sales

### **Step 2: Copy Sample Data**

Use the template from `GOOGLE_SHEETS_TEMPLATE.md` to populate your sheets with sample data.

### **Step 3: Set Up Google Sheets API**

#### **Option A: Google Cloud Console (Recommended)**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create new project** or select existing
3. **Enable Google Sheets API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. **Create Service Account**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "Service Account"
   - Name: "vehicles-vessels-dashboard"
   - Click "Create and Continue"
5. **Download JSON Key**:
   - Click on your service account
   - Go to "Keys" tab
   - Click "Add Key" > "Create New Key"
   - Choose "JSON" format
   - Download the file
6. **Share Your Sheet**:
   - Open your Google Sheet
   - Click "Share" button
   - Add the service account email (from JSON file)
   - Give "Editor" permissions

#### **Option B: Google Apps Script (Simple)**

1. **Open your Google Sheet**
2. **Go to Extensions > Apps Script**
3. **Paste this code**:

```javascript
function onEdit(e) {
  const webhookUrl = 'https://your-domain.com/api/webhooks/google-sheets';
  
  const payload = {
    type: 'sheet_update',
    sheet: e.source.getActiveSheet().getName(),
    range: e.range.getA1Notation(),
    values: e.range.getValues(),
    timestamp: new Date().toISOString()
  };
  
  UrlFetchApp.fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    payload: JSON.stringify(payload)
  });
}
```

### **Step 4: Configure Environment Variables**

Create `.env.local` file in your project root:

```bash
# Google Sheets Integration
GOOGLE_SHEETS_SHEET_ID=your_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=./path/to/service-account-key.json

# Optional: Webhook secret for security
WEBHOOK_SECRET=your_webhook_secret_here

# Sheet ranges (optional)
GOOGLE_SHEETS_RANGE_VEHICLES=Vehicles!A:K
GOOGLE_SHEETS_RANGE_VESSELS=Vessels!A:K
GOOGLE_SHEETS_RANGE_SALES=Sales!A:H
```

### **Step 5: Get Your Sheet ID**

From your Google Sheet URL:
```
https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
```

Copy the `[SHEET_ID]` part and use it in your environment variables.

### **Step 6: Test the Integration**

1. **Restart your dashboard**: `npm run dev`
2. **Click "Sync Sheets"** button in dashboard header
3. **Check console** for sync status
4. **Verify data** appears in dashboard

## 🔧 Troubleshooting

### **Common Issues:**

#### **"Google Sheets not configured"**
- Check your `.env.local` file
- Verify `GOOGLE_SHEETS_SHEET_ID` is set
- Make sure service account key file exists

#### **"Permission denied"**
- Share your Google Sheet with service account email
- Check service account has "Editor" permissions
- Verify API is enabled in Google Cloud Console

#### **"Sheet not found"**
- Double-check your Sheet ID
- Make sure sheet names match: "Vehicles", "Vessels", "Sales"
- Verify sheet has data (not empty)

#### **"Sync failed"**
- Check internet connection
- Verify Google Sheets API quota limits
- Check console for detailed error messages

### **Testing Steps:**

1. **Manual Sync**: Click "Sync Sheets" button
2. **Check Console**: Look for sync success/failure messages
3. **Verify Data**: Check if new data appears in dashboard
4. **Test Updates**: Edit your Google Sheet and sync again

## 📊 Data Format

### **Required Columns:**

#### **Vehicles Sheet:**
- A: ID (VEH-001, VEH-002, etc.)
- B: Make (Ferrari, Lamborghini, etc.)
- C: Model (SF90 Stradale, Aventador, etc.)
- D: Year (2022, 2023, etc.)
- E: Price (450000, 520000, etc.)
- F: Commission (22500, 26000, etc.)
- G: Status (inventory, listed, sold)
- H: Description (Brief description)
- I: Image URL (https://...)
- J: Created (2024-01-01)
- K: Updated (2024-01-01)

#### **Vessels Sheet:**
- A: ID (VES-001, VES-002, etc.)
- B: Name (Ocean Explorer, Sea Dream, etc.)
- C: Type (yacht, boat, etc.)
- D: Length (95, 78, etc.)
- E: Price (4200000, 3200000, etc.)
- F: Commission (210000, 160000, etc.)
- G: Status (inventory, listed, sold)
- H: Description (Brief description)
- I: Image URL (https://...)
- J: Created (2024-01-01)
- K: Updated (2024-01-01)

## 🎯 Benefits

### **Why Google Sheets?**
- ✅ **Easy to use** - No technical knowledge required
- ✅ **Real-time collaboration** - Multiple users can edit
- ✅ **Free** - No additional costs
- ✅ **Familiar interface** - Everyone knows spreadsheets
- ✅ **Mobile friendly** - Edit from anywhere
- ✅ **Backup included** - Google handles data safety
- ✅ **Version history** - Track all changes
- ✅ **Easy sharing** - Share with team members

### **Perfect For:**
- **Small to medium** businesses
- **Quick setup** and testing
- **Team collaboration** on inventory
- **Non-technical** users
- **Budget-conscious** operations

## 🚀 Next Steps

1. **Set up your Google Sheet** with sample data
2. **Configure Google Sheets API** access
3. **Add environment variables** to `.env.local`
4. **Test sync functionality** with manual button
5. **Start managing** your inventory in Google Sheets
6. **Enjoy live updates** in your dashboard!

Your dashboard will now sync live with your Google Sheets! 📊✨

## 📞 Support

If you need help:
- Check the console for error messages
- Verify your Google Sheets setup
- Test with sample data first
- Contact support for custom integrations

Happy inventory managing! 🚗⛵
