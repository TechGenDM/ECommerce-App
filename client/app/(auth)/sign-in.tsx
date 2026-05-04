import { useSignIn } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants'
import Toast from 'react-native-toast-message'

export default function SignIn() {
  const { signIn, setActive, isLoaded } = useSignIn()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const onSignInPress = async () => {
    if (!isLoaded) return

    setLoading(true)
    try {
      const completeSignIn = await signIn.create({
        identifier: emailAddress,
        password,
      })

      // This is an important step,
      // This indicates the user is signed in
      await setActive({ session: completeSignIn.createdSessionId })
      router.replace('/')
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      Toast.show({
        type: 'error',
        text1: 'Sign In Failed',
        text2: err.errors?.[0]?.message || 'Invalid email or password'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
          
          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
              <Ionicons name="person" size={40} color={COLORS.primary} />
            </View>
            <Text className="text-3xl font-bold text-primary mb-2">Welcome Back</Text>
            <Text className="text-secondary text-center px-4">Sign in to continue your shopping journey with us.</Text>
          </View>

          <View className="mb-6">
            <Text className="text-primary font-medium mb-2 ml-1">Email Address</Text>
            <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 h-14 mb-4 shadow-sm">
              <Ionicons name="mail-outline" size={20} color={COLORS.secondary} />
              <TextInput
                className="flex-1 ml-3 text-primary text-base"
                autoCapitalize="none"
                value={emailAddress}
                placeholder="Enter your email"
                placeholderTextColor="#9ca3af"
                onChangeText={setEmailAddress}
                keyboardType="email-address"
              />
            </View>

            <Text className="text-primary font-medium mb-2 ml-1">Password</Text>
            <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 h-14 shadow-sm">
              <Ionicons name="lock-closed-outline" size={20} color={COLORS.secondary} />
              <TextInput
                className="flex-1 ml-3 text-primary text-base"
                value={password}
                placeholder="Enter your password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2 -mr-2">
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.secondary} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity className="self-end mt-4">
              <Text className="text-primary font-bold">Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className={`bg-primary h-14 rounded-full items-center justify-center shadow-md mb-6 ${(!emailAddress || !password) ? 'opacity-70' : ''}`}
            onPress={onSignInPress}
            disabled={!emailAddress || !password || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Sign In</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-auto pb-4">
            <Text className="text-secondary">Don't have an account? </Text>
            <Link href="/sign-up" asChild>
              <TouchableOpacity>
                <Text className="text-primary font-bold">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}