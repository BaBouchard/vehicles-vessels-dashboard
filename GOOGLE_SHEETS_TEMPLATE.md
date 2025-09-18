# Google Sheets Template

## 📊 Sample Google Sheets Setup

Copy this template to create your inventory management spreadsheet.

### **Sheet 1: Vehicles**

| A: ID | B: Make | C: Model | D: Year | E: Price | F: Commission | G: Status | H: Description | I: Image URL | J: Created | K: Updated |
|-------|---------|----------|---------|----------|---------------|-----------|----------------|--------------|-----------|-----------|
| VEH-001 | Ferrari | SF90 Stradale | 2023 | 450000 | 22500 | inventory | Hybrid supercar with 1000hp | https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop | 2024-01-01 | 2024-01-01 |
| VEH-002 | Lamborghini | Aventador SVJ | 2022 | 520000 | 26000 | listed | Track-focused supercar | https://images.unsplash.com/photo-1544829099-b9a0cccf1c8e?w=400&h=300&fit=crop | 2024-01-02 | 2024-01-02 |
| VEH-003 | McLaren | 720S | 2023 | 320000 | 16000 | inventory | British supercar excellence | https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop | 2024-01-03 | 2024-01-03 |
| VEH-004 | Porsche | 911 GT3 RS | 2023 | 280000 | 14000 | listed | Track-ready 911 | https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&h=300&fit=crop | 2024-01-04 | 2024-01-04 |
| VEH-005 | Aston Martin | DB11 | 2022 | 220000 | 11000 | inventory | Luxury grand tourer | https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop | 2024-01-05 | 2024-01-05 |

### **Sheet 2: Vessels**

| A: ID | B: Name | C: Type | D: Length | E: Price | F: Commission | G: Status | H: Description | I: Image URL | J: Created | K: Updated |
|-------|---------|---------|-----------|----------|---------------|-----------|----------------|--------------|-----------|-----------|
| VES-001 | Ocean Explorer | yacht | 95 | 4200000 | 210000 | inventory | Luxury yacht with helipad | https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop | 2024-01-01 | 2024-01-01 |
| VES-002 | Sea Dream | yacht | 78 | 3200000 | 160000 | listed | Family luxury yacht | https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop | 2024-01-02 | 2024-01-02 |
| VES-003 | Wave Rider | yacht | 65 | 2800000 | 140000 | inventory | Sport yacht for speed | https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop | 2024-01-03 | 2024-01-03 |
| VES-004 | Blue Horizon | yacht | 85 | 3800000 | 190000 | listed | Ocean-going luxury | https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop | 2024-01-04 | 2024-01-04 |
| VES-005 | Sunset Cruiser | yacht | 72 | 2900000 | 145000 | inventory | Perfect for sunset cruises | https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop | 2024-01-05 | 2024-01-05 |

### **Sheet 3: Sales**

| A: Sale ID | B: Item ID | C: Item Type | D: Sale Price | E: Commission | F: Buyer Name | G: Sale Date | H: Notes |
|------------|------------|--------------|---------------|---------------|---------------|--------------|----------|
| SALE-001 | VEH-003 | vehicle | 320000 | 16000 | John Smith | 2024-01-15 | Cash sale |
| SALE-002 | VES-005 | vessel | 2900000 | 145000 | Sarah Johnson | 2024-01-16 | Financing approved |

## 🔧 Column Descriptions

### **Vehicles Sheet:**
- **ID**: Unique identifier (VEH-001, VEH-002, etc.)
- **Make**: Car manufacturer (Ferrari, Lamborghini, etc.)
- **Model**: Specific model name (SF90 Stradale, Aventador SVJ, etc.)
- **Year**: Manufacturing year (2022, 2023, etc.)
- **Price**: Selling price in USD
- **Commission**: Your commission amount
- **Status**: inventory, listed, sold, pending
- **Description**: Brief description of the vehicle
- **Image URL**: Link to vehicle photo
- **Created**: Date added to inventory
- **Updated**: Last modification date

### **Vessels Sheet:**
- **ID**: Unique identifier (VES-001, VES-002, etc.)
- **Name**: Vessel name (Ocean Explorer, Sea Dream, etc.)
- **Type**: yacht, boat, sailboat, etc.
- **Length**: Length in feet
- **Price**: Selling price in USD
- **Commission**: Your commission amount
- **Status**: inventory, listed, sold, pending
- **Description**: Brief description of the vessel
- **Image URL**: Link to vessel photo
- **Created**: Date added to inventory
- **Updated**: Last modification date

### **Sales Sheet:**
- **Sale ID**: Unique sale identifier (SALE-001, SALE-002, etc.)
- **Item ID**: Reference to vehicle or vessel ID
- **Item Type**: vehicle or vessel
- **Sale Price**: Final selling price
- **Commission**: Commission earned
- **Buyer Name**: Customer name
- **Sale Date**: Date of sale completion
- **Notes**: Additional sale information

## 📋 Status Values

### **Valid Status Options:**
- **inventory**: Available for sale
- **listed**: Listed for sale
- **sold**: Sale completed
- **pending**: Sale in progress
- **reserved**: Reserved for customer
- **maintenance**: Under maintenance

## 🖼️ Image URLs

### **Sample Image Sources:**
- **Unsplash**: https://images.unsplash.com/photo-[ID]?w=400&h=300&fit=crop
- **Your own photos**: Upload to Google Drive and share
- **Dealer photos**: Use provided images
- **Stock photos**: Use professional stock images

## 📝 Data Entry Tips

### **Best Practices:**
1. **Use consistent IDs** (VEH-001, VES-001, SALE-001)
2. **Keep descriptions brief** but informative
3. **Use proper date format** (YYYY-MM-DD)
4. **Include commission calculations** (typically 5% of price)
5. **Update status regularly** as items move through sales process
6. **Add high-quality images** for better presentation
7. **Keep prices current** and competitive

### **Data Validation:**
- **Prices**: Must be positive numbers
- **Years**: Must be reasonable (2000-2030)
- **Status**: Must match valid options
- **IDs**: Must be unique within each sheet
- **Dates**: Must be valid dates

## 🔄 Real-Time Updates

### **How It Works:**
1. **Edit your Google Sheet** with new data
2. **Dashboard automatically syncs** every 5 minutes
3. **Manual sync button** for immediate updates
4. **Webhook integration** for instant updates
5. **Error handling** for failed syncs

### **Sync Features:**
- ✅ **Automatic sync** every 5 minutes
- ✅ **Manual sync** button in dashboard
- ✅ **Real-time updates** via webhooks
- ✅ **Error notifications** for failed syncs
- ✅ **Data validation** before updating
- ✅ **Backup and restore** capabilities

## 🚀 Quick Start

### **Step 1: Create Google Sheet**
1. Go to [Google Sheets](https://sheets.google.com)
2. Create new spreadsheet
3. Name it "Vehicles & Vessels Inventory"
4. Create 3 sheets: Vehicles, Vessels, Sales

### **Step 2: Copy Template Data**
1. Copy the sample data above
2. Paste into your sheets
3. Customize with your actual inventory
4. Add your own images

### **Step 3: Configure Dashboard**
1. Get your Google Sheet ID from URL
2. Set up Google Sheets API access
3. Add environment variables
4. Test sync functionality

### **Step 4: Start Managing**
1. Add new vehicles/vessels
2. Update prices and status
3. Record sales
4. Monitor dashboard updates

Your inventory will now sync live with your dashboard! 🚗⛵✨
