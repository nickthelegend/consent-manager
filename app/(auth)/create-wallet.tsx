"use client"

import "react-native-get-random-values"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import * as SecureStore from "expo-secure-store"
import AsyncStorage from "@react-native-async-storage/async-storage"
import algosdk from "algosdk"

export default function CreateWalletScreen() {
  const [mnemonic, setMnemonic] = useState("")
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showMnemonic, setShowMnemonic] = useState(false)

  const generateWallet = async () => {
    try {
      setIsLoading(true)

      // Generate a new account using algosdk
      const account = algosdk.generateAccount()
      const address = account.addr
      const mnemonic = algosdk.secretKeyToMnemonic(account.sk)

      setMnemonic(mnemonic)
      setAddress(address)
      setShowMnemonic(true)

      // Store wallet information securely
      await SecureStore.setItemAsync("walletMnemonic", mnemonic)
      await SecureStore.setItemAsync("walletAddress", address)

      // Mark signup as completed
      await AsyncStorage.setItem("onboardingComplete", "true")

      setIsLoading(false)
    } catch (error) {
      console.error("Error generating wallet:", error)
      Alert.alert("Error", "Failed to generate wallet. Please try again.")
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

  // Implement the handleCreateAccount function from the provided file
  const handleCreateAccount = async () => {
    try {
      setIsLoading(true)
      console.log("handleCreateAccount: Starting account generation")

      // Generate a new Algorand account
      const account = algosdk.generateAccount()
      const generatedAddress = account.addr
      const generatedMnemonic = algosdk.secretKeyToMnemonic(account.sk)

      console.log("handleCreateAccount: Account generated", generatedAddress)

      // Store mnemonic and wallet address securely
      await SecureStore.setItemAsync("walletMnemonic", generatedMnemonic)
      await SecureStore.setItemAsync("walletAddress", generatedAddress)

      // Mark signup as completed
      await AsyncStorage.setItem("onboardingComplete", "true")

      console.log("handleCreateAccount: Data stored in SecureStore")

      setMnemonic(generatedMnemonic)
      setAddress(generatedAddress)
      setShowMnemonic(true)

      setIsLoading(false)
    } catch (error) {
      console.error("handleCreateAccount: Error creating wallet", error)
      Alert.alert("Error", "Failed to create wallet")
      setIsLoading(false)
    }
  }

  return (
    <LinearGradient colors={["#000000", "#121212"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create Wallet</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>
            {!showMnemonic ? (
              <View style={styles.createWalletContainer}>
                <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.walletIconContainer}>
                  <Ionicons name="wallet-outline" size={40} color="#FFFFFF" />
                </LinearGradient>

                <Text style={styles.title}>Create a New Wallet</Text>
                <Text style={styles.description}>
                  Create a new Algorand wallet to store and manage your digital assets securely.
                </Text>

                <View style={styles.warningContainer}>
                  <Ionicons name="warning-outline" size={24} color="#FFC107" />
                  <Text style={styles.warningText}>
                    You will be shown a 25-word recovery phrase. Make sure to write it down and keep it in a safe place.
                    If you lose it, you will lose access to your wallet.
                  </Text>
                </View>

                <TouchableOpacity style={styles.createButton} onPress={handleCreateAccount} disabled={isLoading}>
                  <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.buttonGradient}>
                    {isLoading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.buttonText}>Create Wallet</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity style={styles.importButton} onPress={handleImportWallet}>
                  <Text style={styles.importButtonText}>Import Existing Wallet</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.mnemonicContainer}>
                <Text style={styles.title}>Your Recovery Phrase</Text>
                <Text style={styles.description}>
                  Write down these 25 words in order and keep them in a safe place. You'll need them to recover your
                  wallet if you lose access.
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
            )}
          </View>
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
  createWalletContainer: {
    alignItems: "center",
    padding: 20,
  },
  walletIconContainer: {
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

