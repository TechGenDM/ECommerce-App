const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

const config = getDefaultConfig(__dirname)

// Redirect the broken ExpoCryptoAES native module to a safe stub.
// The native AES module is not available in Expo Go (SDK 54).
// Clerk only needs expo-secure-store for token caching, not AES.
config.resolver = config.resolver || {};
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName.endsWith('ExpoCryptoAES')) {
    return {
      filePath: path.resolve(__dirname, 'utils/ExpoCryptoAES.stub.js'),
      type: 'sourceFile',
    };
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: './global.css' })