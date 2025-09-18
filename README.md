# Vehicles & Vessels Dashboard

A modern, responsive dashboard for exotic car and yacht brokerage businesses. This dashboard integrates with n8n workflows via webhooks to provide real-time business metrics and analytics.

## Features

- **Real-time Statistics**: Track vehicles and vessels in inventory vs. listed
- **Financial Metrics**: Monitor commissions, average prices, and total inventory value
- **Sales Analytics**: Visualize sales trends with interactive charts
- **Webhook Integration**: Receive live updates from n8n workflows
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with luxury branding

## Key Metrics Tracked

- Total vehicles in inventory
- Total vehicles listed
- Total vessels in inventory  
- Total vessels listed
- Total possible commission
- Average commission per item
- Average vehicle price
- Average vessel price
- Total inventory value
- Monthly, quarterly, and yearly sales

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone or download this project
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Webhook Configuration

### n8n Webhook Setup

The dashboard accepts webhooks at the following endpoint:
```
POST /api/webhooks/n8n
```

### Webhook Payload Structure

The webhook expects a JSON payload with the following structure:

```json
{
  "type": "vehicle" | "vessel" | "sale" | "listing",
  "action": "create" | "update" | "delete" | "status_change",
  "data": {
    // Vehicle or Vessel object, or sale/listing data
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Vehicle Object Structure

```json
{
  "id": "unique-vehicle-id",
  "make": "Ferrari",
  "model": "488 GTB", 
  "year": 2020,
  "price": 250000,
  "commission": 12500,
  "status": "inventory" | "listed" | "sold" | "pending",
  "imageUrl": "https://example.com/image.jpg",
  "description": "Beautiful Ferrari 488 GTB in Rosso Corsa",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Vessel Object Structure

```json
{
  "id": "unique-vessel-id",
  "name": "Ocean Dream",
  "type": "yacht" | "sailboat" | "motorboat",
  "length": 85,
  "price": 2500000,
  "commission": 125000,
  "status": "inventory" | "listed" | "sold" | "pending",
  "imageUrl": "https://example.com/image.jpg", 
  "description": "Luxury 85ft yacht with 5 cabins",
  "createdAt": "2024-01-01T00:00:00.000Z",
  "updatedAt": "2024-01-01T00:00:00.000Z"
}
```

### Webhook Examples

#### Adding a New Vehicle
```json
{
  "type": "vehicle",
  "action": "create",
  "data": {
    "id": "ferrari-001",
    "make": "Ferrari",
    "model": "488 GTB",
    "year": 2020,
    "price": 250000,
    "commission": 12500,
    "status": "inventory",
    "description": "Beautiful Ferrari 488 GTB",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Updating Vehicle Status
```json
{
  "type": "vehicle", 
  "action": "status_change",
  "data": {
    "id": "ferrari-001",
    "status": "listed"
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### Recording a Sale
```json
{
  "type": "sale",
  "action": "create", 
  "data": {
    "itemId": "ferrari-001",
    "itemType": "vehicle",
    "salePrice": 250000,
    "commission": 12500
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## n8n Workflow Examples

### Basic Vehicle Management Workflow

1. **Trigger**: Manual trigger or scheduled
2. **HTTP Request**: POST to `/api/webhooks/n8n`
3. **Payload**: Vehicle data as shown above

### CRM Integration Workflow

1. **Trigger**: New lead in CRM
2. **Data Processing**: Transform CRM data to vehicle format
3. **HTTP Request**: POST to dashboard webhook
4. **Notification**: Send confirmation email

### Inventory Sync Workflow

1. **Trigger**: Inventory management system webhook
2. **Data Mapping**: Map inventory data to dashboard format
3. **HTTP Request**: POST to dashboard webhook
4. **Logging**: Record sync status

## API Endpoints

### GET /api/stats
Returns current dashboard statistics.

**Response:**
```json
{
  "totalVehiclesInInventory": 1,
  "totalVehiclesListed": 2,
  "totalVesselsInInventory": 1,
  "totalVesselsListed": 1,
  "totalPossibleCommission": 162500,
  "averageCommission": 32500,
  "averageVehiclePrice": 250000,
  "averageVesselPrice": 1475000,
  "totalInventoryValue": 1975000,
  "monthlySales": 12,
  "quarterlySales": 45,
  "yearlySales": 180
}
```

### GET /api/webhooks/n8n
Webhook health check endpoint.

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Environment Variables

No environment variables are required for basic functionality. For production:

- `NEXT_PUBLIC_API_URL`: Your deployed API URL
- `WEBHOOK_SECRET`: Optional webhook authentication secret

## Customization

### Adding New Metrics

1. Update `types/dashboard.ts` with new metric types
2. Modify `lib/data.ts` to calculate new metrics
3. Add new StatCard components to `app/page.tsx`

### Styling

The dashboard uses Tailwind CSS with custom luxury-themed colors. Modify `tailwind.config.js` to adjust the color scheme.

### Charts

Charts are built with Recharts. Add new chart components in the `components/` directory.

## Troubleshooting

### Webhook Not Working

1. Check the webhook URL is correct
2. Verify the payload structure matches the expected format
3. Check browser network tab for error responses
4. Review server logs for detailed error messages

### Data Not Updating

1. Ensure webhooks are being sent successfully
2. Check that the dashboard is polling the API (every 30 seconds)
3. Verify the data structure in `lib/data.ts`

### Performance Issues

1. Reduce polling frequency if needed
2. Implement data pagination for large datasets
3. Add caching for frequently accessed data

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the webhook payload examples
3. Verify your n8n workflow configuration

## License

This project is licensed under the MIT License.
