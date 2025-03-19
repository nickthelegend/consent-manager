"use client"

import { Redirect } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect, useState } from "react"
import { ActivityIndicator } from "react-native"
import { LinearGradient } from "expo-linear-gradient"

export default function Index() {
  const [isLoading, setIsLoading] = useState(true)
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false)

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const onboardingComplete = await AsyncStorage.getItem("onboardingComplete")
        setIsOnboardingComplete(onboardingComplete === "true")
      } catch (error) {
        console.error("Error checking onboarding status:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkOnboarding()
  }, [])

  if (isLoading) {
    return (
      <LinearGradient
        colors={["#4A00E0", "#8E2DE2"]}
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" color="white" />
      </LinearGradient>
    )
  }

  return isOnboardingComplete ? <Redirect href="/(tabs)" /> : <Redirect href="/(onboarding)" />
}

