"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons"

export default function Documents() {
  // Replace the colorScheme and isDark variables with a forced dark theme
  // Remove these lines:
  // const colorScheme = useColorScheme()
  // const isDark = colorScheme === "dark"

  // Update the return statement to use black theme
  return (
    <View style={[styles.container, { backgroundColor: "#000000" }]}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.categoriesContainer}>
          <Text style={[styles.sectionTitle, { color: "#FFFFFF" }]}>Categories</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            <TouchableOpacity style={styles.categoryCard}>
              <View style={[styles.categoryGradient, { backgroundColor: "#1E1E1E" }]}>
                <FontAwesome5 name="hospital" size={24} color="#FFFFFF" />
              </View>
              <Text style={[styles.categoryText, { color: "#FFFFFF" }]}>Medical</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryCard}>
              <View style={[styles.categoryGradient, { backgroundColor: "#1E1E1E" }]}>
                <FontAwesome5 name="flask" size={24} color="#FFFFFF" />
              </View>
              <Text style={[styles.categoryText, { color: "#FFFFFF" }]}>Research</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryCard}>
              <View style={[styles.categoryGradient, { backgroundColor: "#1E1E1E" }]}>
                <FontAwesome5 name="file-contract" size={24} color="#FFFFFF" />
              </View>
              <Text style={[styles.categoryText, { color: "#FFFFFF" }]}>Legal</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.categoryCard}>
              <View style={[styles.categoryGradient, { backgroundColor: "#1E1E1E" }]}>
                <FontAwesome5 name="bullhorn" size={24} color="#FFFFFF" />
              </View>
              <Text style={[styles.categoryText, { color: "#FFFFFF" }]}>Marketing</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.recentDocumentsContainer}>
          <Text style={[styles.sectionTitle, { color: "#FFFFFF" }]}>Recent Documents</Text>

          <TouchableOpacity style={[styles.documentCard, { backgroundColor: "#121212" }]}>
            <View style={[styles.documentIconContainer, { backgroundColor: "#1E1E1E" }]}>
              <FontAwesome5 name="file-pdf" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.documentContent}>
              <Text style={[styles.documentTitle, { color: "#FFFFFF" }]}>Medical Consent Form</Text>
              <Text style={[styles.documentInfo, { color: "#AAAAAA" }]}>PDF • 2.4 MB • Mar 15, 2023</Text>
            </View>
            <TouchableOpacity style={styles.documentActionButton}>
              <MaterialIcons name="more-vert" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.documentCard, { backgroundColor: "#121212" }]}>
            <View style={[styles.documentIconContainer, { backgroundColor: "#1E1E1E" }]}>
              <FontAwesome5 name="file-pdf" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.documentContent}>
              <Text style={[styles.documentTitle, { color: "#FFFFFF" }]}>Research Participation Agreement</Text>
              <Text style={[styles.documentInfo, { color: "#AAAAAA" }]}>PDF • 1.8 MB • Apr 22, 2023</Text>
            </View>
            <TouchableOpacity style={styles.documentActionButton}>
              <MaterialIcons name="more-vert" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.documentCard, { backgroundColor: "#121212" }]}>
            <View style={[styles.documentIconContainer, { backgroundColor: "#1E1E1E" }]}>
              <FontAwesome5 name="file-word" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.documentContent}>
              <Text style={[styles.documentTitle, { color: "#FFFFFF" }]}>Data Processing Agreement</Text>
              <Text style={[styles.documentInfo, { color: "#AAAAAA" }]}>DOCX • 856 KB • Feb 05, 2023</Text>
            </View>
            <TouchableOpacity style={styles.documentActionButton}>
              <MaterialIcons name="more-vert" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        <View style={styles.sharedDocumentsContainer}>
          <Text style={[styles.sectionTitle, { color: "#FFFFFF" }]}>Shared With You</Text>

          <TouchableOpacity style={[styles.documentCard, { backgroundColor: "#121212" }]}>
            <View style={[styles.documentIconContainer, { backgroundColor: "#1E1E1E" }]}>
              <FontAwesome5 name="file-pdf" size={24} color="#FFFFFF" />
            </View>
            <View style={styles.documentContent}>
              <Text style={[styles.documentTitle, { color: "#FFFFFF" }]}>Clinical Trial Information</Text>
              <Text style={[styles.documentInfo, { color: "#AAAAAA" }]}>PDF • 3.2 MB • May 18, 2023</Text>
              <View style={styles.sharedByContainer}>
                <Text style={[styles.sharedByText, { color: "#FFFFFF" }]}>Shared by: Medical Research Center</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.documentActionButton}>
              <MaterialIcons name="more-vert" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity style={[styles.uploadButton, { backgroundColor: "#1E1E1E" }]}>
        <Ionicons name="cloud-upload" size={24} color="#FFFFFF" />
      </TouchableOpacity>
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
  categoriesContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 15,
  },
  categoriesScroll: {
    paddingBottom: 10,
  },
  categoryCard: {
    alignItems: "center",
    marginRight: 15,
    width: 80,
  },
  categoryGradient: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
  recentDocumentsContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  documentCard: {
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
  documentIconContainer: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  documentContent: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  documentInfo: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 3,
  },
  documentActionButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  sharedDocumentsContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  sharedByContainer: {
    marginTop: 5,
  },
  sharedByText: {
    fontSize: 12,
    fontFamily: "Poppins-Medium",
  },
  uploadButton: {
    position: "absolute",
    bottom: 80,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
})

