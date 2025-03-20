"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, useColorScheme } from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useState } from "react"
import { useNavigation } from "expo-router"

export default function Settings() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const navigation = useNavigation()

  const [notifications, setNotifications] = useState(true)
  const [biometrics, setBiometrics] = useState(false)
  const [darkMode, setDarkMode] = useState(isDark)
  const [dataSync, setDataSync] = useState(true)

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#FFFFFF" }]}>
      <View style={[styles.header, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
        <Text style={[styles.headerTitle, { color: isDark ? "#FFFFFF" : "#000000" }]}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#FFFFFF" : "#000000" }]}>App Preferences</Text>

          <View style={[styles.settingItem, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="notifications-outline"
                size={22}
                color={isDark ? "#FFFFFF" : "#000000"}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: isDark ? "#FFFFFF" : "#000000" }]}>Notifications</Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: isDark ? "#333333" : "#E0E0E0", true: isDark ? "#333333" : "#E0E0E0" }}
              thumbColor={notifications ? (isDark ? "#FFFFFF" : "#000000") : isDark ? "#777777" : "#999999"}
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="moon-outline"
                size={22}
                color={isDark ? "#FFFFFF" : "#000000"}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: isDark ? "#FFFFFF" : "#000000" }]}>Dark Mode</Text>
            </View>
            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{ false: isDark ? "#333333" : "#E0E0E0", true: isDark ? "#333333" : "#E0E0E0" }}
              thumbColor={darkMode ? (isDark ? "#FFFFFF" : "#000000") : isDark ? "#777777" : "#999999"}
            />
          </View>

          <View style={[styles.settingItem, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="sync-outline"
                size={22}
                color={isDark ? "#FFFFFF" : "#000000"}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: isDark ? "#FFFFFF" : "#000000" }]}>Data Synchronization</Text>
            </View>
            <Switch
              value={dataSync}
              onValueChange={setDataSync}
              trackColor={{ false: isDark ? "#333333" : "#E0E0E0", true: isDark ? "#333333" : "#E0E0E0" }}
              thumbColor={dataSync ? (isDark ? "#FFFFFF" : "#000000") : isDark ? "#777777" : "#999999"}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#FFFFFF" : "#000000" }]}>Security</Text>

          <View style={[styles.settingItem, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="finger-print-outline"
                size={22}
                color={isDark ? "#FFFFFF" : "#000000"}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: isDark ? "#FFFFFF" : "#000000" }]}>
                Biometric Authentication
              </Text>
            </View>
            <Switch
              value={biometrics}
              onValueChange={setBiometrics}
              trackColor={{ false: isDark ? "#333333" : "#E0E0E0", true: isDark ? "#333333" : "#E0E0E0" }}
              thumbColor={biometrics ? (isDark ? "#FFFFFF" : "#000000") : isDark ? "#777777" : "#999999"}
            />
          </View>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={isDark ? "#FFFFFF" : "#000000"}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: isDark ? "#FFFFFF" : "#000000" }]}>Change Password</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color={isDark ? "#777777" : "#999999"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="shield-checkmark-outline"
                size={22}
                color={isDark ? "#FFFFFF" : "#000000"}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: isDark ? "#FFFFFF" : "#000000" }]}>Privacy Settings</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color={isDark ? "#777777" : "#999999"} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#FFFFFF" : "#000000" }]}>About</Text>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="information-circle-outline"
                size={22}
                color={isDark ? "#FFFFFF" : "#000000"}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: isDark ? "#FFFFFF" : "#000000" }]}>App Information</Text>
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
              <Text style={[styles.settingText, { color: isDark ? "#FFFFFF" : "#000000" }]}>Terms of Service</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={16} color={isDark ? "#777777" : "#999999"} />
          </TouchableOpacity>

          <TouchableOpacity style={[styles.settingItem, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
            <View style={styles.settingInfo}>
              <Ionicons
                name="shield-outline"
                size={22}
                color={isDark ? "#FFFFFF" : "#000000"}
                style={styles.settingIcon}
              />
              <Text style={[styles.settingText, { color: isDark ? "#FFFFFF" : "#000000" }]}>Privacy Policy</Text>
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
})

