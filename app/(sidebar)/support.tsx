"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { useNavigation } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function Support() {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const [searchQuery, setSearchQuery] = useState("")

  const faqs = [
    {
      question: "How do I manage my consent preferences?",
      answer:
        "You can manage your consent preferences by navigating to the Consents tab and selecting the specific consent you wish to modify. From there, you can update your preferences or revoke consent entirely.",
    },
    {
      question: "How secure is my data in the app?",
      answer:
        "We use industry-standard encryption and security protocols to protect your data. All information is stored securely and is only accessible to authorized parties with your explicit consent.",
    },
    {
      question: "Can I download my consent history?",
      answer:
        "Yes, you can download your complete consent history by going to the Documents tab and selecting 'Export Consent History'. This will generate a PDF document that you can save or share.",
    },
    {
      question: "How do I delete my account?",
      answer:
        "To delete your account, go to Settings > Privacy Settings > Delete Account. Please note that this action is irreversible and will permanently remove all your data from our systems.",
    },
    {
      question: "What happens when a consent expires?",
      answer:
        "When a consent is about to expire, you'll receive a notification prompting you to review and renew it if desired. If no action is taken, the consent will automatically expire and no longer be valid.",
    },
  ]

  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  const toggleFaq = (index: number) => {
    if (expandedFaq === index) {
      setExpandedFaq(null)
    } else {
      setExpandedFaq(index)
    }
  }

  const filteredFaqs = searchQuery
    ? faqs.filter(
        (faq) =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : faqs

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
        <Text style={styles.headerTitle}>Support</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.searchInputContainer}>
            <Ionicons name="search" size={20} color="#AAAAAA" style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search for help..."
              placeholderTextColor="#777777"
              value={searchQuery}
              onChangeText={setSearchQuery}
              selectionColor="#FFFFFF"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color="#AAAAAA" />
              </TouchableOpacity>
            )}
          </LinearGradient>
        </View>

        <View style={styles.supportOptionsContainer}>
          <Text style={styles.sectionTitle}>How can we help you?</Text>

          <View style={styles.supportOptionsGrid}>
            <TouchableOpacity style={styles.supportOptionCard}>
              <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.supportOptionCardGradient}>
                <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.supportOptionIcon}>
                  <Ionicons name="document-text" size={24} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.supportOptionText}>User Guide</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.supportOptionCard}>
              <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.supportOptionCardGradient}>
                <LinearGradient colors={["#00b09b", "#96c93d"]} style={styles.supportOptionIcon}>
                  <Ionicons name="chatbubble-ellipses" size={24} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.supportOptionText}>Live Chat</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.supportOptionCard}>
              <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.supportOptionCardGradient}>
                <LinearGradient colors={["#ff9966", "#ff5e62"]} style={styles.supportOptionIcon}>
                  <Ionicons name="mail" size={24} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.supportOptionText}>Email Support</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.supportOptionCard}>
              <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.supportOptionCardGradient}>
                <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.supportOptionIcon}>
                  <Ionicons name="videocam" size={24} color="#FFFFFF" />
                </LinearGradient>
                <Text style={styles.supportOptionText}>Video Tutorials</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.faqContainer}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>

          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <TouchableOpacity key={index} style={styles.faqItem} onPress={() => toggleFaq(index)}>
                <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.faqItemGradient}>
                  <View style={styles.faqHeader}>
                    <Text style={styles.faqQuestion}>{faq.question}</Text>
                    <Ionicons name={expandedFaq === index ? "chevron-up" : "chevron-down"} size={20} color="#FFFFFF" />
                  </View>

                  {expandedFaq === index && <Text style={styles.faqAnswer}>{faq.answer}</Text>}
                </LinearGradient>
              </TouchableOpacity>
            ))
          ) : (
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.noResultsContainer}>
              <Ionicons name="search-outline" size={40} color="#777777" />
              <Text style={styles.noResultsText}>No results found</Text>
              <Text style={styles.noResultsSubtext}>Try different keywords or contact our support team</Text>
            </LinearGradient>
          )}
        </View>

        <View style={styles.contactSupportContainer}>
          <TouchableOpacity
            style={styles.contactSupportButtonContainer}
            onPress={() => navigation.navigate("(sidebar)/contact" as never)}
          >
            <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.contactSupportButton}>
              <Text style={styles.contactSupportText}>Contact Support Team</Text>
              <Ionicons name="arrow-forward" size={18} color="#FFFFFF" />
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#FFFFFF",
  },
  supportOptionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 15,
    color: "#FFFFFF",
  },
  supportOptionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  supportOptionCard: {
    width: "48%",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  supportOptionCardGradient: {
    padding: 15,
    alignItems: "center",
  },
  supportOptionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  supportOptionText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    textAlign: "center",
    color: "#FFFFFF",
  },
  faqContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  faqItem: {
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  faqItemGradient: {
    padding: 15,
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  faqQuestion: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    flex: 1,
    marginRight: 10,
    color: "#FFFFFF",
  },
  faqAnswer: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
    marginTop: 15,
    color: "#AAAAAA",
  },
  noResultsContainer: {
    padding: 30,
    borderRadius: 12,
    alignItems: "center",
  },
  noResultsText: {
    fontSize: 18,
    fontFamily: "Poppins-Medium",
    marginTop: 15,
    marginBottom: 5,
    color: "#FFFFFF",
  },
  noResultsSubtext: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    color: "#AAAAAA",
  },
  contactSupportContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  contactSupportButtonContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },
  contactSupportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  contactSupportText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginRight: 10,
    color: "#FFFFFF",
  },
})

