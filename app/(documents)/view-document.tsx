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
        console.log("Fetching document for ID:", documentId)

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
            console.error("Error fetching document from Supabase:", error)
            Alert.alert("Error", "Failed to load document details. " + error.message)
            router.back()
            return
          }

          if (data) {
            setDocument(data)
            console.log("Document data loaded:", JSON.stringify(data, null, 2)) // For debugging
          } else {
            Alert.alert("Error", "Document not found")
            router.back()
          }
        } else {
          Alert.alert("Error", "No document ID provided")
          router.back()
        }
      } catch (error) {
        console.error("Critical error in fetchDocument:", error)
        Alert.alert("Error", "Failed to load document due to an unexpected error.")
      } finally {
        setLoading(false)
      }
    }

    fetchDocument()
  }, [documentId])

  // Handle download document
  const handleDownload = async () => {
    if (!document?.file_url) {
      Alert.alert("Error", "No file URL available for download.")
      return
    }
    console.log("Attempting to download:", document.file_url)

    try {
      setDownloading(true)
      const fileName = document.file_url.split("/").pop()?.split("?")[0] || `downloaded_file_${Date.now()}` // Handle query params in URL
      const fileUri = `${FileSystem.documentDirectory}${fileName}`

      const downloadResult = await FileSystem.downloadAsync(document.file_url, fileUri)

      if (downloadResult.status === 200) {
        await Sharing.shareAsync(fileUri)
      } else {
        console.error("Download failed:", downloadResult)
        Alert.alert("Error", `Failed to download file. Status: ${downloadResult.status}`)
      }
    } catch (error) {
      console.error("Error downloading file:", error)
      Alert.alert("Error", "An error occurred while trying to download the file.")
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
    if (bytes === null || typeof bytes === "undefined") return "Unknown"
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  // Handle Create Consent Navigation
  const handleCreateConsent = () => {
    if (document?.id) {
      router.push({
        pathname: "/(documents)/create-consent",
        params: { documentId: document.id, documentTitle: document.title },
      })
    } else {
      Alert.alert("Error", "Document ID is missing, cannot create consent.")
    }
  }

  // Render document content based on file type
  const renderDocumentContent = () => {
    if (!document?.file_url) {
      console.log("renderDocumentContent: No file_url found in document object:", document)
      return (
        <View style={styles.noContentContainer}>
          <FontAwesome5 name="file-excel" size={60} color="#AAAAAA" />
          <Text style={styles.noContentText}>No file content available to preview.</Text>
        </View>
      )
    }

    const fileType = document.file_type || ""
    const fileUrl = document.file_url
    console.log(`renderDocumentContent: Attempting to render type "${fileType}" from URL: ${fileUrl}`)

    if (fileType.includes("image")) {
      return (
        <View style={styles.imageContainer}>
          <Image
            key={fileUrl}
            source={{ uri: fileUrl }}
            style={styles.imageViewer}
            resizeMode="contain"
            onError={(e) => console.error("Image load error:", e.nativeEvent.error, "URL:", fileUrl)}
            onLoad={() => console.log("Image loaded successfully:", fileUrl)}
          />
        </View>
      )
    } else if (fileType.includes("pdf")) {
      return (
        <View style={styles.pdfContainer}>
          <PDFReader
            key={fileUrl}
            source={{ uri: fileUrl }}
            style={styles.pdfViewer}
            withPinchZoom
            withScroll
            onError={(error) => console.error("PDF load error:", error, "URL:", fileUrl)}
            onLoad={() => console.log("PDF loaded successfully:", fileUrl)}
          />
        </View>
      )
    } else {
      console.log(`renderDocumentContent: Unsupported file type "${fileType}" for preview.`)
      return (
        <View style={styles.unsupportedContainer}>
          <FontAwesome5 name="file-alt" size={60} color="#AAAAAA" />
          <Text style={styles.unsupportedText}>
            Preview is not available for this file type ({(fileType.split("/")[1] || "UNKNOWN").toUpperCase()}).
          </Text>
          <TouchableOpacity style={styles.downloadButtonAlt} onPress={handleDownload} disabled={downloading}>
            <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.downloadButtonGradient}>
              {downloading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Ionicons name="download-outline" size={20} color="#FFFFFF" style={{ marginRight: 8 }} />
              )}
              <Text style={styles.downloadButtonText}>Download File</Text>
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

  if (!document) {
    return (
      <LinearGradient colors={["#000000", "#121212"]} style={styles.loadingContainer}>
        <FontAwesome5 name="exclamation-triangle" size={48} color="#FF6B6B" />
        <Text style={[styles.loadingText, { color: "#FF6B6B", marginTop: 20 }]}>Document could not be loaded.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 20 }}>
          <Text style={{ color: "#6a11cb", fontFamily: "Poppins-Medium" }}>Go Back</Text>
        </TouchableOpacity>
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
          <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
            {document.title || "View Document"}
          </Text>
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

        <ScrollView contentContainerStyle={styles.scrollContentContainer}>
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
                    {(document.file_type?.split("/")[1] || "FILE").toUpperCase()} • {formatFileSize(document.file_size)}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          <TouchableOpacity style={styles.createConsentButton} onPress={handleCreateConsent}>
            <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.createConsentButtonGradient}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#FFFFFF" style={{ marginRight: 10 }} />
              <Text style={styles.createConsentButtonText}>Create Consent for this Document</Text>
            </LinearGradient>
          </TouchableOpacity>

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
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.1)", // Lighter border
    minHeight: 60,
  },
  backButton: {
    padding: 5, // Easier to tap
  },
  headerTitle: {
    flex: 1, // Allow title to take space and ellipsize
    textAlign: "center",
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
    marginHorizontal: 10, // Space around title
  },
  downloadIconButton: {
    padding: 5, // Easier to tap
  },
  scrollContentContainer: {
    paddingBottom: 20, // Ensure space at the bottom of scroll
  },
  documentInfoContainer: {
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#1E1E1E", // Fallback bg
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
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
    width: 48, // Slightly larger icon
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  documentTitleWrapper: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold", // Bolder title
    color: "#FFFFFF",
    marginBottom: 4,
  },
  documentCategory: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#AAAAAA",
  },
  documentMetaContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Darker meta bg
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  documentMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 3, // Spacing for meta items
  },
  documentMetaText: {
    fontSize: 13, // Slightly smaller meta text
    fontFamily: "Poppins-Regular",
    color: "#BBBBBB", // Lighter meta text
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
    height: height * 0.45, // Explicit height (45% of screen height)
    marginHorizontal: 20,
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    overflow: "hidden", // Important for child borderRadius and content clipping
    // borderWidth: 1, borderColor: 'magenta', // For debugging layout
  },
  documentContentContainerInner: {
    flex: 1,
    borderRadius: 12, // Ensure inner container also respects border radius if needed
    overflow: "hidden", // Clip content like PDF viewer
    // borderWidth: 1, borderColor: 'cyan', // For debugging layout
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 0, // No padding, let image fill
    // backgroundColor: 'green', // For debugging
  },
  imageViewer: {
    width: "100%",
    height: "100%",
    // borderRadius: 8, // Removed if parent clips
  },
  pdfContainer: {
    flex: 1,
    // backgroundColor: 'yellow', // For debugging
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
    // backgroundColor: 'grey', // For debugging
  },
  unsupportedText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#DDDDDD",
    textAlign: "center",
    marginTop: 20,
    marginBottom: 25,
  },
  noContentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    // backgroundColor: 'darkgrey', // For debugging
  },
  noContentText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#AAAAAA",
    textAlign: "center",
    marginTop: 20,
  },
  downloadButtonAlt: {
    // Style for download button in unsupported view
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 10,
  },
  downloadButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  downloadButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
})
