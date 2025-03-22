"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { createClient } from "@supabase/supabase-js"
import { getStoredSession } from "../../utils/secure-storage"

export default function EditProfile() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [userId, setUserId] = useState("")

  // Initialize Supabase client
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://uorbdplqtxmcdhbnkbmf.supabase.co"
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcmJkcGxxdHhtY2RoYm5rYm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MjE0MTIsImV4cCI6MjA1ODE5NzQxMn0.h01gicHiW7yTjqT2JWCSYRmLAIzBMOlPg-kIy6q8Kk0"
const supabase = createClient(supabaseUrl, supabaseKey)

  useEffect(() => {
    fetchUserDetails()
  }, [])

  const fetchUserDetails = async () => {
    try {
      setLoading(true)

      // Get the stored session
      const session = await getStoredSession()

      if (!session) {
        console.error("No session found")
        Alert.alert("Error", "You are not logged in")
        router.back()
        return
      }

      // Set the auth token
      supabase.auth.setSession(session)

      // Store user ID
      if (session.user?.id) {
        setUserId(session.user.id)
      }

      // Get user email from session
      if (session.user?.email) {
        setEmail(session.user.email)
      }

      // Get user details from the users table
      const { data, error } = await supabase
        .from("users")
        .select("full_name, email")
        .eq("user_id", session.user.id)
        .single()

      if (error) {
        console.error("Error fetching user details:", error)
        setLoading(false)
        return
      }

      if (data) {
        setFullName(data.full_name)
        // Update email if it exists in the users table
        if (data.email) {
          setEmail(data.email)
        }
      }

      setLoading(false)
    } catch (error) {
      console.error("Error in fetchUserDetails:", error)
      setLoading(false)
      Alert.alert("Error", "Failed to load profile details")
    }
  }

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert("Error", "Name cannot be empty")
      return
    }

    try {
      setSaving(true)

      // Get the stored session
      const session = await getStoredSession()

      if (!session) {
        console.error("No session found")
        Alert.alert("Error", "You are not logged in")
        setSaving(false)
        return
      }

      // Set the auth token
      supabase.auth.setSession(session)

      // Update user details in the users table
      const { error } = await supabase.from("users").update({ full_name: fullName }).eq("user_id", userId)

      if (error) {
        console.error("Error updating user details:", error)
        Alert.alert("Error", "Failed to update profile")
        setSaving(false)
        return
      }

      Alert.alert("Success", "Profile updated successfully", [{ text: "OK", onPress: () => router.back() }])

      setSaving(false)
    } catch (error) {
      console.error("Error in handleSave:", error)
      Alert.alert("Error", "Failed to update profile")
      setSaving(false)
    }
  }

  return (
    <LinearGradient colors={["#000000", "#121212"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {loading ? (
              <ActivityIndicator size="large" color="#7C3AED" style={{ marginTop: 50 }} />
            ) : (
              <View style={styles.content}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Full Name</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="person-outline" size={20} color="#AAAAAA" style={styles.inputIcon} />
                    <TextInput
                      style={styles.input}
                      placeholder="Enter your full name"
                      placeholderTextColor="#777777"
                      value={fullName}
                      onChangeText={setFullName}
                    />
                  </View>
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Email</Text>
                  <View style={[styles.inputContainer, { backgroundColor: "#1A1A1A", opacity: 0.7 }]}>
                    <Ionicons name="mail-outline" size={20} color="#AAAAAA" style={styles.inputIcon} />
                    <TextInput style={styles.input} value={email} editable={false} />
                    <Ionicons name="lock-closed" size={16} color="#AAAAAA" style={styles.lockIcon} />
                  </View>
                  <Text style={styles.helperText}>Email cannot be changed</Text>
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
                  <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.saveButtonGradient}>
                    {saving ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.saveButtonText}>Save Changes</Text>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
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
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  formGroup: {
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
  lockIcon: {
    marginLeft: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: "#FFFFFF",
    fontFamily: "Poppins-Regular",
  },
  helperText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#AAAAAA",
    marginTop: 4,
    marginLeft: 4,
  },
  saveButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 20,
  },
  saveButtonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
  },
})

