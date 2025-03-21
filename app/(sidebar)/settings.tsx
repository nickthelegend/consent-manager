"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { useNavigation } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function Settings() {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  const [notifications, setNotifications] = useState(true)
  const [biometrics, setBiometrics] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [dataSync, setDataSync] = useState(true)

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
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Preferences</Text>

          <View style={styles.settingItem}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.settingItemGradient}>
              <View style={styles.settingInfo}>
                <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.settingIconContainer}>
                  <Ionicons name="notifications-outline" size={22} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.settingText}>Notifications</Text>
              </View>
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: "#333333", true: "#6a11cb" }}
                thumbColor={notifications ? "#FFFFFF" : "#777777"}
              />
            </LinearGradient>
          </View>

          <View style={styles.settingItem}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.settingItemGradient}>
              <View style={styles.settingInfo}>
                <LinearGradient colors={["#00b09b", "#96c93d"]} style={styles.settingIconContainer}>
                  <Ionicons name="moon-outline" size={22} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.settingText}>Dark Mode</Text>
              </View>
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: "#333333", true: "#6a11cb" }}
                thumbColor={darkMode ? "#FFFFFF" : "#777777"}
              />
            </LinearGradient>
          </View>

          <View style={styles.settingItem}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.settingItemGradient}>
              <View style={styles.settingInfo}>
                <LinearGradient colors={["#ff9966", "#ff5e62"]} style={styles.settingIconContainer}>
                  <Ionicons name="sync-outline" size={22} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.settingText}>Data Synchronization</Text>
              </View>
              <Switch
                value={dataSync}
                onValueChange={setDataSync}
                trackColor={{ false: "#333333", true: "#6a11cb" }}
                thumbColor={dataSync ? "#FFFFFF" : "#777777"}
              />
            </LinearGradient>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security</Text>

          <View style={styles.settingItem}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.settingItemGradient}>
              <View style={styles.settingInfo}>
                <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.settingIconContainer}>
                  <Ionicons name="finger-print-outline" size={22} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.settingText}>Biometric Authentication</Text>
              </View>
              <Switch
                value={biometrics}
                onValueChange={setBiometrics}
                trackColor={{ false: "#333333", true: "#6a11cb" }}
                thumbColor={biometrics ? "#FFFFFF" : "#777777"}
              />
            </LinearGradient>
          </View>

          <TouchableOpacity style={styles.settingItem}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.settingItemGradient}>
              <View style={styles.settingInfo}>
                <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.settingIconContainer}>
                  <Ionicons name="lock-closed-outline" size={22} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.settingText}>Change Password</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777777" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.settingItemGradient}>
              <View style={styles.settingInfo}>
                <LinearGradient colors={["#00b09b", "#96c93d"]} style={styles.settingIconContainer}>
                  <Ionicons name="shield-checkmark-outline" size={22} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.settingText}>Privacy Settings</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777777" />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity style={styles.settingItem}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.settingItemGradient}>
              <View style={styles.settingInfo}>
                <LinearGradient colors={["#ff9966", "#ff5e62"]} style={styles.settingIconContainer}>
                  <Ionicons name="information-circle-outline" size={22} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.settingText}>App Information</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777777" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.settingItemGradient}>
              <View style={styles.settingInfo}>
                <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.settingIconContainer}>
                  <Ionicons name="document-text-outline" size={22} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.settingText}>Terms of Service</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#777777" />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.settingItemGradient}>
              <View style={styles.settingInfo}>
                <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.settingIconContainer}>
                  <Ionicons name="shield-outline" size={22} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.settingText}>Privacy Policy</Text>
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
})

