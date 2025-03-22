"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert, ActivityIndicator } from "react-native"
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import { router } from "expo-router"
import * as SecureStore from "expo-secure-store"
import * as Clipboard from "expo-clipboard"
import QRCodeStyled from "react-native-qrcode-styled"
import algosdk from "algosdk"
import { createClient } from "@supabase/supabase-js"
import { getStoredSession } from "../../utils/secure-storage"

export default function Profile() {
  const [publicAddress, setPublicAddress] = useState<string>("")
  const [algoBalance, setAlgoBalance] = useState<number>(0)
  const [algoPrice, setAlgoPrice] = useState<number>(0)
  const [copied, setCopied] = useState(false)
  const [transactionCount, setTransactionCount] = useState(0)
  // Add this after the existing useState declarations
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState("John Doe")
  const [userEmail, setUserEmail] = useState("john.doe@example.com")

  // Initialize Supabase client
  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://uorbdplqtxmcdhbnkbmf.supabase.co"
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcmJkcGxxdHhtY2RoYm5rYm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MjE0MTIsImV4cCI6MjA1ODE5NzQxMn0.h01gicHiW7yTjqT2JWCSYRmLAIzBMOlPg-kIy6q8Kk0"
const supabase = createClient(supabaseUrl, supabaseKey)
  // Add this useEffect to fetch user details
  useEffect(() => {
    fetchUserDetails()
  }, [])

  // Add this function to fetch user details
  const fetchUserDetails = async () => {
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

      // Get user email from session
      if (session.user?.email) {
        setUserEmail(session.user.email)
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
        setUserName(data.full_name)
        // Update email if it exists in the users table
        if (data.email) {
          setUserEmail(data.email)
        }
      }

      setLoading(false)
    } catch (error) {
      console.error("Error in fetchUserDetails:", error)
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWalletAddress()
  }, [])

  useEffect(() => {
    fetchAlgoPrice()
    const interval = setInterval(fetchAlgoPrice, 60000) // Refresh every minute
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (publicAddress) {
      fetchTransactionCount()
    }
  }, [publicAddress])

  const loadWalletAddress = async () => {
    try {
      setLoading(true)
      const address = await SecureStore.getItemAsync("walletAddress")

      if (address) {
        setPublicAddress(address)
        getAlgoBalance(address)
      } else {
        console.log("No wallet address found")
      }
    } catch (error) {
      console.error("Error loading wallet address:", error)
      Alert.alert("Error", "Failed to load wallet address")
    } finally {
      setLoading(false)
    }
  }

  const fetchAlgoPrice = async () => {
    try {
      const response = await fetch("https://mainnet.analytics.tinyman.org/api/v1/assets/0/")
      const data = await response.json()
      setAlgoPrice(Number(data.price_in_usd))
    } catch (error) {
      console.error("Error fetching ALGO price:", error)
    }
  }

  const getAlgoBalance = async (address: string) => {
    try {
      const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "")
      const accountInfo = await algodClient.accountInformation(address).do()

      // Set ALGO balance
      setAlgoBalance(Number(accountInfo.amount.toString()) / 1000000)
    } catch (error) {
      console.error("Error fetching account information:", error)
    }
  }

  const fetchTransactionCount = async () => {
    if (!publicAddress) return
    try {
      const response = await fetch(`https://testnet-idx.4160.nodely.dev/v2/accounts/${publicAddress}/transactions`)
      const data = await response.json()
      setTransactionCount(data.transactions?.length || 0)
    } catch (error) {
      console.error("Error fetching transaction count:", error)
    }
  }

  const copyToClipboard = async () => {
    if (publicAddress) {
      await Clipboard.setStringAsync(publicAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleSend = () => {
    router.push("/(profile)/send")
  }

  const handleReceive = () => {
    // Just scroll to QR code section
    // Or we could navigate to a dedicated receive screen if needed
  }

  const handleViewTransactions = () => {
    router.push("/(profile)/transactions")
  }

  return (
    <View style={[styles.container, { backgroundColor: "#000000" }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          {loading ? (
            <ActivityIndicator size="large" color="#7C3AED" style={{ marginVertical: 20 }} />
          ) : (
            <>
              <View style={styles.profileImageContainer}>
                <Image source={require("../../assets/images/icon.png")} style={styles.profileImage} />
                <TouchableOpacity style={[styles.editImageButton, { backgroundColor: "#1E1E1E" }]}>
                  <Ionicons name="camera" size={18} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
              <Text style={[styles.profileName, { color: "#FFFFFF" }]}>{userName}</Text>
              <Text style={[styles.profileEmail, { color: "#AAAAAA" }]}>{userEmail}</Text>
              <TouchableOpacity
                style={[styles.editProfileButton, { backgroundColor: "#1E1E1E" }]}
                onPress={() => router.push("/(profile)/edit-profile")}
              >
                <Text style={[styles.editProfileText, { color: "#FFFFFF" }]}>Edit Profile</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        {/* Wallet Balance Card */}
        <BlurView intensity={40} tint="dark" style={styles.walletCard}>
          <LinearGradient colors={["rgba(124, 58, 237, 0.1)", "rgba(0, 0, 0, 0)"]} style={StyleSheet.absoluteFill} />
          <View style={styles.walletHeader}>
            <FontAwesome5 name="wallet" size={24} color="#FFFFFF" />
            <Text style={styles.walletLabel}>ALGO Balance</Text>
          </View>
          <Text style={styles.walletAmount}>{algoBalance.toFixed(3)} ALGO</Text>
          <Text style={styles.walletUsd}>≈ ${(algoBalance * algoPrice).toFixed(2)} USD</Text>

          {/* QR Code */}
          {publicAddress && (
            <View style={styles.qrCodeContainer}>
              <View style={styles.qrCodeWrapper}>
                <QRCodeStyled
                  data={publicAddress}
                  pieceSize={8}
                  pieceBorderRadius={2}
                  isPiecesGlued
                  padding={16}
                  color="#ff521a"
                  outerEyesOptions={{
                    topLeft: { borderRadius: 12 },
                    topRight: { borderRadius: 12 },
                    bottomLeft: { borderRadius: 12 },
                  }}
                  innerEyesOptions={{ borderRadius: 6 }}
                  logo={{
                    href: require("../../assets/images/icon.png"),
                    padding: 4,
                    scale: 2,
                    hidePieces: false,
                    borderRadius: 12,
                  }}
                  style={{ backgroundColor: "white" }}
                />
              </View>
              <Text style={styles.qrCodeText}>Scan to get my wallet address</Text>
            </View>
          )}

          <View style={styles.addressSection}>
            <Text style={styles.addressLabel}>Wallet Address</Text>
            <View style={styles.addressContainer}>
              <Text style={styles.address} numberOfLines={1}>
                {publicAddress}
              </Text>
              <TouchableOpacity onPress={copyToClipboard} style={styles.copyButton}>
                {copied ? (
                  <Ionicons name="checkmark" size={16} color="#4ADE80" />
                ) : (
                  <Ionicons name="copy-outline" size={16} color="#FFFFFF" />
                )}
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={handleReceive}>
              <Ionicons name="arrow-down" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Receive</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleSend}>
              <Ionicons name="send" size={20} color="#FFFFFF" />
              <Text style={styles.actionButtonText}>Send</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionSection}>
            <View style={styles.transactionCount}>
              <Text style={styles.transactionLabel}>Total Transactions</Text>
              <Text style={styles.transactionNumber}>{transactionCount}</Text>
            </View>
            <TouchableOpacity style={styles.viewTransactionsButton} onPress={handleViewTransactions}>
              <Ionicons name="time-outline" size={20} color="#FFFFFF" />
              <Text style={styles.viewTransactionsText}>View Transactions</Text>
            </TouchableOpacity>
          </View>
        </BlurView>

        <View style={[styles.statsSection, { backgroundColor: "#121212" }]}>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: "#FFFFFF" }]}>12</Text>
            <Text style={[styles.statLabel, { color: "#AAAAAA" }]}>Consents</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "#1E1E1E" }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: "#FFFFFF" }]}>8</Text>
            <Text style={[styles.statLabel, { color: "#AAAAAA" }]}>Documents</Text>
          </View>
          <View style={[styles.statDivider, { backgroundColor: "#1E1E1E" }]} />
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: "#FFFFFF" }]}>3</Text>
            <Text style={[styles.statLabel, { color: "#AAAAAA" }]}>Organizations</Text>
          </View>
        </View>

        <View style={styles.menuSection}>
          <TouchableOpacity style={[styles.menuItem, { backgroundColor: "#121212" }]}>
            <View style={[styles.menuIconContainer, { backgroundColor: "#1E1E1E" }]}>
              <Ionicons name="shield-checkmark" size={22} color="#FFFFFF" />
            </View>
            <Text style={[styles.menuText, { color: "#FFFFFF" }]}>Privacy Settings</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#AAAAAA" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: "#121212" }]}>
            <View style={[styles.menuIconContainer, { backgroundColor: "#1E1E1E" }]}>
              <Ionicons name="notifications" size={22} color="#FFFFFF" />
            </View>
            <Text style={[styles.menuText, { color: "#FFFFFF" }]}>Notification Preferences</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#AAAAAA" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: "#121212" }]}>
            <View style={[styles.menuIconContainer, { backgroundColor: "#1E1E1E" }]}>
              <Ionicons name="people" size={22} color="#FFFFFF" />
            </View>
            <Text style={[styles.menuText, { color: "#FFFFFF" }]}>Connected Organizations</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#AAAAAA" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: "#121212" }]}>
            <View style={[styles.menuIconContainer, { backgroundColor: "#1E1E1E" }]}>
              <Ionicons name="lock-closed" size={22} color="#FFFFFF" />
            </View>
            <Text style={[styles.menuText, { color: "#FFFFFF" }]}>Security</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#AAAAAA" />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { backgroundColor: "#121212" }]}>
            <View style={[styles.menuIconContainer, { backgroundColor: "#1E1E1E" }]}>
              <Ionicons name="help-circle" size={22} color="#FFFFFF" />
            </View>
            <Text style={[styles.menuText, { color: "#FFFFFF" }]}>Help & Support</Text>
            <MaterialIcons name="arrow-forward-ios" size={16} color="#AAAAAA" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: "#121212" }]}>
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
          <Text style={[styles.logoutText, { color: "#FFFFFF" }]}>Log Out</Text>
        </TouchableOpacity>

        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: "#777777" }]}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    paddingTop: 20,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 15,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "white",
  },
  editImageButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  profileName: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    marginBottom: 5,
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 15,
  },
  editProfileButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  editProfileText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  // Wallet Card Styles
  walletCard: {
    borderRadius: 20,
    padding: 24,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    marginHorizontal: 20,
    marginBottom: 24,
  },
  walletHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  walletLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins-Medium",
  },
  walletAmount: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
    marginBottom: 4,
  },
  walletUsd: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 16,
    marginBottom: 16,
    fontFamily: "Poppins-Regular",
  },
  qrCodeContainer: {
    alignItems: "center",
    marginVertical: 20,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  qrCodeWrapper: {
    padding: 12,
    backgroundColor: "white",
    borderRadius: 16,
    shadowColor: "#7C3AED",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  qrCodeText: {
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    marginTop: 16,
    fontWeight: "500",
    fontFamily: "Poppins-Regular",
  },
  addressSection: {
    marginBottom: 16,
  },
  addressLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    marginBottom: 8,
    fontFamily: "Poppins-Regular",
  },
  addressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    borderRadius: 8,
  },
  address: {
    color: "#FFFFFF",
    flex: 1,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  copyButton: {
    padding: 4,
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 12,
    borderRadius: 12,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "Poppins-Medium",
  },
  transactionSection: {
    marginTop: 20,
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 12,
  },
  transactionCount: {
    marginBottom: 12,
  },
  transactionLabel: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  transactionNumber: {
    color: "#FFFFFF",
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "Poppins-Bold",
  },
  viewTransactionsButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "rgba(124, 58, 237, 0.1)",
    padding: 12,
    borderRadius: 8,
  },
  viewTransactionsText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "Poppins-Medium",
  },
  // Original styles
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 15,
    marginTop: 20,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
  statDivider: {
    width: 1,
    height: "70%",
  },
  menuSection: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 20,
    marginTop: 15,
    marginBottom: 10,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginLeft: 10,
  },
  versionContainer: {
    alignItems: "center",
    marginBottom: 30,
    marginTop: 10,
  },
  versionText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
  },
})

