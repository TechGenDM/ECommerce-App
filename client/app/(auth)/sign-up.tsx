import { useSignUp } from '@clerk/clerk-expo'
import { Link, useRouter } from 'expo-router'
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants'
import Toast from 'react-native-toast-message'

export default function SignUp() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()

  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [pendingVerification, setPendingVerification] = useState(false)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const onSignUpPress = async () => {
    if (!isLoaded) return

    setLoading(true)
    try {
      await signUp.create({
        emailAddress,
        password,
      })

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })

      setPendingVerification(true)
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed',
        text2: err.errors?.[0]?.message || 'An error occurred during sign up'
      })
    } finally {
      setLoading(false)
    }
  }

  const onPressVerify = async () => {
    if (!isLoaded) return

    setLoading(true)
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      })

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId })
        router.replace('/')
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2))
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: 'Please try again.'
        })
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2))
      Toast.show({
        type: 'error',
        text1: 'Verification Failed',
        text2: err.errors?.[0]?.message || 'Invalid verification code'
      })
    } finally {
      setLoading(false)
    }
  }

  if (pendingVerification) {
    return (
      <SafeAreaView className="flex-1 bg-surface" edges={['top', 'bottom']}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
          <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>
            
            <View className="items-center mb-8">
              <View className="w-20 h-20 bg-primary/10 rounded-full items-center justify-center mb-4">
                <Ionicons name="mail-unread" size={40} color={COLORS.primary} />
              </View>
              <Text className="text-3xl font-bold text-primary mb-2">Verify Email</Text>
              <Text className="text-secondary text-center px-4">
                We've sent a verification code to {emailAddress}. Please enter it below.
              </Text>
            </View>

            <View className="mb-6">
              <Text className="text-primary font-medium mb-2 ml-1">Verification Code</Text>
              <View className="flex-row items-center bg-white border border-gray-200 rounded-2xl px-4 h-14 mb-4 shadow-sm">
                <Ionicons name="keypad-outline" size={20} color={COLORS.secondary} />
                <TextInput
                  className="flex-1 ml-3 text-primary text-lg tracking-widest font-bold"
                  value={code}
                  placeholder="123456"
                  placeholderTextColor="#9ca3af"
                  onChangeText={setCode}
                  keyboardType="numeric"
                  maxLength={6}
                />
              </View>
            </View>

            <TouchableOpacity
              className={`bg-primary h-14 rounded-full items-center justify-center shadow-md mb-6 ${(!code || code.length < 6) ? 'opacity-70' : ''}`}
              onPress={onPressVerify}
              disabled={!code || code.length < 6 || loading}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white font-bold text-lg">Verify & Continue</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity className="items-center" onPress={() => setPendingVerification(false)}>
              <Text className="text-secondary font-medium">Change Email</Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
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
              <Ionicons name="person-add" size={40} color={COLORS.primary} />
            </View>
            <Text className="text-3xl font-bold text-primary mb-2">Create Account</Text>
            <Text className="text-secondary text-center px-4">Join us today and explore the best products!</Text>
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
                placeholder="Create a password"
                placeholderTextColor="#9ca3af"
                secureTextEntry={!showPassword}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-2 -mr-2">
                <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color={COLORS.secondary} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            className={`bg-primary h-14 rounded-full items-center justify-center shadow-md mb-6 ${(!emailAddress || !password) ? 'opacity-70' : ''}`}
            onPress={onSignUpPress}
            disabled={!emailAddress || !password || loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Sign Up</Text>
            )}
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mt-auto pb-4">
            <Text className="text-secondary">Already have an account? </Text>
            <Link href="/sign-in" asChild>
              <TouchableOpacity>
                <Text className="text-primary font-bold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}