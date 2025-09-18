# CRM Integration Guide

## 🔗 Live CRM Integration for Vehicles & Vessels Dashboard

This guide shows you how to connect your CRM system to update your dashboard in real-time.

## 📋 Supported CRM Systems

### **Popular CRM Platforms:**
- **Salesforce** - Enterprise CRM
- **HubSpot** - Marketing & Sales CRM
- **Pipedrive** - Sales-focused CRM
- **Zoho CRM** - All-in-one business suite
- **Monday.com** - Work management platform
- **Airtable** - Database/spreadsheet hybrid
- **Custom CRM** - Your own system

## 🚀 Integration Methods

### **Method 1: Webhook Integration (Recommended)**

Your dashboard accepts webhooks at:
```
POST https://your-domain.com/api/webhooks/n8n
```

#### **Webhook Payload Examples:**

**Add New Vehicle:**
```json
{
  "type": "vehicle",
  "action": "create",
  "data": {
    "id": "crm-vehicle-123",
    "make": "Ferrari",
    "model": "SF90 Stradale",
    "year": 2023,
    "price": 450000,
    "commission": 22500,
    "status": "inventory",
    "description": "Hybrid supercar with 1000hp",
    "imageUrl": "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Update Vehicle Status:**
```json
{
  "type": "vehicle",
  "action": "status_change",
  "data": {
    "id": "crm-vehicle-123",
    "status": "listed"
  },
  "timestamp": "2024-01-15T11:00:00.000Z"
}
```

**Add New Vessel:**
```json
{
  "type": "vessel",
  "action": "create",
  "data": {
    "id": "crm-vessel-456",
    "name": "Ocean Explorer",
    "type": "yacht",
    "length": 95,
    "price": 4200000,
    "commission": 210000,
    "status": "inventory",
    "description": "Luxury yacht with helipad",
    "imageUrl": "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Record Sale:**
```json
{
  "type": "sale",
  "action": "create",
  "data": {
    "itemId": "crm-vehicle-123",
    "itemType": "vehicle",
    "salePrice": 450000,
    "commission": 22500,
    "buyerInfo": {
      "name": "John Smith",
      "email": "john@example.com"
    }
  },
  "timestamp": "2024-01-15T14:30:00.000Z"
}
```

## 🔧 CRM Setup Instructions

### **Salesforce Integration:**

1. **Create Custom Objects:**
   - Vehicle__c (Make, Model, Year, Price, Commission, Status)
   - Vessel__c (Name, Type, Length, Price, Commission, Status)

2. **Set up Process Builder:**
   - Trigger on record create/update
   - Call webhook endpoint
   - Include all required fields

3. **Webhook Configuration:**
   ```
   Endpoint: https://your-domain.com/api/webhooks/n8n
   Method: POST
   Content-Type: application/json
   ```

### **HubSpot Integration:**

1. **Create Custom Properties:**
   - Vehicle: Make, Model, Year, Price, Commission, Status
   - Vessel: Name, Type, Length, Price, Commission, Status

2. **Set up Workflows:**
   - Trigger: Contact/Deal property changes
   - Action: Send webhook
   - Include custom properties

3. **Webhook Setup:**
   ```
   URL: https://your-domain.com/api/webhooks/n8n
   Method: POST
   Authentication: Bearer token (optional)
   ```

### **Pipedrive Integration:**

1. **Create Custom Fields:**
   - Vehicle: Make, Model, Year, Price, Commission, Status
   - Vessel: Name, Type, Length, Price, Commission, Status

2. **Set up Webhooks:**
   - Go to Settings > Webhooks
   - Add webhook URL
   - Select events: deal.added, deal.updated

3. **Webhook Configuration:**
   ```
   URL: https://your-domain.com/api/webhooks/n8n
   Events: deal.added, deal.updated
   ```

## 🛠️ Using n8n for CRM Integration

### **n8n Workflow Examples:**

#### **Workflow 1: Salesforce to Dashboard**
```
1. Salesforce Trigger (Record Created/Updated)
2. Data Transformation (Map fields)
3. HTTP Request (POST to dashboard webhook)
4. Error Handling
```

#### **Workflow 2: HubSpot to Dashboard**
```
1. HubSpot Trigger (Contact/Deal Updated)
2. Filter (Only vehicles/vessels)
3. Data Mapping (Transform to dashboard format)
4. HTTP Request (POST to webhook)
5. Slack Notification (Success/Error)
```

#### **Workflow 3: Multiple CRM Sources**
```
1. Multiple Triggers (Salesforce, HubSpot, Pipedrive)
2. Merge Data
3. Deduplication
4. Data Validation
5. HTTP Request (POST to dashboard)
```

## 📊 Real-Time Updates

### **Dashboard Features:**
- **Auto-refresh** every 30 seconds
- **Webhook updates** appear immediately
- **Status changes** reflected in real-time
- **New inventory** appears instantly
- **Sales updates** show immediately

### **Update Types:**
- ✅ **New vehicles/vessels** added
- ✅ **Status changes** (inventory → listed → sold)
- ✅ **Price updates**
- ✅ **Commission changes**
- ✅ **Sale completions**
- ✅ **Inventory removals**

## 🔐 Security & Authentication

### **Webhook Security:**
```javascript
// Optional: Add webhook authentication
const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

app.post('/api/webhooks/n8n', (req, res) => {
  const signature = req.headers['x-webhook-signature'];
  if (!verifySignature(req.body, signature, WEBHOOK_SECRET)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  // Process webhook...
});
```

### **Rate Limiting:**
- **Max 100 requests/minute** per IP
- **Webhook validation** required
- **Error logging** for failed requests

## 🚨 Troubleshooting

### **Common Issues:**

1. **Webhook Not Firing:**
   - Check CRM webhook configuration
   - Verify endpoint URL
   - Test with webhook testing tools

2. **Data Not Updating:**
   - Check webhook payload format
   - Verify required fields
   - Check dashboard logs

3. **Authentication Errors:**
   - Verify webhook secret
   - Check headers format
   - Test authentication

### **Testing Tools:**
- **Webhook.site** - Test webhook endpoints
- **Postman** - Test API calls
- **n8n** - Visual workflow testing

## 📈 Advanced Features

### **Bulk Updates:**
```json
{
  "type": "bulk_update",
  "action": "create",
  "data": [
    { "id": "vehicle-1", "status": "listed" },
    { "id": "vehicle-2", "status": "sold" },
    { "id": "vessel-1", "price": 5000000 }
  ],
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

### **Analytics Integration:**
- **Sales tracking** from CRM
- **Commission reporting**
- **Inventory turnover** analysis
- **Performance metrics**

## 🎯 Next Steps

1. **Choose your CRM** system
2. **Set up webhook** endpoint
3. **Configure CRM** to send webhooks
4. **Test integration** with sample data
5. **Monitor dashboard** for real-time updates
6. **Set up error alerts** for failed webhooks

## 📞 Support

For integration help:
- Check dashboard logs at `/api/webhooks/n8n`
- Test webhook endpoint with sample data
- Verify CRM webhook configuration
- Contact support for custom integrations

Your dashboard will now update live as your CRM data changes! 🚗⛵✨
