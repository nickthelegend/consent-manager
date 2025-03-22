"use client"

import { useState, useRef } from "react"
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, FlatList, Alert } from "react-native"
import { useRouter } from "expo-router"
import { SafeAreaView } from "react-native-safe-area-context"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import LottieView from "lottie-react-native"

const { width, height } = Dimensions.get("window")

// Update the slides array with more informative content
const slides = [
  {
    id: "1",
    title: "Secure Document Management",
    description: "Our blockchain-based document storage ensures your sensitive information is encrypted and tamper-proof. Access your medical records, consent forms, and legal documents anytime with military-grade security protocols.",
    animation: require("../../assets/animations/documents.json"),
    gradient: ["#4a00e0", "#8e2de2"],
  },
  {
    id: "2",
    title: "Comprehensive Consent Control",
    description: "Take full control of who accesses your data with our granular permission system. Set time-limited access, revoke permissions instantly, and receive notifications when your data is accessed. Track every consent with detailed audit trails.",
    animation: require("../../assets/animations/manage.json"),
    gradient: ["#00b09b", "#96c93d"],
  },
  {
    id: "3",
    title: "Instant Secure Sharing",
    description: "Share specific consents or documents instantly via encrypted QR codes. Recipients can only access what you've explicitly shared, with optional time-limited access. Perfect for doctor visits, research participation, or legal consultations.",
    animation: require("../../assets/animations/qr-scan.json"),
    gradient: ["#ff9966", "#ff5e62"],
  },
  {
    id: "4",
    title: "Legally-Binding Digital Signatures",
    description: "Sign documents with our blockchain-verified digital signatures that are legally binding in over 150 countries. Each signature is timestamped, encrypted, and includes biometric verification for maximum security and compliance.",
    animation: require("../../assets/animations/signature.json"),
    gradient: ["#6a11cb", "#2575fc"],
  },
]

export default function Onboarding() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList>(null)
  const lottieRefs = useRef<(LottieView | null)[]>([])
  const router = useRouter()

  // Initialize the lottie refs array
  if (lottieRefs.current.length !== slides.length) {
    lottieRefs.current = Array(slides.length).fill(null)
  }

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

      // Use the correct path format for Expo Router
      router.replace("/(auth)/create-wallet")
    } catch (error) {
      console.error("Error completing onboarding:", error)
      Alert.alert("Error", "There was a problem completing onboarding. Please try again.", [{ text: "OK" }])
    }
  }

  const renderItem = ({ item, index }: { item: (typeof slides)[0]; index: number }) => {
    return (
      <View style={styles.slide}>
        {/* Removed gradient background, using a regular View instead */}
        <View style={styles.animationContainer}>
          <LottieView
            ref={(ref) => (lottieRefs.current[index] = ref)}
            source={item.animation}
            style={styles.animation}
            autoPlay
            loop
            resizeMode="contain"
          />
        </View>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    )
  }

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x
    const index = Math.round(scrollPosition / width)
    setCurrentIndex(index)
    
    // Restart the animation when a new slide is shown
    if (lottieRefs.current[index]) {
      lottieRefs.current[index]?.reset()
      lottieRefs.current[index]?.play()
    }
  }

  return (
    <LinearGradient colors={["#000000", "#121212"]} style={styles.container}>
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
          onMomentumScrollEnd={handleScroll}
        />

        <View style={styles.indicatorContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                {
                  backgroundColor: index === currentIndex ? "#FFFFFF" : "#333333",
                },
              ]}
            />
          ))}
        </View>

        <TouchableOpacity style={styles.buttonContainer} onPress={handleNext}>
          <LinearGradient
            colors={slides[currentIndex]?.gradient || ["#6a11cb", "#2575fc"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{currentIndex === slides.length - 1 ? "Get Started" : "Next"}</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          </LinearGradient>
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
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  slide: {
    width,
    alignItems: "center",
    padding: 20,
  },
  animationContainer: {
    width: width * 0.8,
    height: height * 0.4,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    marginBottom: 40,
    padding: 20,
    backgroundColor: "#1A1A1A", // Subtle dark background instead of gradient
    overflow: "hidden",
  },
  animation: {
    width: "100%",
    height: "100%",
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginBottom: 16,
    color: "#FFFFFF",
  },
  description: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    paddingHorizontal: 20,
    color: "#AAAAAA",
    lineHeight: 24,
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
  buttonContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 30,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginRight: 8,
    color: "#FFFFFF",
  },
})
