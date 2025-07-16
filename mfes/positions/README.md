# Trading Platform - Positions Service

## Overview

The Positions microfrontend service manages trading positions, portfolio analytics, and market data visualization for the trading platform. Built with React and Chart.js, designed to be consumed by other microfrontends through Module Federation.

## Features

- **Portfolio Management**: Real-time position tracking and P&L calculation
- **Interactive Charts**: Advanced trading charts with Chart.js integration
- **Order Management**: Buy/sell order placement and execution tracking
- **Risk Analytics**: Position sizing, risk metrics, and exposure analysis
- **Real-time Data**: Live market data updates and price alerts
- **Module Federation**: Exposes position components to other microfrontends

## Architecture

This service is designed as a standalone microfrontend that:
- Manages all trading position state
- Provides real-time market data visualization
- Handles order placement and execution
- Exposes trading components via Module Federation
- Integrates with backend trading APIs

## Development Setup

### Prerequisites
- Node.js 16+
- npm
- Backend trading API (for real data)

### Installation
```bash
npm install
```

### Environment Variables

Create a `.env` file with the following variables:
```env
REACT_APP_API_BASE_URL=http://localhost:8000
REACT_APP_WEBSOCKET_URL=ws://localhost:8001
REACT_APP_ENVIRONMENT=development
```

### Development Server
```bash
npm start
# Runs on http://localhost:3006
```

## Build for Production

```bash
# With environment variables
REACT_APP_API_BASE_URL=https://api.your-domain.com \
REACT_APP_WEBSOCKET_URL=wss://ws.your-domain.com \
REACT_APP_ENVIRONMENT=production \
npm run build
```

## Module Federation

### Exposed Modules
- `./Dashboard` - Main trading dashboard
- `./PositionsList` - Positions table component
- `./TradingChart` - Interactive price chart
- `./OrderForm` - Buy/sell order form
- `./Portfolio` - Portfolio summary component

### Usage in Consuming Applications
```javascript
// In consuming microfrontend
import { Dashboard } from 'positions/Dashboard';
import { TradingChart } from 'positions/TradingChart';

function TradingApp() {
  return (
    <div>
      <TradingChart symbol="BTCUSD" />
      <Dashboard />
    </div>
  );
}
```

## API Reference

### Dashboard Component
Main trading dashboard with positions and charts.

**Props:**
- `userId` - User ID for position filtering
- `theme` - UI theme ('light' | 'dark')
- `onPositionClick` - Callback for position selection

### TradingChart Component
Interactive price chart with technical indicators.

**Props:**
- `symbol` - Trading symbol (e.g., 'BTCUSD')
- `timeframe` - Chart timeframe ('1m', '5m', '1h', '1d')
- `height` - Chart height in pixels
- `showIndicators` - Boolean to show/hide technical indicators

### PositionsList Component
Table displaying current positions.

**Props:**
- `positions` - Array of position objects
- `onPositionSelect` - Callback for position selection
- `sortBy` - Sort field ('symbol', 'pnl', 'size')

### OrderForm Component
Form for placing buy/sell orders.

**Props:**
- `symbol` - Trading symbol
- `orderType` - Order type ('market', 'limit', 'stop')
- `onOrderSubmit` - Callback for order submission

## File Structure

```
src/
├── components/
│   ├── Dashboard/           # Main dashboard component
│   ├── TradingChart/        # Chart components and config
│   ├── PositionsList/       # Position table and filters
│   ├── OrderForm/           # Order placement forms
│   └── Portfolio/           # Portfolio summary
├── hooks/
│   ├── usePositions.js      # Position data management
│   ├── useMarketData.js     # Real-time market data
│   ├── useWebSocket.js      # WebSocket connection
│   └── useOrders.js         # Order management
├── services/
│   ├── api.js               # API client
│   ├── websocket.js         # WebSocket service
│   └── calculations.js      # P&L and risk calculations
├── utils/
│   ├── formatters.js        # Number and currency formatting
│   ├── validators.js        # Input validation
│   └── constants.js         # Trading constants
└── index.js                 # Entry point and federation setup
```

## Chart Configuration

### Supported Chart Types
- **Candlestick Charts**: OHLC price data visualization
- **Line Charts**: Price trend visualization
- **Volume Charts**: Trading volume analysis
- **Technical Indicators**: RSI, MACD, Bollinger Bands, Moving Averages

### Chart Features
- **Zoom and Pan**: Interactive chart navigation
- **Crosshair**: Precise price and time selection
- **Annotations**: Order placement markers and alerts
- **Multiple Timeframes**: 1m, 5m, 15m, 1h, 4h, 1d, 1w
- **Real-time Updates**: Live price streaming

