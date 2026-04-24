import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { HeaderProps } from '@/constants/types'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants'
import { useRouter } from 'expo-router'

export default function Header({title, showBack, showSearch, showCart, showMenu, showLogo}: HeaderProps) {

    const router = useRouter()
    const { itemsCount } = {itemsCount: 6}

  return (
    <View className='flex-row items-center justify-between px-4 py-3 bg-white'>

        {/* left side */}

      <View className='flex-row items-center flex-1'>

        {showBack && (
            <TouchableOpacity onPress={()=> router.back()} className='mr-3 '>
                <Ionicons name='arrow-back' size={24} color={COLORS.primary}/>
            </TouchableOpacity>
        )}

        {showMenu && (
            <TouchableOpacity className='mr-3 '>
                <Ionicons name='menu-outline' size={28} color={COLORS.primary}/>
            </TouchableOpacity>
        )}

        {showLogo ? (
            <View className='flex-1'>
                <Image source={require('@/assets/logo.png')} style={{width: "100%", height: 24}} resizeMode='contain'/> 
            </View>
        ) : title && (
            <Text className='text-xl font-bold text-primary text-center flex-1 mr-8'>
                {title}
            </Text>
        )}

        {(!title && !showSearch) && <View className='flex-1'/>}

      </View>

      {/* right side */}

      <View className='flex-row items-center gap-4'>

        {showSearch && (
        <TouchableOpacity>
            <Ionicons name='search-outline' size={24} color={COLORS.primary}/>
        </TouchableOpacity> 
        )}

        {showCart && (
            <TouchableOpacity onPress={()=> router.push('/(tabs)/cart')}>
                <View className='relative'>
                    <Ionicons name='bag-outline' size={24} color={COLORS.primary}/>
                    <View className='absolute -top-1 -right-1 bg-accent w-4 h-4 rounded-full'>
                        <Text className='text-white text-[10px] font-bold'>{itemsCount}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )}
      </View>
    </View>
  )
}