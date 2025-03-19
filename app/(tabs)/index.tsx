import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"

export default function Dashboard() {
  return (
    <LinearGradient colors={["#4A00E0", "#8E2DE2"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Consent Dashboard</Text>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <LinearGradient
                colors={["#FF6B6B", "#FF8E8E"]}
                style={styles.statGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name="file-document-outline" size={28} color="white" />
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Active Consents</Text>
              </LinearGradient>
            </View>

            <View style={styles.statCard}>
              <LinearGradient
                colors={["#4ECDC4", "#26A69A"]}
                style={styles.statGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name="clock-outline" size={28} color="white" />
                <Text style={styles.statNumber}>3</Text>
                <Text style={styles.statLabel}>Pending Review</Text>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.recentActivityContainer}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>

            <View style={styles.activityCard}>
              <View style={styles.activityIconContainer}>
                <Ionicons name="checkmark-circle" size={24} color="#4ECDC4" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Medical Data Consent</Text>
                <Text style={styles.activitySubtitle}>Approved • 2 days ago</Text>
              </View>
            </View>

            <View style={styles.activityCard}>
              <View style={styles.activityIconContainer}>
                <Ionicons name="time" size={24} color="#FFD166" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Research Participation</Text>
                <Text style={styles.activitySubtitle}>Pending • 3 days ago</Text>
              </View>
            </View>

            <View style={styles.activityCard}>
              <View style={styles.activityIconContainer}>
                <Ionicons name="close-circle" size={24} color="#FF6B6B" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityTitle}>Marketing Communications</Text>
                <Text style={styles.activitySubtitle}>Declined • 1 week ago</Text>
              </View>
            </View>
          </View>

          <View style={styles.upcomingContainer}>
            <Text style={styles.sectionTitle}>Upcoming Expirations</Text>

            <View style={styles.expirationCard}>
              <LinearGradient
                colors={["#FFD166", "#F4A261"]}
                style={styles.expirationGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <View style={styles.expirationContent}>
                  <Text style={styles.expirationTitle}>Data Processing Consent</Text>
                  <Text style={styles.expirationDate}>Expires in 5 days</Text>
                </View>
                <TouchableOpacity style={styles.renewButton}>
                  <Text style={styles.renewButtonText}>Renew</Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
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
    color: "white",
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
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
    shadowOpacity: 0.2,
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
    color: "white",
    marginTop: 10,
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "white",
    opacity: 0.9,
  },
  recentActivityContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "white",
    marginBottom: 15,
  },
  activityCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "white",
  },
  activitySubtitle: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "rgba(255, 255, 255, 0.7)",
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
    elevation: 5,
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
    color: "white",
  },
  expirationDate: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "rgba(255, 255, 255, 0.8)",
  },
  renewButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  renewButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "white",
  },
})

