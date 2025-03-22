"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
  Platform,
  KeyboardAvoidingView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import { createClient } from "@supabase/supabase-js"
import { getStoredSession, getWalletAddress } from "../../utils/secure-storage"
import DateTimePicker from "@react-native-community/datetimepicker"

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://uorbdplqtxmcdhbnkbmf.supabase.co"
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcmJkcGxxdHhtY2RoYm5rYm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MjE0MTIsImV4cCI6MjA1ODE5NzQxMn0.h01gicHiW7yTjqT2JWCSYRmLAIzBMOlPg-kIy6q8Kk0"
const supabase = createClient(supabaseUrl, supabaseKey)

export default function CreateTextConsent() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [userId, setUserId] = useState("")

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [organization, setOrganization] = useState("")
  const [expiryEnabled, setExpiryEnabled] = useState(true)
  const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) // Default 30 days
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [dataFields, setDataFields] = useState([{ key: "", value: "" }])

  // Fetch wallet address and user ID from secure storage
  useEffect(() => {
    const getStoredData = async () => {
      try {
        setLoading(true)
        // Get wallet address
        const address = await getWalletAddress()
        if (address) {
          setWalletAddress(address)
        }

        // Get session for user ID
        const session = await getStoredSession()
        if (session?.user?.id) {
          setUserId(session.user.id)

          // Set auth token
          supabase.auth.setSession(session)
        } else {
          Alert.alert("Error", "You are not logged in")
          router.back()
        }
      } catch (error) {
        console.error("Error fetching stored data:", error)
        Alert.alert("Error", "Failed to load user data")
      } finally {
        setLoading(false)
      }
    }

    getStoredData()
  }, [])

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      // Keep the time from the current expiryDate
      const newDate = new Date(selectedDate)
      newDate.setHours(expiryDate.getHours())
      newDate.setMinutes(expiryDate.getMinutes())
      setExpiryDate(newDate)

      // On iOS, we'll show the time picker right after date selection
      if (Platform.OS === "ios") {
        setShowTimePicker(true)
      }
    }
  }

  // Handle time change
  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false)
    if (selectedTime) {
      // Keep the date from the current expiryDate
      const newDate = new Date(expiryDate)
      newDate.setHours(selectedTime.getHours())
      newDate.setMinutes(selectedTime.getMinutes())
      setExpiryDate(newDate)
    }
  }

  // Format date for display
  const formatDate = (date) => {
    return (
      date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    )
  }

  // Add these functions to handle the data fields
  const addDataField = () => {
    setDataFields([...dataFields, { key: "", value: "" }])
  }

  const removeDataField = (index) => {
    if (dataFields.length > 1) {
      const newFields = [...dataFields]
      newFields.splice(index, 1)
      setDataFields(newFields)
    }
  }

  const updateDataField = (index, field, value) => {
    const newFields = [...dataFields]
    newFields[index][field] = value
    setDataFields(newFields)
  }

  // Validate form
  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for the consent")
      return false
    }

    if (!organization.trim()) {
      Alert.alert("Error", "Please enter an organization name")
      return false
    }

    const validFields = dataFields.filter((field) => field.key.trim() && field.value.trim())
    if (validFields.length === 0) {
      Alert.alert("Error", "Please add at least one data field with both key and value")
      return false
    }

    if (expiryEnabled) {
      const now = new Date()
      if (expiryDate <= now) {
        Alert.alert("Error", "Expiry date must be in the future")
        return false
      }
    }

    return true
  }

  // Create consent
  const handleCreateConsent = async () => {
    if (!validateForm()) return

    try {
      setSaving(true)

      // Get the latest session
      const session = await getStoredSession()
      if (!session) {
        Alert.alert("Error", "Your session has expired. Please log in again.")
        setSaving(false)
        return
      }

      // Set the auth token
      supabase.auth.setSession(session)

      // Prepare data object
      const data = {}
      dataFields.forEach((field) => {
        if (field.key.trim() && field.value.trim()) {
          data[field.key.trim()] = field.value.trim()
        }
      })

      // Create consent record
      const { data: consentData, error: consentError } = await supabase
        .from("user_consents")
        .insert([
          {
            user_id: userId,
            wallet_address: walletAddress,
            document_id: null, // No document associated with text consent
            title: title,
            description: description,
            organization: organization,
            access_type: "view", // Default for text consents
            expires_at: expiryEnabled ? expiryDate.toISOString() : null,
            status: "active",
            data: data, // Store the text data in the data field
          },
        ])
        .select()

      if (consentError) {
        throw new Error(`Failed to create consent: ${consentError.message}`)
      }

      Alert.alert("Success", "Text consent created successfully", [{ text: "OK", onPress: () => router.back() }])
    } catch (error) {
      console.error("Error creating text consent:", error)
      Alert.alert("Error", `Failed to create text consent: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <LinearGradient colors={["#000000", "#121212"]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6a11cb" />
        <Text style={styles.loadingText}>Loading...</Text>
      </LinearGradient>
    )
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
            <Text style={styles.headerTitle}>Create Text Consent</Text>
            <View style={styles.placeholder} />
          </View>

          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.content}>
              <View style={styles.formContainer}>
                <Text style={styles.label}>Consent Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter consent title"
                  placeholderTextColor="#777777"
                  value={title}
                  onChangeText={setTitle}
                />

                <Text style={styles.label}>Organization</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter organization name"
                  placeholderTextColor="#777777"
                  value={organization}
                  onChangeText={setOrganization}
                />

                <Text style={styles.label}>Description (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter consent description"
                  placeholderTextColor="#777777"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <Text style={styles.sectionTitle}>Consent Data</Text>
                <Text style={styles.dataDescription}>
                  Add any data you want to share with the organization. You can add as many key-value pairs as needed.
                </Text>

                {dataFields.map((field, index) => (
                  <View key={index} style={styles.dataFieldContainer}>
                    <View style={styles.dataFieldRow}>
                      <View style={styles.dataFieldInputContainer}>
                        <Text style={styles.label}>Key</Text>
                        <TextInput
                          style={[styles.input, styles.dataFieldInput]}
                          placeholder="e.g., Email, Phone, Address"
                          placeholderTextColor="#777777"
                          value={field.key}
                          onChangeText={(text) => updateDataField(index, "key", text)}
                        />
                      </View>

                      <View style={styles.dataFieldInputContainer}>
                        <Text style={styles.label}>Value</Text>
                        <TextInput
                          style={[styles.input, styles.dataFieldInput]}
                          placeholder="e.g., john@example.com"
                          placeholderTextColor="#777777"
                          value={field.value}
                          onChangeText={(text) => updateDataField(index, "value", text)}
                        />
                      </View>
                    </View>

                    <TouchableOpacity
                      style={styles.removeFieldButton}
                      onPress={() => removeDataField(index)}
                      disabled={dataFields.length === 1}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={20}
                        color={dataFields.length === 1 ? "#555555" : "#FF5555"}
                      />
                    </TouchableOpacity>
                  </View>
                ))}

                <TouchableOpacity style={styles.addFieldButton} onPress={addDataField}>
                  <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.addFieldButtonGradient}>
                    <Ionicons name="add" size={20} color="#FFFFFF" />
                    <Text style={styles.addFieldButtonText}>Add Another Field</Text>
                  </LinearGradient>
                </TouchableOpacity>

                <View style={styles.expiryContainer}>
                  <Text style={styles.label}>Set Expiry Date</Text>
                  <Switch
                    value={expiryEnabled}
                    onValueChange={setExpiryEnabled}
                    trackColor={{ false: "#333333", true: "#6a11cb" }}
                    thumbColor={expiryEnabled ? "#FFFFFF" : "#777777"}
                  />
                </View>

                {expiryEnabled && (
                  <View>
                    <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
                      <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.datePickerGradient}>
                        <Ionicons name="calendar-outline" size={22} color="#AAAAAA" style={styles.dateIcon} />
                        <Text style={styles.dateText}>{formatDate(expiryDate)}</Text>
                      </LinearGradient>
                    </TouchableOpacity>

                    <View style={styles.timeButtonsContainer}>
                      <TouchableOpacity style={styles.timeButton} onPress={() => setShowDatePicker(true)}>
                        <Text style={styles.timeButtonText}>Change Date</Text>
                      </TouchableOpacity>

                      <TouchableOpacity style={styles.timeButton} onPress={() => setShowTimePicker(true)}>
                        <Text style={styles.timeButtonText}>Change Time</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}

                {showDatePicker && (
                  <DateTimePicker
                    value={expiryDate}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                    minimumDate={new Date()}
                  />
                )}

                {showTimePicker && (
                  <DateTimePicker value={expiryDate} mode="time" display="default" onChange={onTimeChange} />
                )}

                <View style={styles.warningContainer}>
                  <Ionicons name="information-circle-outline" size={24} color="#6a11cb" />
                  <Text style={styles.warningText}>
                    {expiryEnabled
                      ? "The consent will automatically expire on the selected date and time. After expiry, your information will no longer be accessible to the organization."
                      : "Without an expiry date, this consent will remain active until manually revoked."}
                  </Text>
                </View>

                <TouchableOpacity style={styles.createButton} onPress={handleCreateConsent} disabled={saving}>
                  <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.createButtonGradient}>
                    {saving ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Text style={styles.createButtonText}>Create Consent</Text>
                        <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
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
  formContainer: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
    marginTop: 20,
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
    marginBottom: 8,
    marginTop: 16,
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
  textArea: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: "top",
  },
  expiryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  datePickerButton: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 8,
  },
  datePickerGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    height: 50,
  },
  dateIcon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#FFFFFF",
  },
  timeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  timeButton: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },
  timeButtonText: {
    color: "#AAAAAA",
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  warningContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(106, 17, 203, 0.1)",
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
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
    marginTop: 30,
  },
  createButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
  },
  dataDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#AAAAAA",
    marginTop: 5,
    marginBottom: 15,
  },
  dataFieldContainer: {
    marginBottom: 20,
  },
  dataFieldRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dataFieldInputContainer: {
    width: "48%",
  },
  dataFieldInput: {
    marginTop: 5,
  },
  removeFieldButton: {
    alignSelf: "flex-end",
    padding: 10,
    marginTop: 5,
  },
  addFieldButton: {
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 5,
    marginBottom: 20,
  },
  addFieldButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  addFieldButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
    marginLeft: 8,
  },
})

