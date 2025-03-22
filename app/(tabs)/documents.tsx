"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
  Dimensions,
  Modal,
  Alert,
} from "react-native"
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { createClient } from "@supabase/supabase-js"
import { getStoredSession, getWalletAddress } from "../../utils/secure-storage"

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://uorbdplqtxmcdhbnkbmf.supabase.co"
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcmJkcGxxdHhtY2RoYm5rYm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MjE0MTIsImV4cCI6MjA1ODE5NzQxMn0.h01gicHiW7yTjqT2JWCSYRmLAIzBMOlPg-kIy6q8Kk0"
const supabase = createClient(supabaseUrl, supabaseKey)

const { width } = Dimensions.get("window")

// Skeleton component for loading state
const DocumentSkeleton = () => (
  <View style={[styles.documentCard, { backgroundColor: "#121212" }]}>
    <View style={[styles.documentIconContainer, { backgroundColor: "#1E1E1E" }]}>
      <LinearGradient colors={["#333333", "#222222"]} style={{ width: 45, height: 45, borderRadius: 10 }} />
    </View>
    <View style={styles.documentContent}>
      <View style={{ width: "80%", height: 18, backgroundColor: "#333333", borderRadius: 4, marginBottom: 8 }} />
      <View style={{ width: "60%", height: 14, backgroundColor: "#222222", borderRadius: 4 }} />
    </View>
    <View style={{ width: 24, height: 24, backgroundColor: "#333333", borderRadius: 12 }} />
  </View>
)