### Example Chart Usage
```javascript
import { TradingChart } from 'positions/TradingChart';

function ChartExample() {
  return (
    <TradingChart
      symbol="BTCUSD"
      timeframe="1h"
      height={400}
      showIndicators={true}
      indicators={['RSI', 'MACD']}
      onCrosshairMove={(data) => console.log(data)}
    />
  );
}
```

## Real-time Data Integration

### WebSocket Connection
```javascript
// Real-time price updates
const wsUrl = process.env.REACT_APP_WEBSOCKET_URL;
const ws = new WebSocket(`${wsUrl}/market-data`);

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  updateChartData(data);
};
```

### Data Flow
1. WebSocket connects to market data feed
2. Real-time price updates stream to chart
3. Position P&L updates automatically
4. Order book updates reflect market changes

## Trading Features

### Position Management
- **Open Positions**: View all active positions
- **P&L Tracking**: Real-time profit/loss calculation
- **Position Sizing**: Risk-based position sizing tools
- **Stop Loss/Take Profit**: Automated order management

### Order Types
- **Market Orders**: Immediate execution at current price
- **Limit Orders**: Execution at specified price or better
- **Stop Orders**: Conditional orders for risk management
- **OCO Orders**: One-Cancels-Other order pairs

### Risk Management
- **Portfolio Exposure**: Total exposure calculation
- **Risk Metrics**: VaR, Sharpe ratio, maximum drawdown
- **Margin Calculation**: Required margin for positions
- **Liquidation Prices**: Automatic liquidation level calculation

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

### Testing Strategy
- **Unit Tests**: Individual component testing
- **Integration Tests**: API and WebSocket integration
- **Visual Tests**: Chart rendering and interaction
- **E2E Tests**: Complete trading workflows

## Performance Optimization

### Chart Performance
- **Data Virtualization**: Efficient rendering of large datasets
- **Throttled Updates**: Controlled update frequency for smooth performance
- **Canvas Rendering**: High-performance chart rendering
- **Worker Threads**: Background calculations for indicators

### Bundle Optimization
- **Code Splitting**: Lazy loading of chart components
- **Tree Shaking**: Removal of unused chart features
- **Compression**: Gzip compression for production builds
- **CDN Integration**: Chart.js loaded from CDN when possible

## Deployment

The positions service is deployed to AWS S3 and served via CloudFront. See the main [DEPLOYMENT.md](../../DEPLOYMENT.md) for detailed instructions.

### Environment-Specific Configuration

**Development:**
```env
REACT_APP_API_BASE_URL=https://dev-api.your-domain.com
REACT_APP_WEBSOCKET_URL=wss://dev-ws.your-domain.com
REACT_APP_ENVIRONMENT=development
```

**Production:**
```env
REACT_APP_API_BASE_URL=https://api.your-domain.com
REACT_APP_WEBSOCKET_URL=wss://ws.your-domain.com
REACT_APP_ENVIRONMENT=production
```

## Troubleshooting

### Common Issues

**Chart Not Rendering**
- Verify Chart.js dependencies are installed
- Check canvas element is properly initialized
- Ensure data format matches chart expectations

**WebSocket Connection Fails**
- Verify WebSocket URL is correct
- Check network connectivity and firewall settings
- Ensure WebSocket server is running and accessible

**Real-time Updates Not Working**
- Check WebSocket connection status
- Verify message format matches expected schema
- Monitor browser console for error messages

**Module Federation Loading Errors**
- Verify webpack configuration exposes correct modules
- Check CORS configuration for cross-origin loading
- Ensure service is built and deployed correctly

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=positions:*
REACT_APP_DEBUG=true
```

## API Integration

### REST API Endpoints
- `GET /api/positions` - Fetch user positions
- `POST /api/orders` - Place new order
- `GET /api/market-data/:symbol` - Get market data
- `DELETE /api/orders/:id` - Cancel order

### WebSocket Channels
- `market-data` - Real-time price updates
- `user-positions` - Position updates
- `order-updates` - Order execution notifications

### Example API Usage
```javascript
// Fetch positions
const positions = await fetch('/api/positions', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
}).then(res => res.json());

// Place order
const order = await fetch('/api/orders', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    symbol: 'BTCUSD',
    side: 'buy',
    type: 'market',
    quantity: 0.1
  })
}).then(res => res.json());
```

## Contributing

When contributing to the positions service:
1. Ensure backward compatibility with consuming applications
2. Test trading workflows thoroughly
3. Consider performance implications of chart updates
4. Update exposed module interfaces carefully
5. Follow financial data handling best practices

## Security Considerations

- **API Authentication**: All API calls require valid JWT tokens
- **Data Validation**: Input validation for all trading parameters
- **Rate Limiting**: Protection against excessive API requests
- **Audit Logging**: All trading actions are logged for compliance