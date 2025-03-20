"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"

export default function Profile() {
  // Replace the colorScheme and isDark variables with a forced dark theme
  // Remove these lines:
  // const colorScheme = useColorScheme()
  // const isDark = colorScheme === "dark"

  // Update the return statement to use black theme
  return (
    <View style={[styles.container, { backgroundColor: "#000000" }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image source={require("../../assets/images/icon.png")} style={styles.profileImage} />
            <TouchableOpacity style={[styles.editImageButton, { backgroundColor: "#1E1E1E" }]}>
              <Ionicons name="camera" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.profileName, { color: "#FFFFFF" }]}>John Doe</Text>
          <Text style={[styles.profileEmail, { color: "#AAAAAA" }]}>john.doe@example.com</Text>
          <TouchableOpacity style={[styles.editProfileButton, { backgroundColor: "#1E1E1E" }]}>
            <Text style={[styles.editProfileText, { color: "#FFFFFF" }]}>Edit Profile</Text>
          </TouchableOpacity>
        </View>

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

