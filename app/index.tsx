"use client"

import { useEffect, useState } from "react"
import { ActivityIndicator } from "react-native"
import { Redirect } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { LinearGradient } from "expo-linear-gradient"
import * as SecureStore from "expo-secure-store"

export default function Index() {
  const [isLoading, setIsLoading] = useState(true)
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)
  const [isWalletCreated, setIsWalletCreated] = useState(false)

  useEffect(() => {
    async function checkStatus() {
      try {
        // Check if onboarding is complete
        const onboardingComplete = await AsyncStorage.getItem("onboardingComplete")
        setIsOnboardingComplete(onboardingComplete === "true")

        // Check if wallet is created
        const walletAddress = await SecureStore.getItemAsync("walletAddress")
        setIsWalletCreated(!!walletAddress)
      } catch (error) {
        console.error("Error checking status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkStatus()
  }, [])

  if (isLoading) {
    return (
      <LinearGradient
        colors={["#000000", "#121212"]}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="#FFFFFF" />
      </LinearGradient>
    )
  }

  // If onboarding is not complete, redirect to onboarding
  if (!isOnboardingComplete) {
    return <Redirect href="/(onboarding)" />
  }

  // If wallet is not created, redirect to wallet creation
  if (!isWalletCreated) {
    return <Redirect href="/(auth)/create-wallet" />
  }

  // Otherwise, redirect to main app
  return <Redirect href="/(tabs)" />
}

