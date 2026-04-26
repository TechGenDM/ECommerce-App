import { View, Text, Image, TouchableOpacity } from 'react-native'
import React from 'react'
import { CartItemProps } from '@/constants/types'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants'

export default function CartItem({ item, onRemove, onUpdateQuantity }: CartItemProps) {

    const imageUrl = item.product.images[0]

    return (
        <View className='flex-row mb-4 bg-white p-3 rounded-xl'>
            <View className='w-20 h-20 bg-gray-100 rounded-lg overflow-hidden mr-3'>
                <Image source={{ uri: imageUrl }} className='w-full h-full' resizeMode='cover' />
            </View>

            <View className='flex-1 justify-between'>
                {/* product details */}
                <View className='flex-row justify-between items-start'>
                    <View>
                        <Text className='text-primary font-medium text-sm mb-1'>{item.product.name}</Text>
                        <Text className='text-secondary text-xs'>Size: {item.size}</Text>
                    </View>
                    <TouchableOpacity onPress={onRemove}>
                        <Ionicons name='close-circle-outline' size={20} color="#FF4C3B" />
                    </TouchableOpacity>
                </View>

                {/* price and quantity */}
                <View className='flex-row justify-between items-center mt-2'>
                    <Text className='text-primary font-bold text-base'>${item.product.price.toFixed(2)}</Text>
                    <View className='flex-row items-center bg-surface rounded-full px-2 py-1'>
                        <TouchableOpacity className='p-1'
                            onPress={() => onUpdateQuantity && onUpdateQuantity(item.quantity - 1)}
                        >
                            <Ionicons name='remove' size={16} color={COLORS.primary} />
                        </TouchableOpacity>

                        <Text className='text-primary font-medium mx-3'>{item.quantity}</Text>

                        <TouchableOpacity className='p-1'
                            onPress={() => onUpdateQuantity && onUpdateQuantity(item.quantity + 1)}
                        >
                            <Ionicons name='add' size={16} color={COLORS.primary} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}