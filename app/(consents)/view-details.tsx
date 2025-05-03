"use client"

import { useState, useEffect } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert, Share } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons, FontAwesome5 } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { createClient } from "@supabase/supabase-js"
import { getStoredSession } from "../../utils/secure-storage"
// Update the import statement to use QRCodeStyled
import QRCodeStyled from "react-native-qrcode-styled"
import algosdk, { base64ToBytes } from "algosdk"
// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://uorbdplqtxmcdhbnkbmf.supabase.co"
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcmJkcGxxdHhtY2RoYm5rYm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MjE0MTIsImV4cCI6MjA1ODE5NzQxMn0.h01gicHiW7yTjqT2JWCSYRmLAIzBMOlPg-kIy6q8Kk0"
const supabase = createClient(supabaseUrl, supabaseKey)

import * as SecureStore from "expo-secure-store"

export default function ViewConsentDetails() {
  const params = useLocalSearchParams()
  const { consentId } = params

  const [loading, setLoading] = useState(true)
  const [consent, setConsent] = useState(null)
  const [document, setDocument] = useState(null)

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [account, setAccount] = useState<algosdk.Account | null>(null);
  const [error, setError] = useState<string | null>(null);


   useEffect(() => {
    const fetchWalletDetails = async () => {
      try {
        const mnemonic = await SecureStore.getItemAsync("walletMnemonic");
        if (!mnemonic) throw new Error("No mnemonic found");

        const derivedAccount = algosdk.mnemonicToSecretKey(mnemonic);

        const storedWalletAddress = await SecureStore.getItemAsync("walletAddress");
        if (!storedWalletAddress) throw new Error("Wallet not found");





        setWalletAddress(storedWalletAddress);
        setAccount(derivedAccount);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchWalletDetails();
  }, []);

  // Fetch consent and document data
  useEffect(() => {
    const fetchData = async () => {
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

        // Fetch consent details
        if (consentId) {
          const { data: consentData, error: consentError } = await supabase
            .from("user_consents")
            .select("*")
            .eq("id", consentId)
            .single()
          console.log(consentData)
          if (consentError) {
            console.error("Error fetching consent:", consentError)
            Alert.alert("Error", "Failed to load consent details")
            router.back()
            return
          }

          if (consentData) {
            setConsent(consentData)

            const json= { "applicationID": consentData.app_id, "wallet_address":consentData.wallet_address}
            const data = JSON.stringify(json);
            if (!account) {
              throw new Error("Account is not available yet");
            }
            const signedData = algosdk.signBytes(algosdk.coerceToBytes(data),account.sk);
            console.log(algosdk.bytesToBase64(signedData))
            const base64data= algosdk.bytesToBase64(signedData);


            const result = algosdk.verifyBytes(algosdk.coerceToBytes(data),algosdk.base64ToBytes(base64data),account.addr)
            console.log(result)
            // Fetch document details
            if (consentData.document_id) {
              const { data: documentData, error: documentError } = await supabase
                .from("user_uploads")
                .select("*")
                .eq("id", consentData.document_id)
                .single()

              if (documentError) {
                console.error("Error fetching document:", documentError)
              } else {
                setDocument(documentData)
              }
            }
          } else {
            Alert.alert("Error", "Consent not found")
            router.back()
          }
        } else {
          Alert.alert("Error", "No consent ID provided")
          router.back()
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        Alert.alert("Error", "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [consentId])

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "No expiry date"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#00c6ff"
      case "pending":
        return "#ff9966"
      case "expired":
        return "#777777"
      case "revoked":
        return "#FF5555"
      default:
        return "#FFFFFF"
    }
  }

  // Get access type label
  const getAccessTypeLabel = (type) => {
    switch (type) {
      case "view":
        return "View Only"
      case "download":
        return "Download"
      case "edit":
        return "Edit"
      default:
        return "Unknown"
    }
  }

  // Handle share URL
  const handleShareUrl = async () => {
    if (!consent?.signed_url) {
      Alert.alert("Error", "No signed URL available")
      return
    }

    try {
      await Share.share({
        message: `Access document: ${consent.signed_url}`,
        title: `Shared Document: ${consent.title}`,
      })
    } catch (error) {
      console.error("Error sharing URL:", error)
      Alert.alert("Error", "Failed to share URL")
    }
  }

  // Handle revoke consent
  const handleRevokeConsent = async () => {
    if (!consent || consent.status !== "active") return

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
              const { error } = await supabase.from("user_consents").update({ status: "revoked" }).eq("id", consent.id)

              if (error) {
                throw error
              }

              // Update local state
              setConsent({ ...consent, status: "revoked" })
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

  if (loading) {
    return (
      <LinearGradient colors={["#000000", "#121212"]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6a11cb" />
        <Text style={styles.loadingText}>Loading consent details...</Text>
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
          <Text style={styles.headerTitle}>Consent Details</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {consent && (
              <>
                <View style={styles.statusContainer}>
                  <Text style={styles.statusLabel}>Status</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(consent.status) }]}>
                    <Text style={styles.statusText}>
                      {consent.status.charAt(0).toUpperCase() + consent.status.slice(1)}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailsCard}>
                  <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.detailsCardGradient}>
                    <Text style={styles.consentTitle}>{consent.title}</Text>

                    {consent.description && (
                      <View style={styles.descriptionContainer}>
                        <Text style={styles.descriptionText}>{consent.description}</Text>
                      </View>
                    )}

                    <View style={styles.detailsRow}>
                      <View style={styles.detailsItem}>
                        <Text style={styles.detailsLabel}>Organization</Text>
                        <Text style={styles.detailsValue}>{consent.organization}</Text>
                      </View>
                    </View>

                    <View style={styles.detailsRow}>
                      <View style={styles.detailsItem}>
                        <Text style={styles.detailsLabel}>Access Type</Text>
                        <Text style={styles.detailsValue}>{getAccessTypeLabel(consent.access_type)}</Text>
                      </View>
                    </View>

                    <View style={styles.detailsRow}>
                      <View style={styles.detailsItem}>
                        <Text style={styles.detailsLabel}>Created</Text>
                        <Text style={styles.detailsValue}>{formatDate(consent.created_at)}</Text>
                      </View>
                    </View>

                    <View style={styles.detailsRow}>
                      <View style={styles.detailsItem}>
                        <Text style={styles.detailsLabel}>Expires</Text>
                        <Text style={styles.detailsValue}>
                          {consent.expires_at ? formatDate(consent.expires_at) : "No expiry date"}
                        </Text>
                      </View>
                    </View>
                  </LinearGradient>
                </View>

                {document && (
                  <View style={styles.documentCard}>
                    <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.documentCardGradient}>
                      <Text style={styles.sectionTitle}>Document</Text>

                      <View style={styles.documentInfo}>
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

                        <View style={styles.documentDetails}>
                          <Text style={styles.documentTitle}>{document.title}</Text>
                          <Text style={styles.documentCategory}>
                            {document.category?.charAt(0).toUpperCase() + document.category?.slice(1) || "Other"}
                          </Text>
                        </View>
                      </View>

                      <TouchableOpacity
                        style={styles.viewDocumentButton}
                        onPress={() =>
                          router.push({ pathname: "/(documents)/view-document", params: { documentId: document.id } })
                        }
                      >
                        <LinearGradient colors={["#141414", "#333333"]} style={styles.viewDocumentButtonGradient}>
                          <Text style={styles.viewDocumentButtonText}>View Document</Text>
                          <Ionicons name="document-text-outline" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
                        </LinearGradient>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                )}

                {consent.signed_url && consent.status === "active" && (
                  <View style={styles.qrCodeCard}>
                    <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.qrCodeCardGradient}>
                      <Text style={styles.sectionTitle}>Access QR Code</Text>
                      <Text style={styles.qrCodeDescription}>
                        Scan this QR code to access the document. This link is valid until{" "}
                        {consent.expires_at ? formatDate(consent.expires_at) : "revoked"}.
                      </Text>

                      {/* Replace the QR code implementation with: */}
                      <View style={styles.qrCodeContainer}>
                        <QRCodeStyled
                          data={consent.signed_url}
                          pieceSize={4}
                          pieceBorderRadius={1}
                          isPiecesGlued
                          padding={8}
                          color="#7C3AED"
                          outerEyesOptions={{
                            topLeft: { borderRadius: 6 },
                            topRight: { borderRadius: 6 },
                            bottomLeft: { borderRadius: 6 },
                          }}
                          innerEyesOptions={{ borderRadius: 3 }}
                          style={{ backgroundColor: "white", width: "100%", height: undefined, aspectRatio: 1 }}
                        />
                      </View>

                      <TouchableOpacity style={styles.shareButton} onPress={handleShareUrl}>
                        <LinearGradient colors={["#141414", "#333333"]} style={styles.shareButtonGradient}>
                          <Text style={styles.shareButtonText}>Share URL</Text>
                          <Ionicons name="share-outline" size={18} color="#FFFFFF" style={{ marginLeft: 8 }} />
                        </LinearGradient>
                      </TouchableOpacity>
                    </LinearGradient>
                  </View>
                )}

                {consent.status === "active" && (
                  <TouchableOpacity style={styles.revokeButton} onPress={handleRevokeConsent}>
                    <LinearGradient colors={["#FF5555", "#CC0000"]} style={styles.revokeButtonGradient}>
                      <Text style={styles.revokeButtonText}>Revoke Consent</Text>
                      <Ionicons name="close-circle-outline" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
                    </LinearGradient>
                  </TouchableOpacity>
                )}
              </>
            )}
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
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  statusLabel: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  statusBadge: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  detailsCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  detailsCardGradient: {
    padding: 20,
  },
  consentTitle: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  descriptionContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#DDDDDD",
    lineHeight: 22,
  },
  detailsRow: {
    marginBottom: 12,
  },
  detailsItem: {
    marginBottom: 8,
  },
  detailsLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#AAAAAA",
    marginBottom: 4,
  },
  detailsValue: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#FFFFFF",
  },
  documentCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  documentCardGradient: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
    marginBottom: 15,
  },
  documentInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
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
  documentDetails: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  documentCategory: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#AAAAAA",
  },
  viewDocumentButton: {
    borderRadius: 8,
    overflow: "hidden",
  },
  viewDocumentButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  viewDocumentButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  qrCodeCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  qrCodeCardGradient: {
    padding: 20,
    alignItems: "center",
  },
  qrCodeDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#AAAAAA",
    textAlign: "center",
    marginBottom: 20,
  },
  qrCodeContainer: {
    backgroundColor: "#FFFFFF",
    padding: 8,
    borderRadius: 12,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  shareButton: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
  },
  shareButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
  },
  shareButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  revokeButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 30,
  },
  revokeButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  revokeButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
  },
})
