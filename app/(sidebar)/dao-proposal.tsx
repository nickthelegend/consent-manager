"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons, MaterialIcons } from "@expo/vector-icons"
import { useNavigation } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"

export default function DAOProposal() {
  const navigation = useNavigation()

  return (
    <LinearGradient colors={["#000000", "#121212"]} style={styles.container}>
      <LinearGradient colors={["#1a1a1a", "#000000"]} style={styles.header}>
        <Text style={styles.headerTitle}>DAO Proposals</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="filter" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.statCardGradient}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Active Proposals</Text>
            </LinearGradient>
          </View>

          <View style={styles.statCard}>
            <LinearGradient colors={["#00b09b", "#96c93d"]} style={styles.statCardGradient}>
              <Text style={styles.statNumber}>8</Text>
              <Text style={styles.statLabel}>Your Votes</Text>
            </LinearGradient>
          </View>
        </View>

        <View style={styles.proposalsContainer}>
          <Text style={styles.sectionTitle}>Active Proposals</Text>

          <TouchableOpacity style={styles.proposalCard}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.proposalCardGradient}>
              <View style={styles.proposalHeader}>
                <Text style={styles.proposalTitle}>Treasury Fund Allocation</Text>
                <LinearGradient colors={["#00c6ff", "#0072ff"]} style={styles.statusBadge}>
                  <Text style={styles.statusText}>Active</Text>
                </LinearGradient>
              </View>
              <Text style={styles.proposalDescription}>
                Proposal to allocate 5% of treasury funds to community development initiatives.
              </Text>
              <View style={styles.proposalFooter}>
                <Text style={styles.proposalInfo}>Ends in 3 days • 234 votes</Text>
                <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.voteButton}>
                  <Text style={styles.voteButtonText}>Vote</Text>
                </LinearGradient>
              </View>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={styles.proposalCard}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.proposalCardGradient}>
              <View style={styles.proposalHeader}>
                <Text style={styles.proposalTitle}>Governance Structure Update</Text>
                <LinearGradient colors={["#00c6ff", "#0072ff"]} style={styles.statusBadge}>
                  <Text style={styles.statusText}>Active</Text>
                </LinearGradient>
              </View>
              <Text style={styles.proposalDescription}>
                Proposal to update the governance structure to include community representatives.
              </Text>
              <View style={styles.proposalFooter}>
                <Text style={styles.proposalInfo}>Ends in 5 days • 156 votes</Text>
                <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.voteButton}>
                  <Text style={styles.voteButtonText}>Vote</Text>
                </LinearGradient>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.proposalsContainer}>
          <Text style={styles.sectionTitle}>Past Proposals</Text>

          <TouchableOpacity style={styles.proposalCard}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.proposalCardGradient}>
              <View style={styles.proposalHeader}>
                <Text style={styles.proposalTitle}>Protocol Upgrade</Text>
                <LinearGradient colors={["#333333", "#1a1a1a"]} style={styles.statusBadge}>
                  <Text style={[styles.statusText, { color: "#777777" }]}>Passed</Text>
                </LinearGradient>
              </View>
              <Text style={styles.proposalDescription}>
                Proposal to upgrade the protocol to version 2.0 with enhanced security features.
              </Text>
              <View style={styles.proposalFooter}>
                <Text style={styles.proposalInfo}>Ended 2 weeks ago • 412 votes</Text>
                <TouchableOpacity style={styles.detailsButton}>
                  <Text style={styles.detailsButtonText}>Details</Text>
                  <MaterialIcons name="arrow-forward-ios" size={14} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.createButtonContainer}>
        <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.createButton}>
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
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
  headerTitle: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
  },
  filterButton: {
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
    marginBottom: 30,
  },
  statCard: {
    width: "48%",
    borderRadius: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  statCardGradient: {
    padding: 20,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    marginBottom: 5,
    color: "#FFFFFF",
  },
  statLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  proposalsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 15,
    color: "#FFFFFF",
  },
  proposalCard: {
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  proposalCardGradient: {
    padding: 15,
  },
  proposalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  proposalTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    flex: 1,
    marginRight: 10,
    color: "#FFFFFF",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  proposalDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 15,
    lineHeight: 20,
    color: "#AAAAAA",
  },
  proposalFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  proposalInfo: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#777777",
  },
  voteButton: {
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 20,
  },
  voteButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginRight: 5,
    color: "#FFFFFF",
  },
  createButtonContainer: {
    position: "absolute",
    bottom: 80,
    right: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  createButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
})

