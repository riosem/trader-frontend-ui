# Trading Platform - Authentication Service

## Overview

The Authentication microfrontend service handles user authentication, authorization, and session management for the trading platform. Built with Auth0 integration and designed to be consumed by other microfrontends through Module Federation.

## Features

- **Auth0 Integration**: Enterprise-grade authentication
- **JWT Token Management**: Secure token handling and refresh
- **Session Management**: Automatic login/logout and session persistence
- **Role-based Access**: Different permissions for different user types
- **Module Federation**: Exposes authentication components to other microfrontends

## Architecture

This service is designed as a standalone microfrontend that:
- Manages all authentication state
- Provides authentication context to consuming applications
- Handles OAuth flows and token management
- Exposes authentication components via Module Federation

## Development Setup

### Prerequisites
- Node.js 16+
- npm
- Auth0 account and application configured

### Installation
```bash
npm install
```

### Environment Variables

Create a `.env` file with the following variables:
```env
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_SCOPE=openid profile email
PROXY_API_BASE_URL=http://localhost:8000
```

### Auth0 Configuration

1. Create a Single Page Application in Auth0
2. Configure the following URLs:
   - **Allowed Callback URLs**: `http://localhost:3005/callback, https://your-domain.com/callback`
   - **Allowed Logout URLs**: `http://localhost:3005, https://your-domain.com`
   - **Allowed Web Origins**: `http://localhost:3005, https://your-domain.com`

### Development Server
```bash
npm start
# Runs on http://localhost:3005
```

## Build for Production

```bash
# With environment variables
AUTH0_DOMAIN=prod-tenant.auth0.com \
AUTH0_CLIENT_ID=prod-client-id \
AUTH0_SCOPE="openid profile email" \
PROXY_API_BASE_URL=https://api.your-domain.com \
npm run build
```

## Module Federation

### Exposed Modules
- `./AuthProvider` - Main authentication context provider
- `./LoginButton` - Login button component
- `./LogoutButton` - Logout button component
- `./UserProfile` - User profile component

### Usage in Consuming Applications
```javascript
// In consuming microfrontend
import { AuthProvider } from 'auth/AuthProvider';
import { LoginButton } from 'auth/LoginButton';

function App() {
  return (
    <AuthProvider>
      <div>
        <LoginButton />
        {/* Your app content */}
      </div>
    </AuthProvider>
  );
}
```

## API Reference

### AuthProvider
Provides authentication context to child components.

**Props:**
- `children` - React children to wrap with auth context

**Context Values:**
- `isAuthenticated` - Boolean indicating if user is logged in
- `user` - User object with profile information
- `login` - Function to initiate login flow
- `logout` - Function to log out user
- `getAccessTokenSilently` - Function to get access token for API calls

### Example Usage
```javascript
import { useAuth } from 'auth/AuthProvider';

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <button onClick={login}>Login</button>;
  }
  
  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

## File Structure

```
src/
├── components/
│   ├── AuthProvider.js      # Main auth context provider
│   ├── LoginButton.js       # Login button component
│   ├── LogoutButton.js      # Logout button component
│   └── UserProfile.js       # User profile display
├── hooks/
│   └── useAuth.js           # Custom auth hook
├── utils/
│   └── auth.js              # Auth utility functions
└── index.js                 # Entry point and federation setup
```

## Security Considerations

### Token Management
- Access tokens are stored in memory (not localStorage)
- Automatic token refresh before expiration
- Secure logout clears all authentication state

### HTTPS Requirements
- Production deployment requires HTTPS for Auth0 callbacks
- Secure cookies used in production environment
- CSP headers configured for Auth0 domains

### CORS Configuration
- Proper CORS setup for cross-origin module federation
- Auth0 domains whitelisted for authentication flows

## Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### Testing Authentication
- Mock Auth0 provider for unit tests
- Integration tests with test Auth0 tenant
- E2E tests covering complete auth flows

## Deployment

The authentication service is deployed to AWS S3 and served via CloudFront. See the main [DEPLOYMENT.md](../../DEPLOYMENT.md) for detailed instructions.

### Environment-Specific Configuration

**Development:**
```env
AUTH0_DOMAIN=dev-tenant.auth0.com
AUTH0_CLIENT_ID=dev-client-id
PROXY_API_BASE_URL=https://dev-api.your-domain.com
```

**Production:**
```env
AUTH0_DOMAIN=prod-tenant.auth0.com
AUTH0_CLIENT_ID=prod-client-id
PROXY_API_BASE_URL=https://api.your-domain.com
```

## Performance Optimization

- **Lazy Loading**: Authentication components loaded on-demand
- **Token Caching**: Efficient token management with caching
- **Bundle Splitting**: Separate bundles for different auth flows
- **Shared Dependencies**: React shared with other microfrontends

## Troubleshooting

### Common Issues

**Auth0 Login Redirect Fails**
- Verify callback URLs in Auth0 dashboard
- Check that domain and client ID are correct
- Ensure HTTPS is used for production

**Module Federation Loading Errors**
- Verify webpack configuration exposes correct modules
- Check CORS configuration for cross-origin loading
- Ensure service is built and deployed correctly

**Token Refresh Issues**
- Check Auth0 token expiration settings
- Verify refresh token configuration
- Monitor network requests for auth errors

### Debug Mode
Enable debug logging by setting:
```env
DEBUG=auth:*
```

## Contributing

When contributing to the auth service:
1. Ensure backward compatibility with consuming applications
2. Test authentication flows thoroughly
3. Update exposed module interfaces carefully
4. Consider security implications of all changes

## Security Reporting

For security issues, please follow responsible disclosure:
1. Do not create public GitHub issues for security vulnerabilities
2. Email security concerns to the maintainers
3. Provide detailed reproduction steps
4. Allow time for security patches before public disclosure

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

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
