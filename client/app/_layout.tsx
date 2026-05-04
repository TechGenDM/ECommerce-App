import { Stack } from "expo-router";
import '@/global.css'
import { CartProvider } from "@/context/CartContext";
import { WishlistProvider } from "@/context/WishlistContext";
import {GestureHandlerRootView} from 'react-native-gesture-handler'
import Toast from "react-native-toast-message";
import { ClerkProvider } from '@clerk/clerk-expo';
import { tokenCache } from '@clerk/clerk-expo/token-cache';

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

if (!publishableKey) {
  throw new Error(
    'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
  )
}

export default function RootLayout() {

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
        <CartProvider>
          <WishlistProvider>
            <Stack screenOptions={{headerShown: false}}/>
            <Toast />
          </WishlistProvider>
        </CartProvider>
      </ClerkProvider>
    </GestureHandlerRootView>
  )

}