export default function Documents() {
  const [documents, setDocuments] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [userId, setUserId] = useState("")
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [menuVisible, setMenuVisible] = useState(false)
  const menuPositionRef = useRef({ x: 0, y: 0 })

  // Fetch wallet address and user ID from secure storage
  useEffect(() => {
    const getStoredData = async () => {
      try {
        // Get wallet address
        const address = await getWalletAddress()
        if (address) {
          setWalletAddress(address)
        }

        // Get session for user ID
        const session = await getStoredSession()
        if (session?.user?.id) {
          setUserId(session.user.id)
        }
      } catch (error) {
        console.error("Error fetching stored data:", error)
      }
    }

    getStoredData()
  }, [])

  // Fetch documents from Supabase
  const fetchDocuments = useCallback(async () => {
    if (!walletAddress) return

    try {
      setLoading(true)

      const { data, error } = await supabase
        .from("user_uploads")
        .select("*")
        .eq("wallet_address", walletAddress)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching documents:", error)
        return
      }

      setDocuments(data || [])
    } catch (error) {
      console.error("Error in fetchDocuments:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [walletAddress])

  // Initial fetch
  useEffect(() => {
    if (walletAddress) {
      fetchDocuments()
    }
  }, [walletAddress, fetchDocuments])

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchDocuments()
  }, [fetchDocuments])

  // Handle upload button press
  const handleUpload = () => {
    router.push("/(documents)/upload-document")
  }

  // Handle document menu press
  const handleMenuPress = (document, event) => {
    setSelectedDocument(document)
    setMenuVisible(true)
  }

  // Handle create consent
  const handleCreateConsent = () => {
    setMenuVisible(false)
    if (selectedDocument) {
      router.push({
        pathname: "/(documents)/create-consent",
        params: { documentId: selectedDocument.id },
      })
    }
  }

  // Handle view document
  const handleViewDocument = () => {
    setMenuVisible(false)
    if (selectedDocument) {
      router.push({
        pathname: "/(documents)/view-document",
        params: { documentId: selectedDocument.id },
      })
    }
  }

  // Handle delete document
  const handleDeleteDocument = async () => {
    setMenuVisible(false)

    if (!selectedDocument) return

    Alert.alert("Delete Document", "Are you sure you want to delete this document?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            setLoading(true)

            // Delete from database
            const { error } = await supabase.from("user_uploads").delete().eq("id", selectedDocument.id)

            if (error) {
              throw error
            }

            // Refresh documents list
            fetchDocuments()

            Alert.alert("Success", "Document deleted successfully")
          } catch (error) {
            console.error("Error deleting document:", error)
            Alert.alert("Error", "Failed to delete document")
          } finally {
            setLoading(false)
          }
        },
      },
    ])
  }

  // Get icon based on file type
  const getFileIcon = (fileType) => {
    if (fileType.includes("pdf")) {
      return <FontAwesome5 name="file-pdf" size={24} color="#FFFFFF" />
    } else if (fileType.includes("image")) {
      return <FontAwesome5 name="file-image" size={24} color="#FFFFFF" />
    } else if (fileType.includes("word") || fileType.includes("document")) {
      return <FontAwesome5 name="file-word" size={24} color="#FFFFFF" />
    } else {
      return <FontAwesome5 name="file-alt" size={24} color="#FFFFFF" />
    }
  }

  // Get gradient colors based on category
  const getCategoryGradient = (category) => {
    switch (category?.toLowerCase()) {
      case "medical":
        return ["#4a00e0", "#8e2de2"]
      case "research":
        return ["#00b09b", "#96c93d"]
      case "legal":
        return ["#ff9966", "#ff5e62"]
      case "marketing":
        return ["#fc4a1a", "#f7b733"]
      default:
        return ["#6a11cb", "#2575fc"]
    }
  }

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return "Unknown"
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Render document item
  const renderDocumentItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.documentCard, { backgroundColor: "#121212" }]}
      onPress={() => handleViewDocument(item)}
    >
      <LinearGradient colors={getCategoryGradient(item.category)} style={styles.documentIconContainer}>
        {getFileIcon(item.file_type)}
      </LinearGradient>
      <View style={styles.documentContent}>
        <Text style={[styles.documentTitle, { color: "#FFFFFF" }]}>{item.title}</Text>
        <Text style={[styles.documentInfo, { color: "#AAAAAA" }]}>
          {item.file_type?.split("/")[1]?.toUpperCase() || "FILE"} • {formatFileSize(item.file_size)} •{" "}
          {formatDate(item.created_at)}
        </Text>
      </View>
      <TouchableOpacity
        style={styles.documentActionButton}
        onPress={() => {
          setSelectedDocument(item)
          setMenuVisible(true)
        }}
      >
        <MaterialIcons name="more-vert" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </TouchableOpacity>
  )

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <LinearGradient colors={["#1E1E1E", "#121212"]} style={styles.emptyStateGradient}>
        <FontAwesome5 name="file-alt" size={60} color="#333333" />
        <Text style={styles.emptyStateTitle}>No Documents Available</Text>
        <Text style={styles.emptyStateDescription}>Upload your first document by tapping the upload button below.</Text>
        <TouchableOpacity style={styles.emptyStateButton} onPress={handleUpload}>
          <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.emptyStateButtonGradient}>
            <Text style={styles.emptyStateButtonText}>Upload Document</Text>
            <Ionicons name="cloud-upload" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </View>
  )

  // Render categories section
  const renderCategories = () => (
    <View style={styles.categoriesContainer}>
      <Text style={[styles.sectionTitle, { color: "#FFFFFF" }]}>Categories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
        <TouchableOpacity style={styles.categoryCard}>
          <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.categoryGradient}>
            <FontAwesome5 name="hospital" size={24} color="#FFFFFF" />
          </LinearGradient>
          <Text style={[styles.categoryText, { color: "#FFFFFF" }]}>Medical</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryCard}>
          <LinearGradient colors={["#00b09b", "#96c93d"]} style={styles.categoryGradient}>
            <FontAwesome5 name="flask" size={24} color="#FFFFFF" />
          </LinearGradient>
          <Text style={[styles.categoryText, { color: "#FFFFFF" }]}>Research</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryCard}>
          <LinearGradient colors={["#ff9966", "#ff5e62"]} style={styles.categoryGradient}>
            <FontAwesome5 name="file-contract" size={24} color="#FFFFFF" />
          </LinearGradient>
          <Text style={[styles.categoryText, { color: "#FFFFFF" }]}>Legal</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.categoryCard}>
          <LinearGradient colors={["#fc4a1a", "#f7b733"]} style={styles.categoryGradient}>
            <FontAwesome5 name="bullhorn" size={24} color="#FFFFFF" />
          </LinearGradient>
          <Text style={[styles.categoryText, { color: "#FFFFFF" }]}>Marketing</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )

  // Render loading skeletons
  const renderSkeletons = () => (
    <View style={{ paddingHorizontal: 20 }}>
      {[1, 2, 3].map((_, index) => (
        <DocumentSkeleton key={index} />
      ))}
    </View>
  )

  return (
    <LinearGradient colors={["#000000", "#121212"]} style={styles.container}>
      <FlatList
        data={documents}
        renderItem={renderDocumentItem}
        keyExtractor={(item) => item.id?.toString()}
        ListHeaderComponent={renderCategories}
        ListEmptyComponent={!loading && renderEmptyState}
        ListFooterComponent={loading && !refreshing ? renderSkeletons : null}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
            colors={["#6a11cb", "#2575fc"]}
          />
        }
      />

      <TouchableOpacity style={styles.uploadButton} onPress={handleUpload}>
        <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.uploadButtonGradient}>
          <Ionicons name="cloud-upload" size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Document Action Menu Modal */}
      <Modal visible={menuVisible} transparent={true} animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={handleViewDocument}>
              <Ionicons name="eye-outline" size={22} color="#FFFFFF" />
              <Text style={styles.menuItemText}>View Document</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem} onPress={handleCreateConsent}>
              <Ionicons name="shield-checkmark-outline" size={22} color="#FFFFFF" />
              <Text style={styles.menuItemText}>Create Consent</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.deleteMenuItem]} onPress={handleDeleteDocument}>
              <Ionicons name="trash-outline" size={22} color="#FF5555" />
              <Text style={[styles.menuItemText, styles.deleteMenuItemText]}>Delete Document</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingBottom: 100,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 15,
  },
  categoriesScroll: {
    paddingBottom: 10,
  },
  categoryCard: {
    alignItems: "center",
    marginRight: 15,
    width: 80,
  },
  categoryGradient: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  documentIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  documentContent: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  documentInfo: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 3,
  },
  documentActionButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  uploadButtonGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateContainer: {
    marginTop: 40,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  emptyStateGradient: {
    padding: 30,
    alignItems: "center",
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
    marginTop: 20,
    marginBottom: 10,
  },
  emptyStateDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#AAAAAA",
    textAlign: "center",
    marginBottom: 20,
  },
  emptyStateButton: {
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 10,
  },
  emptyStateButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  emptyStateButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  // Menu Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    width: width * 0.8,
    backgroundColor: "#1E1E1E",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333333",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
    marginLeft: 12,
  },
  deleteMenuItem: {
    borderBottomWidth: 0,
  },
  deleteMenuItemText: {
    color: "#FF5555",
  },
})

