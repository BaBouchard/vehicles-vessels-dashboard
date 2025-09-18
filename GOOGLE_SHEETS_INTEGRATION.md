# Google Sheets Integration Guide

## 📊 Live Google Sheets Integration for Vehicles & Vessels Dashboard

This guide shows you how to connect your Google Sheets to update your dashboard in real-time.

## 🚀 Quick Setup (5 Minutes)

### **Step 1: Create Your Google Sheet**

1. **Go to Google Sheets** and create a new spreadsheet
2. **Name it**: "Vehicles & Vessels Inventory"
3. **Create these sheets**:
   - `Vehicles` - For car inventory
   - `Vessels` - For yacht inventory
   - `Sales` - For completed sales

### **Step 2: Set Up Vehicle Sheet**

Create columns with these headers in row 1:
```
A: ID          B: Make        C: Model       D: Year
E: Price       F: Commission  G: Status      H: Description
I: Image URL   J: Created     K: Updated
```

**Sample Data:**
```
ID          Make      Model           Year  Price     Commission  Status     Description
VEH-001     Ferrari   SF90 Stradale  2023  450000    22500       inventory  Hybrid supercar
VEH-002     Lambo     Aventador      2022  380000    19000       listed     V12 masterpiece
VEH-003     McLaren   720S           2023  320000    16000       sold       Track-focused
```

### **Step 3: Set Up Vessel Sheet**

Create columns with these headers in row 1:
```
A: ID          B: Name           C: Type    D: Length
E: Price       F: Commission     G: Status  H: Description
I: Image URL   J: Created        K: Updated
```

**Sample Data:**
```
ID          Name            Type   Length  Price      Commission  Status     Description
VES-001     Ocean Explorer  yacht  95      4200000    210000      inventory  Luxury yacht
VES-002     Sea Dream       yacht  78      3200000    160000      listed     Family cruiser
VES-003     Wave Rider      yacht  65      2800000    140000      sold       Sport yacht
```

### **Step 4: Set Up Sales Sheet**

Create columns with these headers in row 1:
```
A: Sale ID     B: Item ID      C: Item Type  D: Sale Price
E: Commission  F: Buyer Name   G: Sale Date  H: Notes
```

## 🔧 Technical Integration

### **Method 1: Google Sheets API (Recommended)**

#### **Setup Google Sheets API:**

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing
3. **Enable Google Sheets API**
4. **Create credentials** (Service Account)
5. **Download JSON key file**
6. **Share your sheet** with the service account email

#### **Install Dependencies:**
```bash
npm install googleapis
```

#### **Environment Variables:**
Create `.env.local`:
```
GOOGLE_SHEETS_API_KEY=your_api_key_here
GOOGLE_SHEETS_SHEET_ID=your_sheet_id_here
GOOGLE_SHEETS_RANGE_VEHICLES=Vehicles!A:K
GOOGLE_SHEETS_RANGE_VESSELS=Vessels!A:K
GOOGLE_SHEETS_RANGE_SALES=Sales!A:H
```

### **Method 2: Google Apps Script (Simple)**

#### **Create Apps Script:**

1. **Open your Google Sheet**
2. **Go to Extensions > Apps Script**
3. **Paste this code**:

```javascript
function onEdit(e) {
  // Trigger when sheet is edited
  const sheet = e.source.getActiveSheet();
  const range = e.range;
  
  // Send webhook to your dashboard
  const webhookUrl = 'https://your-domain.com/api/webhooks/google-sheets';
  
  const payload = {
    type: 'sheet_update',
    sheet: sheet.getName(),
    range: range.getA1Notation(),
    values: range.getValues(),
    timestamp: new Date().toISOString()
  };
  
  UrlFetchApp.fetch(webhookUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload)
  });
}
```

## 📡 API Endpoints

### **Sync Data from Google Sheets:**
```
GET /api/sync/google-sheets
```

### **Webhook for Real-time Updates:**
```
POST /api/webhooks/google-sheets
```

## 🔄 Real-Time Updates

### **Automatic Sync:**
- **Every 5 minutes** - Automatic data sync
- **On sheet edit** - Instant updates via webhook
- **Manual refresh** - Button to sync now
- **Error handling** - Retry failed syncs

### **Update Types:**
- ✅ **New vehicles/vessels** added
- ✅ **Price changes** updated
- ✅ **Status changes** (inventory → listed → sold)
- ✅ **Commission updates**
- ✅ **Sales recorded**
- ✅ **Inventory removals**

## 🛠️ Implementation

### **Google Sheets Service:**
```typescript
// lib/googleSheets.ts
import { google } from 'googleapis';

export class GoogleSheetsService {
  private sheets: any;
  
  constructor() {
    const auth = new google.auth.GoogleAuth({
      keyFile: 'path/to/service-account-key.json',
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });
    
    this.sheets = google.sheets({ version: 'v4', auth });
  }
  
  async getVehicles() {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
      range: 'Vehicles!A:K'
    });
    
    return this.parseVehicleData(response.data.values);
  }
  
  async getVessels() {
    const response = await this.sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
      range: 'Vessels!A:K'
    });
    
    return this.parseVesselData(response.data.values);
  }
}
```

### **Sync API Endpoint:**
```typescript
// app/api/sync/google-sheets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { GoogleSheetsService } from '@/lib/googleSheets';
import { updateInventory } from '@/lib/data';

export async function GET(request: NextRequest) {
  try {
    const sheetsService = new GoogleSheetsService();
    
    const [vehicles, vessels] = await Promise.all([
      sheetsService.getVehicles(),
      sheetsService.getVessels()
    ]);
    
    // Update local data store
    updateInventory(vehicles, vessels);
    
    return NextResponse.json({
      success: true,
      vehicles: vehicles.length,
      vessels: vessels.length,
      lastSync: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to sync with Google Sheets' },
      { status: 500 }
    );
  }
}
```

## 📊 Dashboard Integration

### **Auto-Sync Features:**
- **Real-time updates** from Google Sheets
- **Manual sync button** in dashboard header
- **Sync status indicator** (last updated time)
- **Error notifications** for failed syncs
- **Offline mode** with cached data

### **Data Validation:**
- **Required fields** checked
- **Price format** validation
- **Status values** validated
- **Image URL** verification
- **Duplicate ID** prevention

## 🎯 Benefits of Google Sheets

### **Advantages:**
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

## 🚀 Getting Started

### **Quick Start (5 Minutes):**

1. **Create Google Sheet** with sample data
2. **Share sheet** with service account
3. **Add environment variables** to `.env.local`
4. **Restart dashboard** to load new data
5. **Test sync** with manual refresh button

### **Sample Sheet Template:**
I'll create a sample Google Sheet template you can copy and use immediately.

## 📞 Support

### **Common Issues:**
- **Permission errors** - Check sheet sharing
- **API limits** - Google has rate limits
- **Data format** - Ensure proper column headers
- **Sync failures** - Check internet connection

### **Testing:**
- **Manual sync** button in dashboard
- **Check logs** for error messages
- **Verify sheet** permissions
- **Test with sample data**

Your dashboard will now sync live with your Google Sheets! 📊✨

## 🔄 Migration from CRM

### **If you want to switch later:**
- **Export data** from Google Sheets
- **Import to CRM** system
- **Update webhook** endpoints
- **Test integration** with new system

Google Sheets is perfect for getting started and can easily scale to a full CRM later! 🚗⛵
