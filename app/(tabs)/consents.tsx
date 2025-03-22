"use client"

import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  Alert,
  Modal,
} from "react-native"
import { MaterialIcons, Ionicons, FontAwesome5 } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { createClient } from "@supabase/supabase-js"
import { getStoredSession, getWalletAddress } from "../../utils/secure-storage"

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://uorbdplqtxmcdhbnkbmf.supabase.co"
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcmJkcGxxdHhtY2RoYm5rYm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MjE0MTIsImV4cCI6MjA1ODE5NzQxMn0.h01gicHiW7yTjqT2JWCSYRmLAIzBMOlPg-kIy6q8Kk0"
const supabase = createClient(supabaseUrl, supabaseKey)


// Skeleton component for loading state
const ConsentSkeleton = () => (
  <View style={[styles.consentCard, { backgroundColor: "#121212" }]}>
    <View style={styles.consentHeader}>
      <View style={{ width: "60%", height: 18, backgroundColor: "#333333", borderRadius: 4 }} />
      <View style={{ width: 80, height: 24, backgroundColor: "#333333", borderRadius: 12 }} />
    </View>
    <View style={{ width: "40%", height: 14, backgroundColor: "#222222", borderRadius: 4, marginTop: 8 }} />
    <View style={styles.consentFooter}>
      <View style={{ width: "30%", height: 12, backgroundColor: "#222222", borderRadius: 4 }} />
      <View style={{ width: 80, height: 24, backgroundColor: "#333333", borderRadius: 4 }} />
    </View>
  </View>
)

