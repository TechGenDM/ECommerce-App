// Polyfill/stub for ExpoCryptoAES native module.
// The native AES module (expo-crypto v55) is NOT available in Expo Go SDK 54.
// Clerk's token cache uses expo-secure-store directly; AES is never called.
// This stub uses CommonJS + __esModule flag so Babel interop resolves `.default`
// correctly when index.js does: import AesCryptoModule from './ExpoCryptoAES'
// and then: class AESEncryptionKey extends AesCryptoModule.EncryptionKey {}

class SealedData {
  static fromParts(_iv, _ciphertext, _tag) {
    return new SealedData();
  }
  static fromCombined(_combined, _config) {
    return new SealedData();
  }
}

class EncryptionKey {}

const ExpoCryptoAES = {
  EncryptionKey,
  SealedData,
  encryptAsync: async () => new SealedData(),
  decryptAsync: async () => new Uint8Array(),
};

// Use CJS + __esModule so that Babel's _interopRequireDefault resolves
// `import X from '...'` to ExpoCryptoAES (not a wrapper around it).
Object.defineProperty(module.exports, '__esModule', { value: true });
module.exports.default = ExpoCryptoAES;
module.exports.EncryptionKey = EncryptionKey;
module.exports.SealedData = SealedData;
