"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Dimensions,
  Alert,
  ScrollView,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons, FontAwesome5 } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { createClient } from "@supabase/supabase-js"
import { getStoredSession } from "../../utils/secure-storage"
import * as FileSystem from "expo-file-system"
import * as Sharing from "expo-sharing"
import PDFReader from "rn-pdf-reader-js"

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://uorbdplqtxmcdhbnkbmf.supabase.co"
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcmJkcGxxdHhtY2RoYm5rYm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MjE0MTIsImV4cCI6MjA1ODE5NzQxMn0.h01gicHiW7yTjqT2JWCSYRmLAIzBMOlPg-kIy6q8Kk0"
const supabase = createClient(supabaseUrl, supabaseKey)

const { width, height } = Dimensions.get("window")

export default function ViewDocument() {
  const params = useLocalSearchParams()
  const { documentId } = params

  const [loading, setLoading] = useState(true)
  const [document, setDocument] = useState(null)
  const [downloading, setDownloading] = useState(false)

  // Fetch document data
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true)

        // Get session
        const session = await getStoredSession()
        if (!session) {
          Alert.alert("Error", "You are not logged in")
          router.back()
          return
        }

        // Set auth token
        supabase.auth.setSession(session)

        // Fetch document details
        if (documentId) {
          const { data, error } = await supabase.from("user_uploads").select("*").eq("id", documentId).single()

          if (error) {
            console.error("Error fetching document:", error)
            Alert.alert("Error", "Failed to load document details")
            router.back()
            return
          }

          if (data) {
            setDocument(data)
            console.log("Document data loaded:", data) // For debugging
          } else {
            Alert.alert("Error", "Document not found")
            router.back()
          }
        } else {
          Alert.alert("Error", "No document ID provided")
          router.back()
        }
      } catch (error) {
        console.error("Error fetching document:", error)
        Alert.alert("Error", "Failed to load document")
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
  }, [documentId])

  // Handle download document
  const handleDownload = async () => {
    if (!document?.file_url) {
      Alert.alert("Error", "No file URL available")
      return
    }

    try {
      setDownloading(true)

      // Extract filename from URL
      const fileName = document.file_url.split("/").pop()
      const fileUri = `${FileSystem.documentDirectory}${fileName}`

      // Download the file
      const downloadResult = await FileSystem.downloadAsync(document.file_url, fileUri)

      if (downloadResult.status === 200) {
        // Share the file
        await Sharing.shareAsync(fileUri)
      } else {
        Alert.alert("Error", "Failed to download file")
      }
    } catch (error) {
      console.error("Error downloading file:", error)
      Alert.alert("Error", "Failed to download file")
    } finally {
      setDownloading(false)
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown"
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  // Handle Create Consent Navigation
  const handleCreateConsent = () => {
    if (document?.id) {
      router.push({
        pathname: "/(documents)/create-consent",
        params: { documentId: document.id },
      })
    } else {
      Alert.alert("Error", "Document ID is missing, cannot create consent.")
    }
  }

  // Render document content based on file type
  const renderDocumentContent = () => {
    if (!document?.file_url) {
      return (
        <View style={styles.noContentContainer}>
          <FontAwesome5 name="file-alt" size={60} color="#333333" />
          <Text style={styles.noContentText}>No file content available</Text>
        </View>
      )
    }

    const fileType = document.file_type || ""
    console.log("Rendering content for fileType:", fileType, "URL:", document.file_url)

    if (fileType.includes("image")) {
      console.log("Attempting to render Image from URL:", document.file_url)
      return (
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: document.file_url }}
            style={styles.imageViewer}
            resizeMode="contain"
            onError={(e) => console.error("Image load error:", e.nativeEvent.error)}
          />
        </View>
      )
    } else if (fileType.includes("pdf")) {
      console.log("Attempting to render PDF from URL:", document.file_url)
      return (
        <View style={styles.pdfContainer}>
          <PDFReader
            source={{ uri: document.file_url }}
            style={styles.pdfViewer}
            withPinchZoom
            withScroll
            onError={(error) => console.error("PDF load error:", error)}
          />
        </View>
      )
    } else {
      return (
        <View style={styles.unsupportedContainer}>
          <FontAwesome5 name="file-alt" size={60} color="#333333" />
          <Text style={styles.unsupportedText}>
            This file type ({fileType.split("/")[1]?.toUpperCase() || "UNKNOWN"}) cannot be previewed.
          </Text>
          <TouchableOpacity style={styles.downloadButton} onPress={handleDownload}>
            <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.downloadButtonGradient}>
              <Text style={styles.downloadButtonText}>Download File</Text>
              <Ionicons name="download" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )
    }
  }

  if (loading) {
    return (
      <LinearGradient colors={["#000000", "#121212"]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6a11cb" />
        <Text style={styles.loadingText}>Loading document...</Text>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={["#000000", "#121212"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>View Document</Text>
          {document?.file_url && (
            <TouchableOpacity style={styles.downloadIconButton} onPress={handleDownload} disabled={downloading}>
              {downloading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="download-outline" size={24} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          )}
        </View>

        <ScrollView>
          {document && (
            <View style={styles.documentInfoContainer}>
              <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.documentInfoGradient}>
                <View style={styles.documentTitleContainer}>
                  <View style={styles.documentIconContainer}>
                    <LinearGradient
                      colors={
                        document.category === "medical"
                          ? ["#4a00e0", "#8e2de2"]
                          : document.category === "research"
                            ? ["#00b09b", "#96c93d"]
                            : document.category === "legal"
                              ? ["#ff9966", "#ff5e62"]
                              : document.category === "marketing"
                                ? ["#fc4a1a", "#f7b733"]
                                : ["#6a11cb", "#2575fc"]
                      }
                      style={styles.documentIcon}
                    >
                      {document.file_type?.includes("pdf") ? (
                        <FontAwesome5 name="file-pdf" size={24} color="#FFFFFF" />
                      ) : document.file_type?.includes("image") ? (
                        <FontAwesome5 name="file-image" size={24} color="#FFFFFF" />
                      ) : document.file_type?.includes("word") || document.file_type?.includes("document") ? (
                        <FontAwesome5 name="file-word" size={24} color="#FFFFFF" />
                      ) : (
                        <FontAwesome5 name="file-alt" size={24} color="#FFFFFF" />
                      )}
                    </LinearGradient>
                  </View>
                  <View style={styles.documentTitleWrapper}>
                    <Text style={styles.documentTitle} numberOfLines={2} ellipsizeMode="tail">
                      {document.title}
                    </Text>
                    <Text style={styles.documentCategory}>
                      {document.category?.charAt(0).toUpperCase() + document.category?.slice(1) || "Other"}
                    </Text>
                  </View>
                </View>

                <View style={styles.documentMetaContainer}>
                  <View style={styles.documentMetaItem}>
                    <Ionicons name="calendar-outline" size={16} color="#AAAAAA" />
                    <Text style={styles.documentMetaText}>Uploaded: {formatDate(document.created_at)}</Text>
                  </View>
                  <View style={styles.documentMetaItem}>
                    <Ionicons name="document-outline" size={16} color="#AAAAAA" />
                    <Text style={styles.documentMetaText}>
                      {document.file_type?.split("/")[1]?.toUpperCase() || "FILE"} •{" "}
                      {formatFileSize(document.file_size)}
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>
          )}

          {document && (
            <TouchableOpacity style={styles.createConsentButton} onPress={handleCreateConsent}>
              <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.createConsentButtonGradient}>
                <Ionicons name="shield-checkmark-outline" size={22} color="#FFFFFF" style={{ marginRight: 10 }} />
                <Text style={styles.createConsentButtonText}>Create Consent for this Document</Text>
              </LinearGradient>
            </TouchableOpacity>
          )}

          <View style={styles.documentContentContainerOuter}>
            <View style={styles.documentContentContainerInner}>{renderDocumentContent()}</View>
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
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#2A2A2A",
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
  downloadIconButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  documentInfoContainer: {
    marginHorizontal: 20,
    marginTop: 15, // Added margin top
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  documentInfoGradient: {
    padding: 15,
  },
  documentTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  documentIconContainer: {
    marginRight: 15,
  },
  documentIcon: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  documentTitleWrapper: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  documentCategory: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#AAAAAA",
  },
  documentMetaContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    padding: 10,
  },
  documentMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  documentMetaText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#AAAAAA",
    marginLeft: 8,
  },
  createConsentButton: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  createConsentButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  createConsentButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
  },
  documentContentContainerOuter: {
    // New style for outer container
    flex: 1, // Make it take remaining space
    marginHorizontal: 20,
    marginBottom: 20, // Add some bottom margin
    backgroundColor: "#1A1A1A",
    borderRadius: 12, // Rounded corners for the content area
    overflow: "hidden", // Clip child content (PDFReader/Image)
    minHeight: height * 0.4, // Ensure it has some minimum height
  },
  documentContentContainerInner: {
    // New style for inner container
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5, // Reduced padding
  },
  imageViewer: {
    width: "100%", // Use percentage for responsiveness within container
    height: "100%", // Use percentage
    borderRadius: 8,
  },
  pdfContainer: {
    flex: 1,
  },
  pdfViewer: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  unsupportedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 200, // Ensure it's visible
  },
  unsupportedText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  noContentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    minHeight: 200, // Ensure it's visible
  },
  noContentText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 20,
  },
  downloadButton: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 20,
  },
  downloadButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  downloadButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
})
