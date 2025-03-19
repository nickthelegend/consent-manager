"use client"

import { useState, useRef } from "react"
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, FlatList, Alert } from "react-native"
import { useRouter, useNavigation } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { SafeAreaView } from "react-native-safe-area-context"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"

const { width, height } = Dimensions.get("window")

const slides = [
  {
    id: "1",
    title: "Welcome to Consent Manager",
    description: "Manage all your consents in one place with our secure and easy-to-use platform.",
    image: require("../../assets/images/icon.png"),
  },
  {
    id: "2",
    title: "Track Your Consents",
    description: "Keep track of all your consents and permissions in an organized dashboard.",
    image: require("../../assets/images/icon.png"),
  },
  {
    id: "3",
    title: "Secure Documents",
    description: "Store and access your important documents securely whenever you need them.",
    image: require("../../assets/images/icon.png"),
  },
  {
    id: "4",
    title: "Easy Management",
    description: "Create, review, and manage consents with just a few taps.",
    image: require("../../assets/images/icon.png"),
  },
]
export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)
  const router = useRouter()
  const navigation = useNavigation()

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      })
    } else {
      completeOnboarding()
    }
  }

  const completeOnboarding = async () => {
    try {
      // First set the AsyncStorage value
      await AsyncStorage.setItem("onboardingComplete", "true")

      // Try direct navigation to the tabs
      router.replace("/(tabs)/")

      // If that doesn't work, try this alternative approach
      setTimeout(() => {
        // @ts-ignore - This is a workaround for navigation
        if (navigation && navigation.navigate) {
          // @ts-ignore
          navigation.navigate("(tabs)")
        }
      }, 100)

      // As a last resort, reload the app
      setTimeout(() => {
        router.replace("/")
      }, 500)
    } catch (error) {
      console.error("Error completing onboarding:", error)
      Alert.alert("Error", "There was a problem completing onboarding. Please try again.", [{ text: "OK" }])
    }
  }

  const renderItem = ({ item }: { item: (typeof slides)[0] }) => {
    return (
      <View style={styles.slide}>
        <Image source={item.image} style={styles.image} />
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    )
  }

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x
    const index = Math.round(scrollPosition / width)
    setCurrentIndex(index)
  }

  return (
    <LinearGradient colors={["#4A00E0", "#8E2DE2"]} style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.skipContainer}>
          <TouchableOpacity onPress={completeOnboarding} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          keyExtractor={(item) => item.id}
        />

        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                { backgroundColor: index === currentIndex ? "#FFFFFF" : "rgba(255, 255, 255, 0.4)" },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleNext}>
          <Text style={styles.buttonText}>{currentIndex === slides.length - 1 ? "Get Started" : "Next"}</Text>
          <Ionicons name="arrow-forward" size={20} color="#4A00E0" />
        </TouchableOpacity>
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
  skipContainer: {
    alignItems: "flex-end",
    padding: 16,
  },
  skipButton: {
    padding: 8,
  },
  skipText: {
    color: "white",
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  slide: {
    width,
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: width * 0.8,
    height: height * 0.4,
    resizeMode: "contain",
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "white",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "white",
    textAlign: "center",
    paddingHorizontal: 20,
  },
  indicatorContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 20,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: "white",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginHorizontal: 20,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: "#4A00E0",
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginRight: 8,
  },
})

