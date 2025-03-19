import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons"

export default function Documents() {
  return (
    <LinearGradient colors={["#4A00E0", "#8E2DE2"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Documents</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Ionicons name="filter" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.categoriesContainer}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesScroll}
            >
              <TouchableOpacity style={styles.categoryCard}>
                <LinearGradient
                  colors={["#FF6B6B", "#FF8E8E"]}
                  style={styles.categoryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome5 name="hospital" size={24} color="white" />
                </LinearGradient>
                <Text style={styles.categoryText}>Medical</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.categoryCard}>
                <LinearGradient
                  colors={["#4ECDC4", "#26A69A"]}
                  style={styles.categoryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome5 name="flask" size={24} color="white" />
                </LinearGradient>
                <Text style={styles.categoryText}>Research</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.categoryCard}>
                <LinearGradient
                  colors={["#FFD166", "#F4A261"]}
                  style={styles.categoryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome5 name="file-contract" size={24} color="white" />
                </LinearGradient>
                <Text style={styles.categoryText}>Legal</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.categoryCard}>
                <LinearGradient
                  colors={["#A78BFA", "#8B5CF6"]}
                  style={styles.categoryGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <FontAwesome5 name="bullhorn" size={24} color="white" />
                </LinearGradient>
                <Text style={styles.categoryText}>Marketing</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.recentDocumentsContainer}>
            <Text style={styles.sectionTitle}>Recent Documents</Text>

            <TouchableOpacity style={styles.documentCard}>
              <View style={styles.documentIconContainer}>
                <FontAwesome5 name="file-pdf" size={24} color="#FF6B6B" />
              </View>
              <View style={styles.documentContent}>
                <Text style={styles.documentTitle}>Medical Consent Form</Text>
                <Text style={styles.documentInfo}>PDF • 2.4 MB • Mar 15, 2023</Text>
              </View>
              <TouchableOpacity style={styles.documentActionButton}>
                <MaterialIcons name="more-vert" size={24} color="#666" />
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity style={styles.documentCard}>
              <View style={styles.documentIconContainer}>
                <FontAwesome5 name="file-pdf" size={24} color="#FF6B6B" />
              </View>
              <View style={styles.documentContent}>
                <Text style={styles.documentTitle}>Research Participation Agreement</Text>
                <Text style={styles.documentInfo}>PDF • 1.8 MB • Apr 22, 2023</Text>
              </View>
              <TouchableOpacity style={styles.documentActionButton}>
                <MaterialIcons name="more-vert" size={24} color="#666" />
              </TouchableOpacity>
            </TouchableOpacity>

            <TouchableOpacity style={styles.documentCard}>
              <View style={styles.documentIconContainer}>
                <FontAwesome5 name="file-word" size={24} color="#4285F4" />
              </View>
              <View style={styles.documentContent}>
                <Text style={styles.documentTitle}>Data Processing Agreement</Text>
                <Text style={styles.documentInfo}>DOCX • 856 KB • Feb 05, 2023</Text>
              </View>
              <TouchableOpacity style={styles.documentActionButton}>
                <MaterialIcons name="more-vert" size={24} color="#666" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>

          <View style={styles.sharedDocumentsContainer}>
            <Text style={styles.sectionTitle}>Shared With You</Text>

            <TouchableOpacity style={styles.documentCard}>
              <View style={styles.documentIconContainer}>
                <FontAwesome5 name="file-pdf" size={24} color="#FF6B6B" />
              </View>
              <View style={styles.documentContent}>
                <Text style={styles.documentTitle}>Clinical Trial Information</Text>
                <Text style={styles.documentInfo}>PDF • 3.2 MB • May 18, 2023</Text>
                <View style={styles.sharedByContainer}>
                  <Text style={styles.sharedByText}>Shared by: Medical Research Center</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.documentActionButton}>
                <MaterialIcons name="more-vert" size={24} color="#666" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.uploadButton}>
          <Ionicons name="cloud-upload" size={24} color="white" />
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
  filterButton: {
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
  categoriesContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    color: "white",
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
    color: "white",
  },
  recentDocumentsContainer: {
    marginTop: 25,
    paddingHorizontal: 20,
  },
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
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
    backgroundColor: "rgba(0, 0, 0, 0.05)",
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
    color: "#333",
  },
  documentInfo: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#888",
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
    color: "#4A00E0",
  },
  uploadButton: {
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

