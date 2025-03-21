"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons, FontAwesome5 } from "@expo/vector-icons"
import { useState } from "react"
import { useNavigation } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function WalletSettings() {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const [walletAddress, setWalletAddress] = useState("0x71C7656EC7ab88b098defB751B7401B5f6d8976F")

  return (
    <LinearGradient colors={["#000000", "#121212"]} style={styles.container}>
      <View style={[styles.header, { marginTop: insets.top }]}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            // @ts-ignore
            navigation.openDrawer()
          }}
        >
          <Ionicons name="menu-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wallet Settings</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.walletCard}>
          <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.walletCardContent}>
            <View style={styles.walletHeader}>
              <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.walletIconContainer}>
                <FontAwesome5 name="ethereum" size={24} color="#FFFFFF" />
              </LinearGradient>
              <Text style={styles.walletTitle}>Ethereum Wallet</Text>
            </View>

            <View style={styles.walletAddressContainer}>
              <Text style={styles.walletAddressLabel}>Wallet Address</Text>
              <View style={styles.walletAddressRow}>
                <Text style={styles.walletAddress}>
                  {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                </Text>
                <TouchableOpacity style={styles.copyButton}>
                  <Ionicons name="copy-outline" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.walletActions}>
              <TouchableOpacity style={styles.walletActionButtonContainer}>
                <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.walletActionButton}>
                  <Ionicons name="swap-horizontal" size={20} color="#FFFFFF" />
                  <Text style={styles.walletActionText}>Transfer</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity style={styles.walletActionButtonContainer}>
                <LinearGradient colors={["#00b09b", "#96c93d"]} style={styles.walletActionButton}>
                  <Ionicons name="qr-code" size={20} color="#FFFFFF" />
                  <Text style={styles.walletActionText}>Show QR</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>

          <TouchableOpacity style={styles.settingItem}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.settingItemGradient}>
              <View style={styles.settingInfo}>
                <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.settingIconContainer}>
                  <Ionicons name="key-outline" size={22} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.settingText}>Export Private Key</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777777" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.settingItemGradient}>
              <View style={styles.settingInfo}>
                <LinearGradient colors={["#00b09b", "#96c93d"]} style={styles.settingIconContainer}>
                  <Ionicons name="document-text-outline" size={22} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.settingText}>Backup Seed Phrase</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777777" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.settingItemGradient}>
              <View style={styles.settingInfo}>
                <LinearGradient colors={["#ff9966", "#ff5e62"]} style={styles.settingIconContainer}>
                  <Ionicons name="lock-closed-outline" size={22} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.settingText}>Change PIN</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777777" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Network</Text>

          <TouchableOpacity style={styles.settingItem}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.settingItemGradient}>
              <View style={styles.settingInfo}>
                <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.settingIconContainer}>
                  <Ionicons name="globe-outline" size={22} color="#FFFFFF" />
                </LinearGradient>
                <View>
                  <Text style={styles.settingText}>Network</Text>
                  <Text style={styles.settingSubtext}>Ethereum Mainnet</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777777" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.settingItemGradient}>
              <View style={styles.settingInfo}>
                <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.settingIconContainer}>
                  <Ionicons name="speedometer-outline" size={22} color="#FFFFFF" />
                </LinearGradient>
                <View>
                  <Text style={styles.settingText}>Gas Settings</Text>
                  <Text style={styles.settingSubtext}>Standard</Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777777" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Advanced</Text>

          <TouchableOpacity style={styles.settingItem}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.settingItemGradient}>
              <View style={styles.settingInfo}>
                <LinearGradient colors={["#00b09b", "#96c93d"]} style={styles.settingIconContainer}>
                  <Ionicons name="trash-outline" size={22} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.settingText}>Clear Cache</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777777" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.settingItemGradient}>
              <View style={styles.settingInfo}>
                <LinearGradient colors={["#ff9966", "#ff5e62"]} style={styles.settingIconContainer}>
                  <Ionicons name="alert-circle-outline" size={22} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.settingText}>Reset Wallet</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777777" />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333333",
  },
  menuButton: {
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
  rightPlaceholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingTop: 20,
  },
  walletCard: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  walletCardContent: {
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  walletHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  walletIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  walletTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
  },
  walletAddressContainer: {
    marginBottom: 20,
  },
  walletAddressLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 5,
    color: "#AAAAAA",
  },
  walletAddressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  walletAddress: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  copyButton: {
    padding: 5,
  },
  walletActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  walletActionButtonContainer: {
    width: "48%",
    borderRadius: 8,
    overflow: "hidden",
  },
  walletActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  walletActionText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginLeft: 8,
    color: "#FFFFFF",
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 15,
    color: "#FFFFFF",
  },
  settingItem: {
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  settingItemGradient: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  settingText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  settingSubtext: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 2,
    color: "#AAAAAA",
  },
})

