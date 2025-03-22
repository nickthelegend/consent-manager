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
  Platform,
  KeyboardAvoidingView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons, FontAwesome5 } from "@expo/vector-icons"
import { router } from "expo-router"
import { createClient } from "@supabase/supabase-js"
import * as DocumentPicker from "expo-document-picker"
import * as FileSystem from "expo-file-system"
import { decode } from "base64-arraybuffer"
import { Picker } from "@react-native-picker/picker"

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://uorbdplqtxmcdhbnkbmf.supabase.co"
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcmJkcGxxdHhtY2RoYm5rYm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MjE0MTIsImV4cCI6MjA1ODE5NzQxMn0.h01gicHiW7yTjqT2JWCSYRmLAIzBMOlPg-kIy6q8Kk0"
const supabase = createClient(supabaseUrl, supabaseKey)

// Document categories
const DOCUMENT_CATEGORIES = [
  { label: "Select a category", value: "" },
  { label: "Medical", value: "medical" },
  { label: "Research", value: "research" },
  { label: "Legal", value: "legal" },
  { label: "Marketing", value: "marketing" },
  { label: "Other", value: "other" },
]

// Import getStoredSession utility
import { getStoredSession, getWalletAddress } from "../../utils/secure-storage"

export default function UploadDocument() {
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [userId, setUserId] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)

  // Fetch wallet address and user ID from secure storage
  useEffect(() => {
    const getStoredData = async () => {
      try {
        // Get wallet address from secure storage
        const address = await getWalletAddress()
        if (address) {
          setWalletAddress(address)
        }

        // Get the stored session
        const session = await getStoredSession()

        if (session) {
          // Set the auth token
          supabase.auth.setSession(session)

          // Set user ID from session
          if (session.user?.id) {
            setUserId(session.user.id)
          }
        } else {
          console.error("No session found")
          Alert.alert("Error", "You are not logged in")
          router.back()
        }
      } catch (error) {
        console.error("Error fetching stored data:", error)
        Alert.alert("Error", "Failed to load user data")
      }
    }

    getStoredData()
  }, [])

  // Pick a document from device
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "image/*",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      })

      if (result.canceled) {
        return
      }

      const file = result.assets[0]

      // Check file size (limit to 10MB)
      if (file.size > 10 * 1024 * 1024) {
        Alert.alert("File Too Large", "Please select a file smaller than 10MB")
        return
      }

      setSelectedFile(file)
    } catch (error) {
      console.error("Error picking document:", error)
      Alert.alert("Error", "Failed to pick document")
    }
  }

  // Validate form
  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for your document")
      return false
    }

    if (!category) {
      Alert.alert("Error", "Please select a category")
      return false
    }

    if (!selectedFile) {
      Alert.alert("Error", "Please select a file to upload")
      return false
    }

    return true
  }

  // Upload document to Supabase Storage
  const uploadDocument = async () => {
    if (!validateForm()) return

    if (!userId) {
      Alert.alert("Error", "User not authenticated")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Get the stored session to ensure we have the latest auth token
      const session = await getStoredSession()

      if (!session) {
        Alert.alert("Error", "Your session has expired. Please log in again.")
        setIsUploading(false)
        return
      }

      // Set the auth token
      supabase.auth.setSession(session)

      // Generate a unique file name
      const fileExt = selectedFile.name.split(".").pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `${userId}/${fileName}`

      // Read file as base64
      const fileUri = selectedFile.uri
      const fileContent = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      })

      // Upload file to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from("documents")
        .upload(filePath, decode(fileContent), {
          contentType: selectedFile.mimeType,
          upsert: false,
        })

      if (storageError) {
        throw new Error(`Storage error: ${storageError.message}`)
      }

      setUploadProgress(50)

      // Get public URL for the uploaded file
      const { data: publicUrlData } = supabase.storage.from("documents").getPublicUrl(filePath)

      const fileUrl = publicUrlData.publicUrl

      // Create thumbnail for image files
      let thumbnailUrl = null
      if (selectedFile.mimeType.startsWith("image/")) {
        const thumbnailPath = `thumbnails/${userId}/${fileName}`

        // For simplicity, we're using the same image as thumbnail
        // In a production app, you would resize the image here
        const { data: thumbnailData } = await supabase.storage
          .from("documents")
          .upload(thumbnailPath, decode(fileContent), {
            contentType: selectedFile.mimeType,
            upsert: false,
          })

        if (thumbnailData) {
          const { data: thumbnailUrlData } = supabase.storage.from("documents").getPublicUrl(thumbnailPath)

          thumbnailUrl = thumbnailUrlData.publicUrl
        }
      }

      setUploadProgress(75)

      // Save document metadata to database
      const { data: uploadData, error: uploadError } = await supabase
        .from("user_uploads")
        .insert([
          {
            user_id: userId,
            wallet_address: walletAddress,
            title,
            category,
            description,
            file_url: fileUrl,
            file_type: selectedFile.mimeType,
            file_size: selectedFile.size,
            thumbnail_url: thumbnailUrl,
          },
        ])
        .select()

      if (uploadError) {
        throw new Error(`Database error: ${uploadError.message}`)
      }

      setUploadProgress(100)

      Alert.alert("Success", "Document uploaded successfully", [{ text: "OK", onPress: () => router.back() }])
    } catch (error) {
      console.error("Error uploading document:", error)
      Alert.alert("Error", `Failed to upload document: ${error.message}`)
    } finally {
      setIsUploading(false)
    }
  }

  // Get file icon based on mime type
  const getFileIcon = () => {
    if (!selectedFile) return null

    const mimeType = selectedFile.mimeType

    if (mimeType.includes("pdf")) {
      return <FontAwesome5 name="file-pdf" size={40} color="#FF5555" />
    } else if (mimeType.includes("image")) {
      return <FontAwesome5 name="file-image" size={40} color="#55AAFF" />
    } else if (mimeType.includes("word") || mimeType.includes("document")) {
      return <FontAwesome5 name="file-word" size={40} color="#5555FF" />
    } else {
      return <FontAwesome5 name="file-alt" size={40} color="#FFFFFF" />
    }
  }

  return (
    <LinearGradient colors={["#000000", "#121212"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
              <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Upload Document</Text>
              <View style={styles.placeholder} />
            </View>

            <View style={styles.content}>
              <View style={styles.formContainer}>
                <Text style={styles.label}>Document Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter document title"
                  placeholderTextColor="#777777"
                  value={title}
                  onChangeText={setTitle}
                />

                <Text style={styles.label}>Category</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={category}
                    onValueChange={(value) => setCategory(value)}
                    style={styles.picker}
                    dropdownIconColor="#FFFFFF"
                  >
                    {DOCUMENT_CATEGORIES.map((cat) => (
                      <Picker.Item
                        key={cat.value}
                        label={cat.label}
                        value={cat.value}
                        color={Platform.OS === "ios" ? "#FFFFFF" : undefined}
                      />
                    ))}
                  </Picker>
                </View>

                <Text style={styles.label}>Description (Optional)</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter document description"
                  placeholderTextColor="#777777"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                />

                <Text style={styles.label}>Document File</Text>
                <TouchableOpacity style={styles.filePickerButton} onPress={pickDocument}>
                  <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.filePickerGradient}>
                    {selectedFile ? (
                      <View style={styles.selectedFileContainer}>
                        <View style={styles.fileIconContainer}>{getFileIcon()}</View>
                        <View style={styles.fileInfoContainer}>
                          <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
                            {selectedFile.name}
                          </Text>
                          <Text style={styles.fileSize}>{(selectedFile.size / 1024).toFixed(1)} KB</Text>
                        </View>
                        <TouchableOpacity style={styles.changeFileButton} onPress={pickDocument}>
                          <Text style={styles.changeFileText}>Change</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <>
                        <Ionicons name="cloud-upload-outline" size={40} color="#6a11cb" />
                        <Text style={styles.filePickerText}>Tap to select a document</Text>
                        <Text style={styles.filePickerSubtext}>PDF, Images, Word documents (Max 10MB)</Text>
                      </>
                    )}
                  </LinearGradient>
                </TouchableOpacity>

                {isUploading && (
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBarContainer}>
                      <LinearGradient
                        colors={["#6a11cb", "#2575fc"]}
                        style={[styles.progressBar, { width: `${uploadProgress}%` }]}
                      />
                    </View>
                    <Text style={styles.progressText}>{uploadProgress}%</Text>
                  </View>
                )}

                <TouchableOpacity style={styles.uploadButton} onPress={uploadDocument} disabled={isUploading}>
                  <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.uploadButtonGradient}>
                    {isUploading ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Text style={styles.uploadButtonText}>Upload Document</Text>
                        <Ionicons name="cloud-upload" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
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
  keyboardAvoidingView: {
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
  formContainer: {
    marginBottom: 40,
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
  pickerContainer: {
    width: "100%",
    height: 50,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333333",
    justifyContent: "center",
    overflow: "hidden",
  },
  picker: {
    color: "#FFFFFF",
    backgroundColor: "transparent",
  },
  filePickerButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  filePickerGradient: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 150,
  },
  filePickerText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
    marginTop: 12,
  },
  filePickerSubtext: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#AAAAAA",
    marginTop: 4,
    textAlign: "center",
  },
  selectedFileContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  fileIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "rgba(106, 17, 203, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  fileInfoContainer: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#AAAAAA",
  },
  changeFileButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "rgba(106, 17, 203, 0.2)",
    borderRadius: 6,
  },
  changeFileText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    color: "#6a11cb",
  },
  progressContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#1E1E1E",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
  },
  progressText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
    marginTop: 8,
  },
  uploadButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 30,
  },
  uploadButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  uploadButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
  },
})

