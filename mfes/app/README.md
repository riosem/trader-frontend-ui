# Trading Platform - App Shell

## Overview

The main application shell that orchestrates the trading platform's microfrontend architecture. This serves as the container application that loads and integrates the Authentication and Positions microfrontends using Webpack Module Federation.

## Architecture

This app shell:
- Provides the main navigation and layout
- Loads remote microfrontends dynamically
- Manages shared state and routing
- Handles error boundaries for remote modules

## Module Federation Configuration

The app shell consumes the following remote modules:
- **Auth Service** (`auth@AUTH_SERVICE_URL/remoteEntry.js`)
- **Positions Service** (`positions@POSITIONS_SERVICE_URL/remoteEntry.js`)

## Development Setup

### Prerequisites
- Node.js 16+
- npm

### Installation
```bash
npm install
```

### Environment Variables
Create a `.env` file:
```env
AUTH_SERVICE_URL=http://localhost:3005
POSITIONS_SERVICE_URL=http://localhost:3006
```

### Development Server
```bash
npm start
# Runs on http://localhost:3007
```

**Note**: Make sure the Auth and Positions services are running on their respective ports before starting the app shell.

## Build for Production

```bash
npm run build
```

The build artifacts will be in the `dist/` folder, ready for deployment to S3/CloudFront.

## Key Features

- **Microfrontend Orchestration**: Dynamic loading of remote modules
- **Shared Navigation**: Unified navigation across all services
- **Error Boundaries**: Graceful handling of remote module failures
- **Responsive Layout**: Mobile-first responsive design
- **Theme Management**: Global theme provider for consistent styling

## File Structure

```
src/
├── components/
│   ├── Layout/              # Main layout components
│   ├── Navigation/          # Navigation components
│   └── ErrorBoundary/       # Error handling
├── pages/                   # Application pages
├── hooks/                   # Custom React hooks
├── utils/                   # Utility functions
└── index.js                 # Application entry point
```

## Deployment

The app shell is deployed to AWS S3 and served via CloudFront. See the main [DEPLOYMENT.md](../../DEPLOYMENT.md) for detailed instructions.

## Module Federation Details

### Exposed Modules
Currently, the app shell doesn't expose any modules but could expose shared components or utilities in the future.

### Consumed Modules
- `auth/AuthProvider` - Authentication context and components
- `positions/Dashboard` - Trading dashboard and position management

### Shared Dependencies
- `react` - Singleton shared across all microfrontends
- `react-dom` - Singleton shared across all microfrontends

## Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Performance Considerations

- **Lazy Loading**: Remote modules are loaded on-demand
- **Code Splitting**: Route-based code splitting for optimal loading
- **Shared Dependencies**: React and React-DOM are shared to reduce bundle duplication
- **Preloading**: Critical remote modules can be preloaded for better performance

## Contributing

When working on the app shell:
1. Ensure changes don't break remote module loading
2. Test with both local and deployed remote services
3. Consider backward compatibility with different versions of remote modules
4. Update error boundaries for new remote modules

## Troubleshooting

### Common Issues

**Remote Module Loading Fails**
- Verify `AUTH_SERVICE_URL` and `POSITIONS_SERVICE_URL` are correct
- Check if remote services are running and accessible
- Ensure CORS is properly configured for cross-origin requests

**Build Errors**
- Clear node_modules and reinstall dependencies
- Verify webpack configuration matches remote module setup
- Check for version conflicts in shared dependencies

**Runtime Errors**
- Check browser console for detailed error messages
- Verify remote modules are built and deployed correctly
- Use network tab to check if remote entry files are loading

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
