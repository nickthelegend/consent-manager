"use client"

import { useState, useEffect, useCallback } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from "react-native"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { router } from "expo-router"
import { createClient } from "@supabase/supabase-js"
import { getStoredSession, getWalletAddress } from "../../utils/secure-storage"

// Add these imports at the top
import Animated, { FadeIn } from "react-native-reanimated"

// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://uorbdplqtxmcdhbnkbmf.supabase.co"
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcmJkcGxxdHhtY2RoYm5rYm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MjE0MTIsImV4cCI6MjA1ODE5NzQxMn0.h01gicHiW7yTjqT2JWCSYRmLAIzBMOlPg-kIy6q8Kk0"
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [walletAddress, setWalletAddress] = useState("")
  const [userId, setUserId] = useState("")

  // Dashboard data
  const [stats, setStats] = useState({
    activeConsents: 0,
    pendingReview: 0,
    totalDocuments: 0,
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [upcomingExpirations, setUpcomingExpirations] = useState([])

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

  // Fetch dashboard data
  const fetchDashboardData = useCallback(async () => {
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

      // Fetch consent statistics
      const { data: consentsData, error: consentsError } = await supabase
        .from("user_consents")
        .select("id, status")
        .eq("wallet_address", walletAddress)

      if (consentsError) {
        console.error("Error fetching consents:", consentsError)
      } else {
        // Count active and pending consents
        const activeCount = consentsData.filter((c) => c.status === "active").length
        const pendingCount = consentsData.filter((c) => c.status === "pending").length

        // Update stats
        setStats((prev) => ({
          ...prev,
          activeConsents: activeCount,
          pendingReview: pendingCount,
        }))
      }

      // Fetch document count
      const { count: documentsCount, error: documentsError } = await supabase
        .from("user_uploads")
        .select("id", { count: "exact", head: true })
        .eq("wallet_address", walletAddress)

      if (!documentsError) {
        setStats((prev) => ({
          ...prev,
          totalDocuments: documentsCount || 0,
        }))
      }

      // Fetch recent activity (latest 5 consents)
      const { data: recentData, error: recentError } = await supabase
        .from("user_consents")
        .select(`
          id,
          title,
          status,
          created_at,
          user_uploads:document_id (
            title,
            category,
            file_type
          )
        `)
        .eq("wallet_address", walletAddress)
        .order("created_at", { ascending: false })
        .limit(5)

      if (!recentError) {
        setRecentActivity(recentData || [])
      }

      // Fetch upcoming expirations (consents expiring in the next 30 days)
      const now = new Date()
      const thirtyDaysFromNow = new Date()
      thirtyDaysFromNow.setDate(now.getDate() + 30)

      const { data: expiringData, error: expiringError } = await supabase
        .from("user_consents")
        .select("id, title, expires_at")
        .eq("wallet_address", walletAddress)
        .eq("status", "active")
        .gte("expires_at", now.toISOString())
        .lte("expires_at", thirtyDaysFromNow.toISOString())
        .order("expires_at", { ascending: true })
        .limit(3)

      if (!expiringError) {
        setUpcomingExpirations(expiringData || [])
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [walletAddress])

  // Initial fetch
  useEffect(() => {
    if (walletAddress) {
      fetchDashboardData()
    }
  }, [walletAddress, fetchDashboardData])

  // Handle pull-to-refresh
  const onRefresh = useCallback(() => {
    setRefreshing(true)
    fetchDashboardData()
  }, [fetchDashboardData])

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
  }

  // Calculate days until expiry
  const getDaysUntilExpiry = (expiryDateString) => {
    const now = new Date()
    const expiryDate = new Date(expiryDateString)
    const diffTime = Math.abs(expiryDate - now)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Get status icon and colors
  const getStatusInfo = (status) => {
    switch (status) {
      case "active":
        return {
          icon: "checkmark-circle",
          colors: ["#00c6ff", "#0072ff"],
        }
      case "pending":
        return {
          icon: "time",
          colors: ["#ff9966", "#ff5e62"],
        }
      case "expired":
        return {
          icon: "alert-circle",
          colors: ["#333333", "#1a1a1a"],
        }
      case "revoked":
        return {
          icon: "close-circle",
          colors: ["#fc4a1a", "#f7b733"],
        }
      default:
        return {
          icon: "document-text",
          colors: ["#6a11cb", "#2575fc"],
        }
    }
  }

  // Handle view consent details
  const handleViewConsentDetails = (consentId) => {
    router.push({
      pathname: "/(consents)/view-details",
      params: { consentId },
    })
  }

  // Handle renew consent
  const handleRenewConsent = (consentId) => {
    // Navigate to the consent details page where the user can update the expiry date
    router.push({
      pathname: "/(consents)/view-details",
      params: { consentId },
    })
  }

  // Replace the loading condition (around line 190) with this skeleton implementation
  if (loading && !refreshing) {
    return (
      <LinearGradient colors={["#000000", "#121212"]} style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Stats Skeleton */}
          <View style={styles.statsContainer}>
            {[1, 2].map((_, index) => (
              <View key={index} style={[styles.statCard, { backgroundColor: "#121212" }]}>
                <View style={[styles.statGradient, { backgroundColor: "#1A1A1A", padding: 20, alignItems: "center" }]}>
                  <View style={{ width: 28, height: 28, borderRadius: 14, backgroundColor: "#222222" }} />
                  <View style={{ width: 60, height: 32, borderRadius: 4, backgroundColor: "#222222", marginTop: 10 }} />
                  <View style={{ width: 100, height: 14, borderRadius: 4, backgroundColor: "#222222", marginTop: 8 }} />
                </View>
              </View>
            ))}
          </View>

          {/* Recent Activity Skeleton */}
          <View style={styles.recentActivityContainer}>
            <View style={{ width: 150, height: 18, borderRadius: 4, backgroundColor: "#222222", marginBottom: 15 }} />

            {[1, 2, 3].map((_, index) => (
              <View key={index} style={[styles.activityCard, { backgroundColor: "#121212" }]}>
                <View
                  style={[
                    styles.activityCardGradient,
                    { backgroundColor: "#1A1A1A", flexDirection: "row", padding: 15 },
                  ]}
                >
                  <View
                    style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: "#222222", marginRight: 15 }}
                  />
                  <View style={{ flex: 1 }}>
                    <View
                      style={{ width: "70%", height: 16, borderRadius: 4, backgroundColor: "#222222", marginBottom: 8 }}
                    />
                    <View style={{ width: "50%", height: 14, borderRadius: 4, backgroundColor: "#222222" }} />
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Upcoming Expirations Skeleton */}
          <View style={styles.upcomingContainer}>
            <View style={{ width: 180, height: 18, borderRadius: 4, backgroundColor: "#222222", marginBottom: 15 }} />

            {[1, 2].map((_, index) => (
              <View key={index} style={[styles.expirationCard, { backgroundColor: "#121212" }]}>
                <View
                  style={[styles.expirationGradient, { backgroundColor: "#1A1A1A", flexDirection: "row", padding: 15 }]}
                >
                  <View style={{ flex: 1 }}>
                    <View
                      style={{ width: "60%", height: 16, borderRadius: 4, backgroundColor: "#222222", marginBottom: 8 }}
                    />
                    <View style={{ width: "40%", height: 14, borderRadius: 4, backgroundColor: "#222222" }} />
                  </View>
                  <View style={{ width: 70, height: 30, borderRadius: 20, backgroundColor: "#222222" }} />
                </View>
              </View>
            ))}
          </View>

          {/* Documents Summary Skeleton */}
          <View style={styles.documentsContainer}>
            <View style={{ width: 150, height: 18, borderRadius: 4, backgroundColor: "#222222", marginBottom: 15 }} />

            <View style={[styles.documentsSummaryCard, { backgroundColor: "#121212" }]}>
              <View style={[styles.documentsSummaryGradient, { backgroundColor: "#1A1A1A", padding: 20 }]}>
                <View style={styles.documentsSummaryContent}>
                  <View style={{ width: 40, height: 40, borderRadius: 4, backgroundColor: "#222222" }} />
                  <View style={{ width: 40, height: 28, borderRadius: 4, backgroundColor: "#222222", marginTop: 10 }} />
                  <View style={{ width: 120, height: 14, borderRadius: 4, backgroundColor: "#222222", marginTop: 8 }} />
                </View>

                <View style={{ height: 40, borderRadius: 8, backgroundColor: "#222222" }} />
              </View>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    )
  }

  // Wrap the actual content in Animated.View with FadeIn animation (around line 193)
  return (
    <LinearGradient colors={["#000000", "#121212"]} style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
            colors={["#6a11cb", "#2575fc"]}
          />
        }
      >
        <Animated.View entering={FadeIn.duration(500)}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={["#4a00e0", "#8e2de2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statGradient}
              >
                <MaterialCommunityIcons name="file-document-outline" size={28} color="#FFFFFF" />
                <Text style={styles.statNumber}>{stats.activeConsents}</Text>
                <Text style={styles.statLabel}>Active Consents</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={["#00b09b", "#96c93d"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.statGradient}
              >
                <MaterialCommunityIcons name="clock-outline" size={28} color="#FFFFFF" />
                <Text style={styles.statNumber}>{stats.pendingReview}</Text>
                <Text style={styles.statLabel}>Pending Review</Text>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.recentActivityContainer}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>

            {recentActivity.length === 0 ? (
              <View style={styles.emptyStateCard}>
                <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.emptyStateGradient}>
                  <MaterialCommunityIcons name="clipboard-text-outline" size={40} color="#333333" />
                  <Text style={styles.emptyStateText}>No recent activity</Text>
                </LinearGradient>
              </View>
            ) : (
              recentActivity.map((activity) => {
                const statusInfo = getStatusInfo(activity.status)
                const timeAgo = formatDate(activity.created_at)

                return (
                  <TouchableOpacity
                    key={activity.id}
                    style={styles.activityCard}
                    onPress={() => handleViewConsentDetails(activity.id)}
                  >
                    <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.activityCardGradient}>
                      <View style={styles.activityIconContainer}>
                        <LinearGradient colors={statusInfo.colors} style={styles.activityIconGradient}>
                          <Ionicons name={statusInfo.icon} size={24} color="#FFFFFF" />
                        </LinearGradient>
                      </View>
                      <View style={styles.activityContent}>
                        <Text style={styles.activityTitle}>{activity.title}</Text>
                        <Text style={styles.activitySubtitle}>
                          {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)} • {timeAgo}
                        </Text>
                      </View>
                    </LinearGradient>
                  </TouchableOpacity>
                )
              })
            )}
          </View>

          <View style={styles.upcomingContainer}>
            <Text style={styles.sectionTitle}>Upcoming Expirations</Text>

            {upcomingExpirations.length === 0 ? (
              <View style={styles.emptyStateCard}>
                <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.emptyStateGradient}>
                  <MaterialCommunityIcons name="calendar-check-outline" size={40} color="#333333" />
                  <Text style={styles.emptyStateText}>No upcoming expirations</Text>
                </LinearGradient>
              </View>
            ) : (
              upcomingExpirations.map((expiration) => {
                const daysUntil = getDaysUntilExpiry(expiration.expires_at)

                return (
                  <View key={expiration.id} style={styles.expirationCard}>
                    <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.expirationGradient}>
                      <View style={styles.expirationContent}>
                        <Text style={styles.expirationTitle}>{expiration.title}</Text>
                        <Text style={styles.expirationDate}>Expires in {daysUntil} days</Text>
                      </View>
                      <TouchableOpacity onPress={() => handleRenewConsent(expiration.id)}>
                        <LinearGradient
                          colors={["#6a11cb", "#2575fc"]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                          style={styles.renewButton}
                        >
                          <Text style={styles.renewButtonText}>Renew</Text>
                        </LinearGradient>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                )
              })
            )}
          </View>

          <View style={styles.documentsContainer}>
            <Text style={styles.sectionTitle}>Your Documents</Text>

            <View style={styles.documentsSummaryCard}>
              <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.documentsSummaryGradient}>
                <View style={styles.documentsSummaryContent}>
                  <MaterialCommunityIcons name="folder-multiple-outline" size={40} color="#6a11cb" />
                  <Text style={styles.documentsSummaryNumber}>{stats.totalDocuments}</Text>
                  <Text style={styles.documentsSummaryText}>Total Documents</Text>
                </View>

                <TouchableOpacity style={styles.viewAllButton} onPress={() => router.push("/(tabs)/documents")}>
                  <Text style={styles.viewAllButtonText}>View All</Text>
                  <Ionicons name="arrow-forward" size={16} color="#6a11cb" />
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
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
  scrollView: {
    flex: 1,
    paddingTop: 20,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 10,
  },
  statCard: {
    width: "48%",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  statGradient: {
    padding: 20,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 32,
    fontFamily: "Poppins-Bold",
    marginTop: 10,
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
    opacity: 0.9,
  },
  recentActivityContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 15,
    color: "#FFFFFF",
  },
  activityCard: {
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  activityCardGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
  },
  activityIconContainer: {
    marginRight: 15,
  },
  activityIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  activitySubtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#AAAAAA",
  },
  upcomingContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  expirationCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  expirationGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  expirationContent: {
    flex: 1,
  },
  expirationTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  expirationDate: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#AAAAAA",
  },
  renewButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  renewButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  emptyStateCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 10,
  },
  emptyStateGradient: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#777777",
    marginTop: 10,
  },
  documentsContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  documentsSummaryCard: {
    borderRadius: 12,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  documentsSummaryGradient: {
    padding: 20,
  },
  documentsSummaryContent: {
    alignItems: "center",
    marginBottom: 15,
  },
  documentsSummaryNumber: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
    marginTop: 10,
  },
  documentsSummaryText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#AAAAAA",
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(106, 17, 203, 0.1)",
    padding: 12,
    borderRadius: 8,
  },
  viewAllButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#6a11cb",
    marginRight: 8,
  },
  shimmer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
})

