"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons, MaterialIcons, AntDesign } from "@expo/vector-icons"

const consentData = [
  {
    id: "1",
    title: "Medical Data Sharing",
    organization: "City Hospital",
    status: "active",
    date: "15 Mar 2023",
  },
  {
    id: "2",
    title: "Research Participation",
    organization: "Health Research Institute",
    status: "pending",
    date: "22 Apr 2023",
  },
  {
    id: "3",
    title: "Marketing Communications",
    organization: "Wellness Products Inc.",
    status: "declined",
    date: "10 Jan 2023",
  },
  {
    id: "4",
    title: "Data Processing Agreement",
    organization: "Health Insurance Co.",
    status: "active",
    date: "05 Feb 2023",
  },
  {
    id: "5",
    title: "Clinical Trial Participation",
    organization: "Medical Research Center",
    status: "active",
    date: "18 May 2023",
  },
]

export default function Consents() {
  const [activeFilter, setActiveFilter] = useState("all")

  const filteredData = activeFilter === "all" ? consentData : consentData.filter((item) => item.status === activeFilter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#4ECDC4"
      case "pending":
        return "#FFD166"
      case "declined":
        return "#FF6B6B"
      default:
        return "#4ECDC4"
    }
  }

  const renderConsentItem = ({ item }: { item: (typeof consentData)[0] }) => (
    <TouchableOpacity style={styles.consentCard}>
      <View style={styles.consentHeader}>
        <Text style={styles.consentTitle}>{item.title}</Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.charAt(0).toUpperCase() + item.status.slice(1)}</Text>
        </View>
      </View>
      <Text style={styles.organizationText}>{item.organization}</Text>
      <View style={styles.consentFooter}>
        <Text style={styles.dateText}>Created: {item.date}</Text>
        <TouchableOpacity style={styles.detailsButton}>
          <Text style={styles.detailsButtonText}>Details</Text>
          <MaterialIcons name="arrow-forward-ios" size={14} color="#4A00E0" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  )

  return (
    <LinearGradient colors={["#4A00E0", "#8E2DE2"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Consents</Text>
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            <TouchableOpacity
              style={[styles.filterButton, activeFilter === "all" && styles.activeFilterButton]}
              onPress={() => setActiveFilter("all")}
            >
              <Text style={[styles.filterText, activeFilter === "all" && styles.activeFilterText]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, activeFilter === "active" && styles.activeFilterButton]}
              onPress={() => setActiveFilter("active")}
            >
              <Text style={[styles.filterText, activeFilter === "active" && styles.activeFilterText]}>Active</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, activeFilter === "pending" && styles.activeFilterButton]}
              onPress={() => setActiveFilter("pending")}
            >
              <Text style={[styles.filterText, activeFilter === "pending" && styles.activeFilterText]}>Pending</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, activeFilter === "declined" && styles.activeFilterButton]}
              onPress={() => setActiveFilter("declined")}
            >
              <Text style={[styles.filterText, activeFilter === "declined" && styles.activeFilterText]}>Declined</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <FlatList
          data={filteredData}
          renderItem={renderConsentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity style={styles.createButton}>
          <AntDesign name="plus" size={24} color="white" />
        </TouchableOpacity>
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
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterScroll: {
    paddingVertical: 10,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  activeFilterButton: {
    backgroundColor: "white",
  },
  filterText: {
    color: "white",
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  activeFilterText: {
    color: "#4A00E0",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  consentCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  consentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  consentTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#333",
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "white",
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  organizationText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#666",
    marginBottom: 12,
  },
  consentFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 5,
  },
  dateText: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#888",
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#4A00E0",
    marginRight: 5,
  },
  createButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#4A00E0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
})

