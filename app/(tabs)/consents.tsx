"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from "react-native"
import { MaterialIcons, AntDesign } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"

const consentData = [
  {
    id: "1",
    title: "Medical Data Sharing",
    organization: "City Hospital",
    status: "active",
    date: "15 Mar 2023",
    gradient: ["#4a00e0", "#8e2de2"],
  },
  {
    id: "2",
    title: "Research Participation",
    organization: "Health Research Institute",
    status: "pending",
    date: "22 Apr 2023",
    gradient: ["#ff9966", "#ff5e62"],
  },
  {
    id: "3",
    title: "Marketing Communications",
    organization: "Wellness Products Inc.",
    status: "declined",
    date: "10 Jan 2023",
    gradient: ["#fc4a1a", "#f7b733"],
  },
  {
    id: "4",
    title: "Data Processing Agreement",
    organization: "Health Insurance Co.",
    status: "active",
    date: "05 Feb 2023",
    gradient: ["#00b09b", "#96c93d"],
  },
  {
    id: "5",
    title: "Clinical Trial Participation",
    organization: "Medical Research Center",
    status: "active",
    date: "18 May 2023",
    gradient: ["#6a11cb", "#2575fc"],
  },
]

export default function Consents() {
  const [activeFilter, setActiveFilter] = useState("all")

  const filteredData = activeFilter === "all" ? consentData : consentData.filter((item) => item.status === activeFilter)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#FFFFFF"
      case "pending":
        return "#AAAAAA"
      case "declined":
        return "#777777"
      default:
        return "#FFFFFF"
    }
  }

  const renderConsentItem = ({ item }: { item: (typeof consentData)[0] }) => (
    <TouchableOpacity style={styles.consentCard}>
      <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.consentCardGradient}>
        <View style={styles.consentHeader}>
          <Text style={styles.consentTitle}>{item.title}</Text>
          <LinearGradient
            colors={
              item.status === "active"
                ? ["#00c6ff", "#0072ff"]
                : item.status === "pending"
                  ? ["#ff9966", "#ff5e62"]
                  : ["#141414", "#333333"]
            }
            style={styles.statusBadge}
          >
            <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </LinearGradient>
        </View>
        <Text style={styles.organizationText}>{item.organization}</Text>
        <View style={styles.consentFooter}>
          <Text style={styles.dateText}>Created: {item.date}</Text>
          <TouchableOpacity style={styles.detailsButton}>
            <Text style={styles.detailsButtonText}>Details</Text>
            <MaterialIcons name="arrow-forward-ios" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )

  return (
    <LinearGradient colors={["#000000", "#121212"]} style={styles.container}>
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: activeFilter === "all" ? "#333333" : "#1E1E1E",
              },
            ]}
            onPress={() => setActiveFilter("all")}
          >
            <LinearGradient
              colors={activeFilter === "all" ? ["#6a11cb", "#2575fc"] : ["#141414", "#1E1E1E"]}
              style={styles.filterGradient}
            >
              <Text style={[styles.filterText, { opacity: activeFilter === "all" ? 1 : 0.6 }]}>All</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: activeFilter === "active" ? "#333333" : "#1E1E1E",
              },
            ]}
            onPress={() => setActiveFilter("active")}
          >
            <LinearGradient
              colors={activeFilter === "active" ? ["#00c6ff", "#0072ff"] : ["#141414", "#1E1E1E"]}
              style={styles.filterGradient}
            >
              <Text style={[styles.filterText, { opacity: activeFilter === "active" ? 1 : 0.6 }]}>Active</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: activeFilter === "pending" ? "#333333" : "#1E1E1E",
              },
            ]}
            onPress={() => setActiveFilter("pending")}
          >
            <LinearGradient
              colors={activeFilter === "pending" ? ["#ff9966", "#ff5e62"] : ["#141414", "#1E1E1E"]}
              style={styles.filterGradient}
            >
              <Text style={[styles.filterText, { opacity: activeFilter === "pending" ? 1 : 0.6 }]}>Pending</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              {
                backgroundColor: activeFilter === "declined" ? "#333333" : "#1E1E1E",
              },
            ]}
            onPress={() => setActiveFilter("declined")}
          >
            <LinearGradient
              colors={activeFilter === "declined" ? ["#fc4a1a", "#f7b733"] : ["#141414", "#1E1E1E"]}
              style={styles.filterGradient}
            >
              <Text style={[styles.filterText, { opacity: activeFilter === "declined" ? 1 : 0.6 }]}>Declined</Text>
            </LinearGradient>
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

      <TouchableOpacity style={styles.createButtonContainer}>
        <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.createButton}>
          <AntDesign name="plus" size={24} color="#FFFFFF" />
        </LinearGradient>
      </TouchableOpacity>
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
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
    marginTop: 20,
  },
  filterScroll: {
    paddingVertical: 10,
  },
  filterButton: {
    marginRight: 10,
    borderRadius: 20,
    overflow: "hidden",
  },
  filterGradient: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  filterText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#FFFFFF",
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  consentCard: {
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  consentCardGradient: {
    padding: 15,
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
    flex: 1,
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
  },
  organizationText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    marginBottom: 12,
    color: "#AAAAAA",
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
    color: "#777777",
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