export default function Consents() {
  const [activeFilter, setActiveFilter] = useState("all")
  const [consents, setConsents] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [userId, setUserId] = useState("")
  const [selectedConsent, setSelectedConsent] = useState(null)
  const [menuVisible, setMenuVisible] = useState(false)

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

  // Fetch consents from Supabase
  const fetchConsents = useCallback(async () => {
    if (!walletAddress) return

    try {
      setLoading(true)

      // Get the stored session
      const session = await getStoredSession()
      if (!session) {
        console.error("No session found")
        setLoading(false)
        return
      }

      // Set the auth token
      supabase.auth.setSession(session)

      const { data, error } = await supabase
        .from("user_consents")
        .select(`
          *,
          user_uploads:document_id (
            title,
            category,
            file_type
          )
        `)
        .eq("wallet_address", walletAddress)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching consents:", error)
        return
      }

      // Check for expired consents and update their status
      const now = new Date()
      const updatedConsents = data.map((consent) => {
        if (consent.expires_at && new Date(consent.expires_at) < now && consent.status === "active") {
          // Update status in database
          supabase
            .from("user_consents")
            .update({ status: "expired" })
            .eq("id", consent.id)
            .then(() => console.log(`Consent ${consent.id} marked as expired`))
            .catch((err) => console.error(`Error updating consent status: ${err}`))

          // Return updated consent for UI
          return { ...consent, status: "expired" }
        }
        return consent
      })

      setConsents(updatedConsents || [])
    } catch (error) {
      console.error("Error in fetchConsents:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [walletAddress])

  // Initial fetch
  useEffect(() => {
    if (walletAddress) {
      fetchConsents()
    }
  }, [walletAddress, fetchConsents])

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchConsents()
  }, [fetchConsents])

  // Filter consents based on active filter
  const filteredConsents = activeFilter === "all" ? consents : consents.filter((item) => item.status === activeFilter)

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#FFFFFF"
      case "pending":
        return "#AAAAAA"
      case "expired":
        return "#777777"
      case "revoked":
        return "#FF5555"
      default:
        return "#FFFFFF"
    }
  }

  // Get status gradient
  const getStatusGradient = (status) => {
    switch (status) {
      case "active":
        return ["#00c6ff", "#0072ff"]
      case "pending":
        return ["#ff9966", "#ff5e62"]
      case "expired":
        return ["#141414", "#333333"]
      case "revoked":
        return ["#FF5555", "#CC0000"]
      default:
        return ["#141414", "#333333"]
    }
  }

  // Get document icon based on file type
  const getDocumentIcon = (fileType) => {
    if (!fileType) return <FontAwesome5 name="file-alt" size={20} color="#FFFFFF" />

    if (fileType.includes("pdf")) {
      return <FontAwesome5 name="file-pdf" size={20} color="#FFFFFF" />
    } else if (fileType.includes("image")) {
      return <FontAwesome5 name="file-image" size={20} color="#FFFFFF" />
    } else if (fileType.includes("word") || fileType.includes("document")) {
      return <FontAwesome5 name="file-word" size={20} color="#FFFFFF" />
    } else {
      return <FontAwesome5 name="file-alt" size={20} color="#FFFFFF" />
    }
  }

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Handle view consent details
  const handleViewDetails = (consent) => {
    setMenuVisible(false)
    // Navigate to consent details page
    Alert.alert("View Details", "Consent details view will be implemented here.")
  }

  // Handle revoke consent
  const handleRevokeConsent = async () => {
    setMenuVisible(false)

    if (!selectedConsent) return

    Alert.alert(
      "Revoke Consent",
      "Are you sure you want to revoke this consent? The organization will no longer have access to this document.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Revoke",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true)

              // Get the stored session
              const session = await getStoredSession()
              if (!session) {
                Alert.alert("Error", "Your session has expired. Please log in again.")
                setLoading(false)
                return
              }

              // Set the auth token
              supabase.auth.setSession(session)

              // Update consent status
              const { error } = await supabase
                .from("user_consents")
                .update({ status: "revoked" })
                .eq("id", selectedConsent.id)

              if (error) {
                throw error
              }

              // Refresh consents list
              fetchConsents()

              Alert.alert("Success", "Consent revoked successfully")
            } catch (error) {
              console.error("Error revoking consent:", error)
              Alert.alert("Error", "Failed to revoke consent")
            } finally {
              setLoading(false)
            }
          },
        },
      ],
    )
  }

  // Render consent item
  const renderConsentItem = ({ item }) => (
    <TouchableOpacity
      style={styles.consentCard}
      onPress={() => {
        setSelectedConsent(item)
        setMenuVisible(true)
      }}
    >
      <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.consentCardGradient}>
        <View style={styles.consentHeader}>
          <Text style={styles.consentTitle}>{item.title}</Text>
          <LinearGradient colors={getStatusGradient(item.status)} style={styles.statusBadge}>
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </LinearGradient>
        </View>

        <View style={styles.documentInfo}>
          {getDocumentIcon(item.user_uploads?.file_type)}
          <Text style={styles.documentTitle}>{item.user_uploads?.title || "Document"}</Text>
        </View>

        <Text style={styles.organizationText}>{item.organization}</Text>

        <View style={styles.consentFooter}>
          <View style={styles.dateContainer}>
            <Ionicons name="calendar-outline" size={12} color="#777777" />
            <Text style={styles.dateText}>
              {item.expires_at ? `Expires: ${formatDate(item.expires_at)}` : `Created: ${formatDate(item.created_at)}`}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => {
              setSelectedConsent(item)
              setMenuVisible(true)
            }}
          >
            <Text style={styles.detailsButtonText}>Options</Text>
            <MaterialIcons name="arrow-forward-ios" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )

  // Render empty state
  const renderEmptyState = () => (
    <View style={styles.emptyStateContainer}>
      <LinearGradient colors={["#1E1E1E", "#121212"]} style={styles.emptyStateGradient}>
        <FontAwesome5 name="shield-alt" size={60} color="#333333" />
        <Text style={styles.emptyStateTitle}>No Consents Available</Text>
        <Text style={styles.emptyStateDescription}>
          You haven't created any consents yet. Create a consent by selecting a document and tapping "Create Consent".
        </Text>
      </LinearGradient>
    </View>
  )

  return (
    <LinearGradient colors={["#000000", "#121212"]} style={styles.container}>
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: activeFilter === "all" ? "#333333" : "#1E1E1E",
              },
            ]}
            onPress={() => setActiveFilter("all")}
          >
            <LinearGradient
              colors={activeFilter === "all" ? ["#6a11cb", "#2575fc"] : ["#141414", "#1E1E1E"]}
              style={styles.filterGradient}
            >
              <Text style={[styles.filterText, { opacity: activeFilter === "all" ? 1 : 0.6 }]}>All</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: activeFilter === "active" ? "#333333" : "#1E1E1E",
              },
            ]}
            onPress={() => setActiveFilter("active")}
          >
            <LinearGradient
              colors={activeFilter === "active" ? ["#00c6ff", "#0072ff"] : ["#141414", "#1E1E1E"]}
              style={styles.filterGradient}
            >
              <Text style={[styles.filterText, { opacity: activeFilter === "active" ? 1 : 0.6 }]}>Active</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: activeFilter === "pending" ? "#333333" : "#1E1E1E",
              },
            ]}
            onPress={() => setActiveFilter("pending")}
          >
            <LinearGradient
              colors={activeFilter === "pending" ? ["#ff9966", "#ff5e62"] : ["#141414", "#1E1E1E"]}
              style={styles.filterGradient}
            >
              <Text style={[styles.filterText, { opacity: activeFilter === "pending" ? 1 : 0.6 }]}>Pending</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: activeFilter === "expired" ? "#333333" : "#1E1E1E",
              },
            ]}
            onPress={() => setActiveFilter("expired")}
          >
            <LinearGradient
              colors={activeFilter === "expired" ? ["#333333", "#1a1a1a"] : ["#141414", "#1E1E1E"]}
              style={styles.filterGradient}
            >
              <Text style={[styles.filterText, { opacity: activeFilter === "expired" ? 1 : 0.6 }]}>Expired</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: activeFilter === "revoked" ? "#333333" : "#1E1E1E",
              },
            ]}
            onPress={() => setActiveFilter("revoked")}
          >
            <LinearGradient
              colors={activeFilter === "revoked" ? ["#FF5555", "#CC0000"] : ["#141414", "#1E1E1E"]}
              style={styles.filterGradient}
            >
              <Text style={[styles.filterText, { opacity: activeFilter === "revoked" ? 1 : 0.6 }]}>Revoked</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingContainer}>
          {[1, 2, 3].map((_, index) => (
            <ConsentSkeleton key={index} />
          ))}
        </View>
      ) : (
        <FlatList
          data={filteredConsents}
          renderItem={renderConsentItem}
          keyExtractor={(item) => item.id?.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyState}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#FFFFFF"
              colors={["#6a11cb", "#2575fc"]}
            />
          }
        />
      )}

      {/* Consent Action Menu Modal */}
      <Modal visible={menuVisible} transparent={true} animationType="fade" onRequestClose={() => setMenuVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setMenuVisible(false)}>
          <View style={styles.menuContainer}>
            <TouchableOpacity style={styles.menuItem} onPress={() => handleViewDetails(selectedConsent)}>
              <Ionicons name="eye-outline" size={22} color="#FFFFFF" />
              <Text style={styles.menuItemText}>View Details</Text>
            </TouchableOpacity>

            {selectedConsent?.status === "active" && (
              <TouchableOpacity style={[styles.menuItem, styles.deleteMenuItem]} onPress={handleRevokeConsent}>
                <Ionicons name="close-circle-outline" size={22} color="#FF5555" />
                <Text style={[styles.menuItemText, styles.deleteMenuItemText]}>Revoke Consent</Text>
              </TouchableOpacity>
            )}
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
  loadingContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 20,
  },
  filterScroll: {
    paddingVertical: 10,
  },
  filterButton: {
    marginRight: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
  filterGradient: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  filterText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#FFFFFF",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
    flexGrow: 1,
  },
  consentCard: {
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  consentCardGradient: {
    padding: 15,
  },
  consentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  consentTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    flex: 1,
    color: "#FFFFFF",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  documentInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 8,
    borderRadius: 8,
    marginBottom: 8,
  },
  documentTitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#FFFFFF",
    marginLeft: 8,
  },
  organizationText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 12,
    color: "#AAAAAA",
  },
  consentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#777777",
    marginLeft: 5,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginRight: 5,
    color: "#FFFFFF",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    marginHorizontal: 20,
    borderRadius: 12,
    overflow: "hidden",
  },
  emptyStateGradient: {
    padding: 30,
    alignItems: "center",
    width: "100%",
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
  // Menu Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  menuContainer: {
    width: "80%",
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

