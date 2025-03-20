"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, useColorScheme } from "react-native"
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons"
import { useState } from "react"
import { useNavigation } from "expo-router"

export default function WalletSettings() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const navigation = useNavigation()

  const [walletAddress, setWalletAddress] = useState("0x71C7656EC7ab88b098defB751B7401B5f6d8976F")

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#FFFFFF" }]}>
      <View style={[styles.header, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
        <Text style={[styles.headerTitle, { color: isDark ? "#FFFFFF" : "#000000" }]}>Wallet Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.walletCard}>
          <View style={[styles.walletCardContent, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
            <View style={styles.walletHeader}>
              <FontAwesome5 name="ethereum" size={24} color={isDark ? "#FFFFFF" : "#000000"} />
              <Text style={[styles.walletTitle, { color: isDark ? "#FFFFFF" : "#000000" }]}>Ethereum Wallet</Text>
            </View>

            <View style={styles.walletAddressContainer}>
              <Text style={[styles.walletAddressLabel, { color: isDark ? "#AAAAAA" : "#666666" }]}>Wallet Address</Text>
              <View style={styles.walletAddressRow}>
                <Text style={[styles.walletAddress, { color: isDark ? "#FFFFFF" : "#000000" }]}>
                  {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
                </Text>
                <TouchableOpacity style={styles.copyButton}>
                  <Ionicons name="copy-outline" size={20} color={isDark ? "#FFFFFF" : "#000000"} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.walletActions}>
              <TouchableOpacity
                style={[styles.walletActionButton, { backgroundColor: isDark ? "#333333" : "#E0E0E0" }]}
              >
                <Ionicons name="swap-horizontal" size={20} color={isDark ? "#FFFFFF" : "#000000"} />
                <Text style={[styles.walletActionText, { color: isDark ? "#FFFFFF" : "#000000" }]}>Transfer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.walletActionButton, { backgroundColor: isDark ? "#333333" : "#E0E0E0" }]}
              >
                <Ionicons name="qr-code" size={20} color={isDark ? "#FFFFFF" : "#000000"} />
                <Text style={[styles.walletActionText, { color: isDark ? "#FFFFFF" : "#000000" }]}>Show QR</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#FFFFFF" : "#000000" }]}>Security</Text>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="key-outline"
                size={22}
                color={isDark ? "#FFFFFF" : "#000000"}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: isDark ? "#FFFFFF" : "#000000" }]}>Export Private Key</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color={isDark ? "#777777" : "#999999"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="document-text-outline"
                size={22}
                color={isDark ? "#FFFFFF" : "#000000"}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: isDark ? "#FFFFFF" : "#000000" }]}>Backup Seed Phrase</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color={isDark ? "#777777" : "#999999"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={isDark ? "#FFFFFF" : "#000000"}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: isDark ? "#FFFFFF" : "#000000" }]}>Change PIN</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color={isDark ? "#777777" : "#999999"} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#FFFFFF" : "#000000" }]}>Network</Text>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="globe-outline"
                size={22}
                color={isDark ? "#FFFFFF" : "#000000"}
                style={styles.settingIcon}
              />
              <View>
                <Text style={[styles.settingText, { color: isDark ? "#FFFFFF" : "#000000" }]}>Network</Text>
                <Text style={[styles.settingSubtext, { color: isDark ? "#AAAAAA" : "#666666" }]}>Ethereum Mainnet</Text>
              </View>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color={isDark ? "#777777" : "#999999"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="speedometer-outline"
                size={22}
                color={isDark ? "#FFFFFF" : "#000000"}
                style={styles.settingIcon}
              />
              <View>
                <Text style={[styles.settingText, { color: isDark ? "#FFFFFF" : "#000000" }]}>Gas Settings</Text>
                <Text style={[styles.settingSubtext, { color: isDark ? "#AAAAAA" : "#666666" }]}>Standard</Text>
              </View>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color={isDark ? "#777777" : "#999999"} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#FFFFFF" : "#000000" }]}>Advanced</Text>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="trash-outline"
                size={22}
                color={isDark ? "#FFFFFF" : "#000000"}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: isDark ? "#FFFFFF" : "#000000" }]}>Clear Cache</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color={isDark ? "#777777" : "#999999"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.settingItem,
              {
                backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5",
                borderColor: isDark ? "#333333" : "#E0E0E0",
                borderWidth: 1,
              },
            ]}
          >
            <View style={styles.settingInfo}>
              <Ionicons
                name="alert-circle-outline"
                size={22}
                color={isDark ? "#FFFFFF" : "#000000"}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: isDark ? "#FFFFFF" : "#000000" }]}>Reset Wallet</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color={isDark ? "#777777" : "#999999"} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
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
    borderBottomColor: "#E0E0E0",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
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
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  walletHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  walletTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginLeft: 10,
  },
  walletAddressContainer: {
    marginBottom: 20,
  },
  walletAddressLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 5,
  },
  walletAddressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  walletAddress: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  copyButton: {
    padding: 5,
  },
  walletActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  walletActionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    width: "48%",
  },
  walletActionText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginLeft: 8,
  },
  section: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 15,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  settingInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  settingIcon: {
    marginRight: 15,
  },
  settingText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  settingSubtext: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 2,
  },
})

