"use client"

import "react-native-get-random-values"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import * as SecureStore from "expo-secure-store"
import AsyncStorage from "@react-native-async-storage/async-storage"
import algosdk from "algosdk"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://uorbdplqtxmcdhbnkbmf.supabase.co"
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcmJkcGxxdHhtY2RoYm5rYm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MjE0MTIsImV4cCI6MjA1ODE5NzQxMn0.h01gicHiW7yTjqT2JWCSYRmLAIzBMOlPg-kIy6q8Kk0"
const supabase = createClient(supabaseUrl, supabaseKey)

export default function CreateWalletScreen() {
  const [step, setStep] = useState("profile") // profile -> mnemonic
  const [mnemonic, setMnemonic] = useState("")
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  // Form data for user profile
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  })

  // Update form field
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Validate form data
  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert("Error", "Please enter your full name")
      return false
    }

    if (!formData.email.trim() || !formData.email.includes("@")) {
      Alert.alert("Error", "Please enter a valid email address")
      return false
    }

    return true
  }

  // Handle form submission and account creation
  const handleCreateAccount = async () => {
    try {
      if (!validateForm()) {
        return
      }

      setIsLoading(true)
      console.log("handleCreateAccount: Starting account generation")

      // Call the API to generate the account data
      const response = await fetch("https://algorand-generate-account.vercel.app/generateaccount")
      if (!response.ok) {
        console.error("handleCreateAccount: Error fetching account data", response.status)
        Alert.alert("Error", "Failed to generate account")
        setIsLoading(false)
        return
      }

      const jsonResponse = await response.json()
      console.log("handleCreateAccount: Received response", jsonResponse)

      // Destructure mnemonic and address from the response
      const { mnemonic: generatedMnemonic, address: addrObj } = jsonResponse
      console.log("handleCreateAccount: Extracted mnemonic", generatedMnemonic)

      // Extract the publicKey from the address object for debugging
      const publicKey = addrObj.publicKey
      console.log("handleCreateAccount: Extracted publicKey", publicKey)

      // Use the mnemonic to generate the account
      const account = algosdk.mnemonicToSecretKey(generatedMnemonic)
      console.log("handleCreateAccount: Account generated from mnemonic", account)

      // Get the generated wallet address from the account
      const generatedAddress = account.addr.toString()
      console.log("handleCreateAccount: Generated address", generatedAddress)

      // Store mnemonic and wallet address securely
      await SecureStore.setItemAsync("walletMnemonic", generatedMnemonic)
      await SecureStore.setItemAsync("walletAddress", generatedAddress)

      // Mark signup as completed
      await AsyncStorage.setItem("onboardingComplete", "true")

      console.log("handleCreateAccount: Data stored in SecureStore")

      // Save user details and wallet address in Supabase
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            full_name: formData.name,
            email: formData.email,
            wallet_address: generatedAddress,
            created_at: new Date().toISOString(),
          },
        ])
        .select()

      if (error) {
        console.error("handleCreateAccount: Error storing user data in Supabase", error)
        Alert.alert("Error", "Failed to store user data")
        setIsLoading(false)
        return
      }

      console.log("handleCreateAccount: User data stored in Supabase", data)

      setMnemonic(generatedMnemonic)
      setAddress(generatedAddress)
      setStep("mnemonic")
      setIsLoading(false)
    } catch (error) {
      console.error("handleCreateAccount: Error creating wallet", error)
      Alert.alert("Error", "Failed to create wallet")
      setIsLoading(false)
    }
  }

  const handleContinue = async () => {
    // Navigate to the main app
    router.replace("/(tabs)")
  }

  const handleImportWallet = () => {
    router.push("/(auth)/import-wallet")
  }

  // Render profile form
  const renderProfileForm = () => {
    return (
      <View style={styles.profileFormContainer}>
        <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.profileIconContainer}>
          <Ionicons name="person-outline" size={40} color="#FFFFFF" />
        </LinearGradient>

        <Text style={styles.title}>Create Your Profile</Text>
        <Text style={styles.description}>Please provide your details to create your account and wallet.</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#777777"
            value={formData.name}
            onChangeText={(text) => updateField("name", text)}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email address"
            placeholderTextColor="#777777"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text) => updateField("email", text)}
          />
        </View>

        <View style={styles.warningContainer}>
          <Ionicons name="warning-outline" size={24} color="#FFC107" />
          <Text style={styles.warningText}>
            You will be shown a 25-word recovery phrase. Make sure to write it down and keep it in a safe place. If you
            lose it, you will lose access to your wallet.
          </Text>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreateAccount} disabled={isLoading}>
          <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.buttonGradient}>
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>Create Account & Wallet</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.importButton} onPress={handleImportWallet}>
          <Text style={styles.importButtonText}>Import Existing Wallet</Text>
        </TouchableOpacity>
      </View>
    )
  }

  // Render mnemonic view
  const renderMnemonicView = () => {
    return (
      <View style={styles.mnemonicContainer}>
        <Text style={styles.title}>Your Recovery Phrase</Text>
        <Text style={styles.description}>
          Write down these 25 words in order and keep them in a safe place. You'll need them to recover your wallet if
          you lose access.
        </Text>

        <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.mnemonicBox}>
          <ScrollView style={styles.mnemonicScrollView}>
            <View style={styles.mnemonicWordsContainer}>
              {mnemonic.split(" ").map((word, index) => (
                <View key={index} style={styles.wordItem}>
                  <Text style={styles.wordNumber}>{index + 1}.</Text>
                  <Text style={styles.wordText}>{word}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </LinearGradient>

        <View style={styles.addressContainer}>
          <Text style={styles.addressLabel}>Wallet Address:</Text>
          <Text style={styles.addressText}>
            {address.substring(0, 10)}...{address.substring(address.length - 10)}
          </Text>
        </View>

        <View style={styles.warningContainer}>
          <Ionicons name="warning-outline" size={24} color="#FFC107" />
          <Text style={styles.warningText}>
            Never share your recovery phrase with anyone. Anyone with these words can access your wallet.
          </Text>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleContinue}>
          <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.buttonGradient}>
            <Text style={styles.buttonText}>I've Saved My Recovery Phrase</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <LinearGradient colors={["#000000", "#121212"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{step === "profile" ? "Create Profile" : "Create Wallet"}</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>{step === "profile" ? renderProfileForm() : renderMnemonicView()}</View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileFormContainer: {
    alignItems: "center",
    padding: 10,
  },
  profileIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#AAAAAA",
    textAlign: "center",
    marginBottom: 30,
  },
  formGroup: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
    marginBottom: 8,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    paddingHorizontal: 15,
    color: "#FFFFFF",
    fontFamily: "Poppins-Regular",
    borderWidth: 1,
    borderColor: "#333333",
  },
  warningContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 193, 7, 0.1)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
    alignItems: "flex-start",
  },
  warningText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#FFFFFF",
  },
  createButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
    marginTop: 10,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
  },
  importButton: {
    padding: 15,
  },
  importButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#6a11cb",
  },
  mnemonicContainer: {
    alignItems: "center",
    padding: 20,
  },
  mnemonicBox: {
    width: "100%",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  mnemonicScrollView: {
    maxHeight: 300,
  },
  mnemonicWordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  wordItem: {
    flexDirection: "row",
    width: "48%",
    marginBottom: 10,
    alignItems: "center",
  },
  wordNumber: {
    width: 25,
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#6a11cb",
  },
  wordText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  addressContainer: {
    width: "100%",
    backgroundColor: "rgba(106, 17, 203, 0.1)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  addressLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#AAAAAA",
    marginBottom: 5,
  },
  addressText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
})

