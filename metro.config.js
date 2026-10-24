// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Unify Backend API & AI Agents into the single Metro port 8081
let backendApp = null;

config.server = {
  ...config.server,
  enhanceMiddleware: (metroMiddleware) => {
    return (req, res, next) => {
      // Intercept and handle all /api calls directly on port 8081
      if (req.url && (req.url.startsWith('/api/') || req.url === '/api')) {
        if (!backendApp) {
          try {
            backendApp = require('./backend/server');
          } catch (err) {
            res.statusCode = 500;
            return res.end(JSON.stringify({ error: 'Backend server not available', detail: err.message }));
          }
        }
        return backendApp(req, res, next);
      }
      return metroMiddleware(req, res, next);
    };
  },
};

module.exports = config;
