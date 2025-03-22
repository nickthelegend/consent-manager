"use client"

import "react-native-get-random-values"
import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  TextInput,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import AsyncStorage from "@react-native-async-storage/async-storage"
import algosdk from "algosdk"
import { createClient } from "@supabase/supabase-js"
import { BlurView } from "expo-blur"
import LottieView from "lottie-react-native"
import { storeSession, storeWalletAddress, storeWalletMnemonic } from "../../utils/secure-storage"

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://uorbdplqtxmcdhbnkbmf.supabase.co"
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcmJkcGxxdHhtY2RoYm5rYm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MjE0MTIsImV4cCI6MjA1ODE5NzQxMn0.h01gicHiW7yTjqT2JWCSYRmLAIzBMOlPg-kIy6q8Kk0"
const supabase = createClient(supabaseUrl, supabaseKey)

const { width } = Dimensions.get("window")

export default function CreateWalletScreen() {
  const [step, setStep] = useState("profile") // profile -> mnemonic
  const [mnemonic, setMnemonic] = useState("")
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false)

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const lottieRef = useRef<LottieView>(null)

  // Form data for user profile
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  })

  // Keyboard listeners
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener("keyboardDidShow", () => {
      setIsKeyboardVisible(true)
    })
    const keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () => {
      setIsKeyboardVisible(false)
    })

    return () => {
      keyboardDidHideListener.remove()
      keyboardDidShowListener.remove()
    }
  }, [])

  // Animation on mount
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()

    if (lottieRef.current) {
      lottieRef.current.play()
    }
  }, [fadeAnim, slideAnim])

  // Update form field
  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Check password strength when password field is updated
    if (field === "password") {
      checkPasswordStrength(value)
    }
  }

  // Check password strength
  const checkPasswordStrength = (password) => {
    const hasMinLength = password.length >= 8
    const hasUppercase = /[A-Z]/.test(password)
    const hasLowercase = /[a-z]/.test(password)
    const hasNumber = /[0-9]/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    // Calculate score (0-5)
    let score = 0
    if (hasMinLength) score++
    if (hasUppercase) score++
    if (hasLowercase) score++
    if (hasNumber) score++
    if (hasSpecialChar) score++

    setPasswordStrength({
      score,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    })
  }

  // Get password strength color
  const getPasswordStrengthColor = () => {
    const { score } = passwordStrength
    if (score <= 1) return "#FF5555"
    if (score <= 3) return "#FFC107"
    return "#00C853"
  }

  // Get password strength text
  const getPasswordStrengthText = () => {
    const { score } = passwordStrength
    if (score <= 1) return "Weak"
    if (score <= 3) return "Moderate"
    return "Strong"
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

    if (formData.password.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long")
      return false
    }

    if (passwordStrength.score < 3) {
      Alert.alert(
        "Weak Password",
        "Please create a stronger password with uppercase, lowercase, numbers, and special characters",
      )
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match")
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

      // Sign up user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
      })

      if (authError) {
        console.error("handleCreateAccount: Error signing up user", authError)
        Alert.alert("Error", authError.message || "Failed to create account")
        setIsLoading(false)
        return
      }

      console.log("handleCreateAccount: User signed up successfully", authData)

      // Store session in secure storage
      if (authData.session) {
        await storeSession(authData.session)
        console.log("handleCreateAccount: Session stored in secure storage")
      }

      const userId = authData.user?.id
      console.log("handleCreateAccount: User ID", userId)

      if (!userId) {
        console.error("handleCreateAccount: No user ID found")
        Alert.alert("Error", "Failed to create account")
        setIsLoading(false)
        return
      }

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

      // Use the mnemonic to generate the account
      const account = algosdk.mnemonicToSecretKey(generatedMnemonic)
      console.log("handleCreateAccount: Account generated from mnemonic", account)

      // Get the generated wallet address from the account
      const generatedAddress = account.addr.toString()
      console.log("handleCreateAccount: Generated address", generatedAddress)

      // Store mnemonic and wallet address securely
      await storeWalletMnemonic(generatedMnemonic)
      await storeWalletAddress(generatedAddress)

      // Mark signup as completed
      await AsyncStorage.setItem("onboardingComplete", "true")

      console.log("handleCreateAccount: Data stored in SecureStore")

      // Save user details and wallet address in Supabase
      // Using the updated schema with user_id field
      const { data, error } = await supabase
        .from("users")
        .insert([
          {
            user_id: userId, // This matches the column in our updated schema
            full_name: formData.name,
            email: formData.email,
            wallet_address: generatedAddress,
            created_at: new Date().toISOString(),
          },
        ])
        .select()

      if (error) {
        console.error("handleCreateAccount: Error storing user data in Supabase", error)
        console.error("Error details:", JSON.stringify(error, null, 2))
        console.error("Attempted to insert user with ID:", userId)
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
      <Animated.View
        style={[styles.profileFormContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.logoContainer}>
          <LinearGradient
            colors={["#6a11cb", "#2575fc"]}
            style={styles.logoBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* <LottieView
              ref={lottieRef}
              source={require("../../assets/animations/wallet-animation.json")}
              style={styles.lottieAnimation}
              autoPlay
              loop
            /> */}
          </LinearGradient>
        </View>

        <Text style={styles.title}>Create Your Wallet</Text>
        <Text style={styles.description}>
          Secure your digital assets with our blockchain wallet. Complete your profile to get started.
        </Text>

        <View style={styles.formCard}>
          <LinearGradient colors={["#1E1E1E", "#141414"]} style={styles.formCardGradient}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#AAAAAA" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your full name"
                  placeholderTextColor="#777777"
                  value={formData.name}
                  onChangeText={(text) => updateField("name", text)}
                />
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#AAAAAA" style={styles.inputIcon} />
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
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#AAAAAA" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Create a strong password"
                  placeholderTextColor="#777777"
                  secureTextEntry={!isPasswordVisible}
                  value={formData.password}
                  onChangeText={(text) => updateField("password", text)}
                />
                <TouchableOpacity
                  style={styles.visibilityIcon}
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <Ionicons name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} size={20} color="#AAAAAA" />
                </TouchableOpacity>
              </View>

              {formData.password.length > 0 && (
                <View style={styles.passwordStrengthContainer}>
                  <View style={styles.strengthBarsContainer}>
                    {[1, 2, 3, 4, 5].map((bar) => (
                      <View
                        key={bar}
                        style={[
                          styles.strengthBar,
                          {
                            backgroundColor: passwordStrength.score >= bar ? getPasswordStrengthColor() : "#333333",
                          },
                        ]}
                      />
                    ))}
                  </View>
                  <Text style={[styles.strengthText, { color: getPasswordStrengthColor() }]}>
                    {getPasswordStrengthText()}
                  </Text>
                </View>
              )}

              {formData.password.length > 0 && (
                <View style={styles.passwordRequirementsContainer}>
                  <View style={styles.requirementRow}>
                    <Ionicons
                      name={passwordStrength.hasMinLength ? "checkmark-circle" : "close-circle"}
                      size={16}
                      color={passwordStrength.hasMinLength ? "#00C853" : "#FF5555"}
                    />
                    <Text style={styles.requirementText}>At least 8 characters</Text>
                  </View>
                  <View style={styles.requirementRow}>
                    <Ionicons
                      name={passwordStrength.hasUppercase ? "checkmark-circle" : "close-circle"}
                      size={16}
                      color={passwordStrength.hasUppercase ? "#00C853" : "#FF5555"}
                    />
                    <Text style={styles.requirementText}>Uppercase letter</Text>
                  </View>
                  <View style={styles.requirementRow}>
                    <Ionicons
                      name={passwordStrength.hasNumber ? "checkmark-circle" : "close-circle"}
                      size={16}
                      color={passwordStrength.hasNumber ? "#00C853" : "#FF5555"}
                    />
                    <Text style={styles.requirementText}>Number</Text>
                  </View>
                  <View style={styles.requirementRow}>
                    <Ionicons
                      name={passwordStrength.hasSpecialChar ? "checkmark-circle" : "close-circle"}
                      size={16}
                      color={passwordStrength.hasSpecialChar ? "#00C853" : "#FF5555"}
                    />
                    <Text style={styles.requirementText}>Special character</Text>
                  </View>
                </View>
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#AAAAAA" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirm your password"
                  placeholderTextColor="#777777"
                  secureTextEntry={!isConfirmPasswordVisible}
                  value={formData.confirmPassword}
                  onChangeText={(text) => updateField("confirmPassword", text)}
                />
                <TouchableOpacity
                  style={styles.visibilityIcon}
                  onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                >
                  <Ionicons
                    name={isConfirmPasswordVisible ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color="#AAAAAA"
                  />
                </TouchableOpacity>
              </View>

              {formData.password && formData.confirmPassword && (
                <View style={styles.passwordMatchContainer}>
                  <Ionicons
                    name={formData.password === formData.confirmPassword ? "checkmark-circle" : "close-circle"}
                    size={16}
                    color={formData.password === formData.confirmPassword ? "#00C853" : "#FF5555"}
                  />
                  <Text
                    style={[
                      styles.passwordMatchText,
                      {
                        color: formData.password === formData.confirmPassword ? "#00C853" : "#FF5555",
                      },
                    ]}
                  >
                    {formData.password === formData.confirmPassword ? "Passwords match" : "Passwords don't match"}
                  </Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>

        <View style={styles.warningContainer}>
          <Ionicons name="warning-outline" size={24} color="#FFC107" />
          <Text style={styles.warningText}>
            You will be shown a 25-word recovery phrase. Make sure to write it down and keep it in a safe place. If you
            lose it, you will lose access to your wallet.
          </Text>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleCreateAccount} disabled={isLoading}>
          <LinearGradient
            colors={["#6a11cb", "#2575fc"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.buttonText}>Create Account & Wallet</Text>
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.divider} />
        </View>

        <TouchableOpacity style={styles.importButton} onPress={handleImportWallet}>
          <Text style={styles.importButtonText}>Import Existing Wallet</Text>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  // Render mnemonic view
  const renderMnemonicView = () => {
    return (
      <Animated.View style={[styles.mnemonicContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        <View style={styles.successIconContainer}>
          <LinearGradient colors={["#00C853", "#009624"]} style={styles.successIconGradient}>
            <Ionicons name="checkmark" size={50} color="#FFFFFF" />
          </LinearGradient>
        </View>

        <Text style={styles.title}>Wallet Created!</Text>
        <Text style={styles.description}>
          Your wallet has been created successfully. Below is your recovery phrase. Please store it securely.
        </Text>

        <View style={styles.mnemonicCardContainer}>
          <LinearGradient colors={["#1E1E1E", "#141414"]} style={styles.mnemonicCardGradient}>
            <View style={styles.mnemonicHeader}>
              <MaterialCommunityIcons name="shield-key" size={24} color="#6a11cb" />
              <Text style={styles.mnemonicHeaderText}>Recovery Phrase</Text>
            </View>

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

            <TouchableOpacity style={styles.copyButton}>
              <LinearGradient colors={["#333333", "#222222"]} style={styles.copyButtonGradient}>
                <Ionicons name="copy-outline" size={18} color="#FFFFFF" />
                <Text style={styles.copyButtonText}>Copy to Clipboard</Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </View>

        <View style={styles.addressCardContainer}>
          <LinearGradient colors={["#1E1E1E", "#141414"]} style={styles.addressCardGradient}>
            <Text style={styles.addressLabel}>Wallet Address:</Text>
            <View style={styles.addressRow}>
              <Text style={styles.addressText}>
                {address.substring(0, 10)}...{address.substring(address.length - 10)}
              </Text>
              <TouchableOpacity style={styles.addressCopyButton}>
                <Ionicons name="copy-outline" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.warningContainer}>
          <Ionicons name="warning-outline" size={24} color="#FFC107" />
          <Text style={styles.warningText}>
            Never share your recovery phrase with anyone. Anyone with these words can access your wallet.
          </Text>
        </View>

        <TouchableOpacity style={styles.createButton} onPress={handleContinue}>
          <LinearGradient
            colors={["#6a11cb", "#2575fc"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.buttonGradient}
          >
            <Text style={styles.buttonText}>I've Saved My Recovery Phrase</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" style={styles.buttonIcon} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    )
  }

  return (
    <LinearGradient
      colors={["#000000", "#121212"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
          keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        >
          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollViewContent}
          >
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <LinearGradient colors={["#333333", "#222222"]} style={styles.backButtonGradient}>
                  <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.headerTitle}>{step === "profile" ? "Create Wallet" : "Wallet Created"}</Text>
              <View style={styles.placeholder} />
            </View>

            <View style={styles.content}>{step === "profile" ? renderProfileForm() : renderMnemonicView()}</View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      {/* Background elements */}
      <View style={styles.backgroundCircle1} />
      <View style={styles.backgroundCircle2} />
      {/* <BlurView intensity={20} tint="dark" style={styles.blurOverlay} /> */}
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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
  },
  backButtonGradient: {
    width: "100%",
    height: "100%",
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
  logoContainer: {
    marginBottom: 20,
  },
  logoBackground: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#6a11cb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  lottieAnimation: {
    width: 80,
    height: 80,
  },
  title: {
    fontSize: 28,
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
    paddingHorizontal: 20,
  },
  formCard: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  formCardGradient: {
    padding: 20,
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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333333",
    height: 50,
    paddingHorizontal: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#FFFFFF",
    fontFamily: "Poppins-Regular",
  },
  visibilityIcon: {
    padding: 5,
  },
  passwordStrengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    justifyContent: "space-between",
  },
  strengthBarsContainer: {
    flexDirection: "row",
    flex: 1,
    marginRight: 10,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    marginHorizontal: 2,
  },
  strengthText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  passwordRequirementsContainer: {
    marginTop: 10,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    padding: 10,
  },
  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  requirementText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#AAAAAA",
    marginLeft: 8,
  },
  passwordMatchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  passwordMatchText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    marginLeft: 8,
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
    shadowColor: "#6a11cb",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
  },
  buttonIcon: {
    marginLeft: 8,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    width: "100%",
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#333333",
  },
  dividerText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#AAAAAA",
    marginHorizontal: 10,
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
    padding: 10,
  },
  successIconContainer: {
    marginBottom: 20,
  },
  successIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00C853",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  mnemonicCardContainer: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  mnemonicCardGradient: {
    padding: 20,
  },
  mnemonicHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  mnemonicHeaderText: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
    marginLeft: 10,
  },
  mnemonicScrollView: {
    maxHeight: 200,
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
    backgroundColor: "rgba(106, 17, 203, 0.1)",
    borderRadius: 8,
    padding: 8,
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
  copyButton: {
    marginTop: 15,
    borderRadius: 8,
    overflow: "hidden",
  },
  copyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  copyButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  addressCardContainer: {
    width: "100%",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addressCardGradient: {
    padding: 15,
  },
  addressLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#AAAAAA",
    marginBottom: 5,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addressText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
    flex: 1,
  },
  addressCopyButton: {
    padding: 5,
  },
  backgroundCircle1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(106, 17, 203, 0.2)",
    top: -100,
    left: -100,
  },
  backgroundCircle2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(37, 117, 252, 0.2)",
    bottom: -50,
    right: -50,
  },
  blurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
})

