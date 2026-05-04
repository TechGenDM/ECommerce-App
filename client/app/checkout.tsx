import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Header from '@/components/Header'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants'
import { dummyAddress } from '@/assets/assets'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'expo-router'
import Toast from 'react-native-toast-message'

export default function Checkout() {
  const router = useRouter()
  const { cartTotal, cartItems } = useCart()
  const shippingFee = 2.00
  const total = cartTotal + shippingFee

  const [addresses, setAddresses] = useState<any[]>(dummyAddress)
  const [selectedAddress, setSelectedAddress] = useState(dummyAddress[0]?._id)
  const [selectedPayment, setSelectedPayment] = useState('Credit Card')

  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)

  // New Address State
  const [type, setType] = useState("Home");
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [addrState, setAddrState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [country, setCountry] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  const PAYMENT_METHODS = [
    { id: 'Credit Card', icon: 'card-outline' },
    { id: 'PayPal', icon: 'logo-paypal' },
    { id: 'Apple Pay', icon: 'logo-apple' },
  ]

  const handlePlaceOrder = () => {
    if (cartItems.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Your cart is empty',
        text2: 'Please add items before checking out.',
      })
      return
    }
    
    Toast.show({
      type: 'success',
      text1: 'Order placed successfully!',
      text2: 'Thank you for your purchase.',
    })
    
    // In a real app, clear the cart here. We navigate the user to orders for now.
    router.replace('/orders')
  }

  const handleSaveNewAddress = () => {
    if (!street || !city) {
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please enter street and city.' })
      return;
    }
    const newAddr = {
        _id: Math.random().toString(),
        user: "temp_user",
        type,
        street,
        city,
        state: addrState,
        zipCode,
        country,
        isDefault,
        createdAt: new Date().toISOString(),
    };

    if (isDefault) {
        setAddresses([newAddr, ...addresses.map(a => ({...a, isDefault: false}))]);
    } else {
        setAddresses([...addresses, newAddr]);
    }

    setSelectedAddress(newAddr._id);
    setShowAddModal(false);
    setShowAddressModal(false);
    
    setType("Home");
    setStreet("");
    setCity("");
    setAddrState("");
    setZipCode("");
    setCountry("");
    setIsDefault(false);
  }

  const currentAddress = addresses.find(a => a._id === selectedAddress) || addresses[0];

  return (
    <SafeAreaView className="flex-1 bg-surface" edges={['top']}>
      <Header title="Checkout" showBack />
      
      <ScrollView className="flex-1 px-4 mt-4" showsVerticalScrollIndicator={false}>
        
        {/* Shipping Address Section */}
        <View className="mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-primary">Shipping Address</Text>
            <TouchableOpacity onPress={() => setShowAddressModal(true)}>
              <Text className="text-primary text-sm font-bold">Change</Text>
            </TouchableOpacity>
          </View>
          
          {currentAddress && (
            <View className="p-4 bg-white rounded-2xl mb-3 shadow-sm border border-gray-100">
              <View className="flex-row items-center mb-2">
                <Ionicons name={currentAddress.type === "Home" ? "home" : "briefcase"} size={20} color={COLORS.primary} />
                <Text className="font-bold text-primary text-base ml-2">{currentAddress.type}</Text>
                {currentAddress.isDefault && (
                    <View className="bg-primary/10 px-2 py-1 rounded ml-2">
                        <Text className="text-primary text-[10px] font-bold uppercase">Default</Text>
                    </View>
                )}
              </View>
              <Text className="text-secondary mt-1">{currentAddress.street}, {currentAddress.city}</Text>
              <Text className="text-secondary">{currentAddress.state}, {currentAddress.zipCode}, {currentAddress.country}</Text>
            </View>
          )}
        </View>

        {/* Payment Method Section */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-primary mb-4">Payment Method</Text>
          <View className="bg-white rounded-2xl p-2 shadow-sm">
            {PAYMENT_METHODS.map((method, index) => (
              <TouchableOpacity 
                key={method.id}
                onPress={() => setSelectedPayment(method.id)}
                className={`flex-row items-center justify-between p-4 ${index !== PAYMENT_METHODS.length - 1 ? 'border-b border-border' : ''}`}
              >
                <View className="flex-row items-center gap-4">
                  <View className="bg-surface p-2 rounded-full">
                    <Ionicons name={method.icon as any} size={24} color={COLORS.primary} />
                  </View>
                  <Text className="font-medium text-primary text-base">{method.id}</Text>
                </View>
                <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${selectedPayment === method.id ? 'border-primary' : 'border-gray-300'}`}>
                  {selectedPayment === method.id && <View className="w-3 h-3 bg-primary rounded-full" />}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Order Summary Section */}
        <View className="mb-8">
          <Text className="text-xl font-bold text-primary mb-4">Order Summary</Text>
          <View className="bg-white rounded-2xl p-5 shadow-sm">
            <View className="flex-row justify-between mb-4">
              <Text className="text-secondary text-base">Subtotal</Text>
              <Text className="font-bold text-primary text-base">${cartTotal.toFixed(2)}</Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <Text className="text-secondary text-base">Shipping</Text>
              <Text className="font-bold text-primary text-base">${shippingFee.toFixed(2)}</Text>
            </View>
            <View className="h-[1px] bg-border my-2" />
            <View className="flex-row justify-between items-center mt-3">
              <Text className="text-xl font-bold text-primary">Total</Text>
              <Text className="text-2xl font-bold text-primary">${total.toFixed(2)}</Text>
            </View>
          </View>
        </View>
        
      </ScrollView>

      {/* Bottom Place Order Button */}
      <View className="p-4 bg-white rounded-t-3xl shadow-sm border-t border-border pb-8">
        <TouchableOpacity 
          className="bg-primary py-4 rounded-full flex-row items-center justify-center shadow-lg"
          onPress={handlePlaceOrder}
        >
          <Text className="text-white font-bold text-lg mr-2">Place Order</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>

      {/* Address Selection Modal */}
      <Modal animationType="slide" transparent={true} visible={showAddressModal} onRequestClose={() => setShowAddressModal(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 max-h-[80%] min-h-[50%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-primary">Select Address</Text>
              <TouchableOpacity onPress={() => setShowAddressModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} className="mb-4">
              {addresses.map((address) => (
                <TouchableOpacity 
                  key={address._id}
                  onPress={() => {
                    setSelectedAddress(address._id);
                    setShowAddressModal(false);
                  }}
                  className={`p-4 rounded-xl mb-3 border-2 ${selectedAddress === address._id ? 'border-primary bg-primary/5' : 'border-gray-100 bg-white'}`}
                >
                  <View className="flex-row justify-between items-center mb-2">
                    <View className="flex-row items-center gap-2">
                      <Ionicons name={address.type === "Home" ? "home" : "briefcase"} size={20} color={COLORS.primary} />
                      <Text className="font-bold text-primary text-base">{address.type}</Text>
                      {address.isDefault && (
                        <View className="bg-primary/10 px-2 py-1 rounded ml-2">
                            <Text className="text-primary text-[10px] font-bold uppercase">Default</Text>
                        </View>
                      )}
                    </View>
                    {selectedAddress === address._id && (
                      <Ionicons name="checkmark-circle" size={24} color={COLORS.primary} />
                    )}
                  </View>
                  <Text className="text-secondary mt-1 ml-7">{address.street}, {address.city}</Text>
                  <Text className="text-secondary ml-7">{address.state}, {address.zipCode}, {address.country}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity 
              className="w-full bg-surface border border-dashed border-gray-300 py-4 rounded-full flex-row items-center justify-center mb-6" 
              onPress={() => {
                setShowAddressModal(false);
                setShowAddModal(true);
              }}
            >
              <Ionicons name="add" size={20} color={COLORS.primary} />
              <Text className="text-primary font-bold text-base ml-2">Add New Address</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Add New Address Modal */}
      <Modal animationType="slide" transparent={true} visible={showAddModal} onRequestClose={() => setShowAddModal(false)}>
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-3xl p-6 h-[85%]">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-primary">Add New Address</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color={COLORS.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text className="text-primary font-medium mb-2">Label</Text>
              <View className="flex-row gap-3 mb-4">
                {["Home", "Work", "Other"].map((t) => (
                  <TouchableOpacity 
                    key={t} 
                    onPress={() => setType(t)} 
                    className={`px-6 py-2 rounded-full border ${type === t ? 'bg-primary border-primary' : 'bg-white border-gray-300'}`}
                  >
                    <Text className={type === t ? 'text-white font-bold' : 'text-primary'}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text className="text-primary font-medium mb-2">Street Address *</Text>
              <TextInput className="bg-surface p-4 rounded-xl text-primary mb-4" placeholder="123 Main St" value={street} onChangeText={setStreet} />

              <View className="flex-row gap-4 mb-4">
                <View className="flex-1">
                  <Text className="text-primary font-medium mb-2">City *</Text>
                  <TextInput className="bg-surface p-4 rounded-xl text-primary" placeholder="New York" value={city} onChangeText={setCity} />
                </View>
                <View className="flex-1">
                  <Text className="text-primary font-medium mb-2">State</Text>
                  <TextInput className="bg-surface p-4 rounded-xl text-primary" placeholder="NY" value={addrState} onChangeText={setAddrState} />
                </View>
              </View>

              <View className="flex-row gap-4 mb-4">
                <View className="flex-1">
                  <Text className="text-primary font-medium mb-2">Zip Code</Text>
                  <TextInput className="bg-surface p-4 rounded-xl text-primary" placeholder="10001" value={zipCode} onChangeText={setZipCode} keyboardType="numeric" />
                </View>
                <View className="flex-1">
                  <Text className="text-primary font-medium mb-2">Country</Text>
                  <TextInput className="bg-surface p-4 rounded-xl text-primary" placeholder="USA" value={country} onChangeText={setCountry} />
                </View>
              </View>

              <TouchableOpacity className="flex-row items-center mb-8" onPress={() => setIsDefault(!isDefault)}>
                <View className={`w-6 h-6 border-2 rounded mr-3 items-center justify-center ${isDefault ? 'bg-primary border-primary' : 'border-gray-300'}`}>
                  {isDefault && <Ionicons name="checkmark" size={16} color="white" />}
                </View>
                <Text className="text-primary font-medium text-base">Set as default address</Text>
              </TouchableOpacity>

              <TouchableOpacity className="w-full bg-primary py-4 rounded-full items-center mb-10" onPress={handleSaveNewAddress}>
                <Text className="text-white font-bold text-lg">Save & Use Address</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  )
}
