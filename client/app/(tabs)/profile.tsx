import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { dummyUser } from '@/assets/assets'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '@/components/Header'
import { Ionicons } from '@expo/vector-icons'
import { COLORS, PROFILE_MENU } from '@/constants'

export default function Profile() {

  const {user} = {user: dummyUser}
  const router = useRouter()

  const handleLogout = () => {
    console.log("Logout pressed")
  }

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <Header title='Profile' />

      <ScrollView className="flex-1 px-4 mt-2" showsVerticalScrollIndicator={false}>
        {/* User Info Section */}
        <View className="items-center mt-6 mb-8">
          <View className="relative">
            <Image 
              source={{uri: user.imageUrl}} 
              className="w-28 h-28 rounded-full border-4 border-white"
            />
            <TouchableOpacity className="absolute bottom-0 right-0 bg-primary w-8 h-8 rounded-full items-center justify-center border-2 border-white shadow-sm">
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text className="text-2xl font-bold text-primary mt-4">{user.name}</Text>
          <Text className="text-secondary text-base">{user.email}</Text>

          {/* Admin Panel Button - only shown for admin users */}
          {user.publicMetadata?.role === 'admin' && (
            <TouchableOpacity
              onPress={() => router.push('/admin')}
              className="mt-4 flex-row items-center bg-primary px-6 py-2.5 rounded-full shadow-sm"
            >
              <Ionicons name="shield-checkmark-outline" size={18} color="white" />
              <Text className="text-white font-bold text-sm ml-2">Admin Panel</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Profile Stats / Quick Info */}
        <View className="flex-row justify-between bg-white p-4 rounded-2xl mb-8 shadow-sm">
          <View className="items-center flex-1 border-r border-border">
            <Text className="text-xl font-bold text-primary">12</Text>
            <Text className="text-secondary text-sm">Orders</Text>
          </View>
          <View className="items-center flex-1 border-r border-border">
            <Text className="text-xl font-bold text-primary">3</Text>
            <Text className="text-secondary text-sm">Addresses</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-xl font-bold text-primary">8</Text>
            <Text className="text-secondary text-sm">Reviews</Text>
          </View>
        </View>

        {/* Menu Items Section */}
        <View className="bg-white rounded-2xl p-2 mb-6 shadow-sm">
          {PROFILE_MENU.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              onPress={() => router.push(item.route as any)}
              className={`flex-row items-center justify-between p-4 ${index !== PROFILE_MENU.length - 1 ? 'border-b border-border' : ''}`}
            >
              <View className="flex-row items-center gap-4">
                <View className="bg-surface p-2 rounded-full">
                  <Ionicons name={item.icon as any} size={24} color={COLORS.primary} />
                </View>
                <Text className="text-primary text-base font-medium">{item.title}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color={COLORS.secondary} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Support Section */}
        <View className="bg-white rounded-2xl p-2 mb-6 shadow-sm">
          <TouchableOpacity 
            className="flex-row items-center justify-between p-4 border-b border-border"
          >
            <View className="flex-row items-center gap-4">
              <View className="bg-surface p-2 rounded-full">
                <Ionicons name="help-circle-outline" size={24} color={COLORS.primary} />
              </View>
              <Text className="text-primary text-base font-medium">Help & Support</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.secondary} />
          </TouchableOpacity>
          <TouchableOpacity 
            className="flex-row items-center justify-between p-4"
          >
            <View className="flex-row items-center gap-4">
              <View className="bg-surface p-2 rounded-full">
                <Ionicons name="information-circle-outline" size={24} color={COLORS.primary} />
              </View>
              <Text className="text-primary text-base font-medium">About App</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.secondary} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          onPress={handleLogout}
          className="flex-row items-center justify-center bg-white py-4 rounded-2xl mb-8 border border-red-100 shadow-sm"
        >
          <Ionicons name="log-out-outline" size={24} color={COLORS.error || "#FF4444"} />
          <Text className="text-[#FF4444] font-bold text-base ml-2">Log Out</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  )
}