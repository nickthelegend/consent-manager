"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

export default function Dashboard() {
  return (
    <LinearGradient colors={["#000000", "#121212"]} style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <LinearGradient
              colors={["#4a00e0", "#8e2de2"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.statGradient}
            >
              <MaterialCommunityIcons name="file-document-outline" size={28} color="#FFFFFF" />
              <Text style={styles.statNumber}>12</Text>
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
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Pending Review</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.recentActivityContainer}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>

          <View style={styles.activityCard}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.activityCardGradient}>
              <View style={styles.activityIconContainer}>
                <LinearGradient colors={["#00c6ff", "#0072ff"]} style={styles.activityIconGradient}>
                  <Ionicons name="checkmark-circle" size={24} color="#FFFFFF" />
                </LinearGradient>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Medical Data Consent</Text>
                <Text style={styles.activitySubtitle}>Approved • 2 days ago</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.activityCard}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.activityCardGradient}>
              <View style={styles.activityIconContainer}>
                <LinearGradient colors={["#ff9966", "#ff5e62"]} style={styles.activityIconGradient}>
                  <Ionicons name="time" size={24} color="#FFFFFF" />
                </LinearGradient>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Research Participation</Text>
                <Text style={styles.activitySubtitle}>Pending • 3 days ago</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.activityCard}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.activityCardGradient}>
              <View style={styles.activityIconContainer}>
                <LinearGradient colors={["#fc4a1a", "#f7b733"]} style={styles.activityIconGradient}>
                  <Ionicons name="close-circle" size={24} color="#FFFFFF" />
                </LinearGradient>
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Marketing Communications</Text>
                <Text style={styles.activitySubtitle}>Declined • 1 week ago</Text>
              </View>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.upcomingContainer}>
          <Text style={styles.sectionTitle}>Upcoming Expirations</Text>

          <View style={styles.expirationCard}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.expirationGradient}>
              <View style={styles.expirationContent}>
                <Text style={styles.expirationTitle}>Data Processing Consent</Text>
                <Text style={styles.expirationDate}>Expires in 5 days</Text>
              </View>
              <TouchableOpacity>
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
        </View>
      </ScrollView>
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
    color: "#FFFFFF",
  },
  notificationButton: {
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
    marginBottom: 100,
  },
  expirationCard: {
    borderRadius: 12,
    overflow: "hidden",
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
})

