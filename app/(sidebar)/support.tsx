"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, useColorScheme } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { useNavigation } from "expo-router"

export default function Support() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const navigation = useNavigation()

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
    <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#FFFFFF" }]}>
      <View style={[styles.header, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
        <Text style={[styles.headerTitle, { color: isDark ? "#FFFFFF" : "#000000" }]}>Support</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.searchContainer}>
          <View
            style={[
              styles.searchInputContainer,
              { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5", borderColor: isDark ? "#333333" : "#E0E0E0" },
            ]}
          >
            <Ionicons name="search" size={20} color={isDark ? "#AAAAAA" : "#666666"} style={styles.searchIcon} />
            <TextInput
              style={[styles.searchInput, { color: isDark ? "#FFFFFF" : "#000000" }]}
              placeholder="Search for help..."
              placeholderTextColor={isDark ? "#777777" : "#999999"}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={20} color={isDark ? "#AAAAAA" : "#666666"} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.supportOptionsContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#FFFFFF" : "#000000" }]}>How can we help you?</Text>

          <View style={styles.supportOptionsGrid}>
            <TouchableOpacity style={[styles.supportOptionCard, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
              <View style={[styles.supportOptionIcon, { backgroundColor: isDark ? "#333333" : "#E0E0E0" }]}>
                <Ionicons name="document-text" size={24} color={isDark ? "#FFFFFF" : "#000000"} />
              </View>
              <Text style={[styles.supportOptionText, { color: isDark ? "#FFFFFF" : "#000000" }]}>User Guide</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.supportOptionCard, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
              <View style={[styles.supportOptionIcon, { backgroundColor: isDark ? "#333333" : "#E0E0E0" }]}>
                <Ionicons name="chatbubble-ellipses" size={24} color={isDark ? "#FFFFFF" : "#000000"} />
              </View>
              <Text style={[styles.supportOptionText, { color: isDark ? "#FFFFFF" : "#000000" }]}>Live Chat</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.supportOptionCard, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
              <View style={[styles.supportOptionIcon, { backgroundColor: isDark ? "#333333" : "#E0E0E0" }]}>
                <Ionicons name="mail" size={24} color={isDark ? "#FFFFFF" : "#000000"} />
              </View>
              <Text style={[styles.supportOptionText, { color: isDark ? "#FFFFFF" : "#000000" }]}>Email Support</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.supportOptionCard, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
              <View style={[styles.supportOptionIcon, { backgroundColor: isDark ? "#333333" : "#E0E0E0" }]}>
                <Ionicons name="videocam" size={24} color={isDark ? "#FFFFFF" : "#000000"} />
              </View>
              <Text style={[styles.supportOptionText, { color: isDark ? "#FFFFFF" : "#000000" }]}>Video Tutorials</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.faqContainer}>
          <Text style={[styles.sectionTitle, { color: isDark ? "#FFFFFF" : "#000000" }]}>
            Frequently Asked Questions
          </Text>

          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.faqItem, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}
                onPress={() => toggleFaq(index)}
              >
                <View style={styles.faqHeader}>
                  <Text style={[styles.faqQuestion, { color: isDark ? "#FFFFFF" : "#000000" }]}>{faq.question}</Text>
                  <Ionicons
                    name={expandedFaq === index ? "chevron-up" : "chevron-down"}
                    size={20}
                    color={isDark ? "#FFFFFF" : "#000000"}
                  />
                </View>

                {expandedFaq === index && (
                  <Text style={[styles.faqAnswer, { color: isDark ? "#AAAAAA" : "#666666" }]}>{faq.answer}</Text>
                )}
              </TouchableOpacity>
            ))
          ) : (
            <View style={[styles.noResultsContainer, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
              <Ionicons name="search-outline" size={40} color={isDark ? "#777777" : "#999999"} />
              <Text style={[styles.noResultsText, { color: isDark ? "#FFFFFF" : "#000000" }]}>No results found</Text>
              <Text style={[styles.noResultsSubtext, { color: isDark ? "#AAAAAA" : "#666666" }]}>
                Try different keywords or contact our support team
              </Text>
            </View>
          )}
        </View>

        <View style={styles.contactSupportContainer}>
          <TouchableOpacity
            style={[styles.contactSupportButton, { backgroundColor: isDark ? "#333333" : "#E0E0E0" }]}
            onPress={() => navigation.navigate("contact" as never)}
          >
            <Text style={[styles.contactSupportText, { color: isDark ? "#FFFFFF" : "#000000" }]}>
              Contact Support Team
            </Text>
            <Ionicons name="arrow-forward" size={18} color={isDark ? "#FFFFFF" : "#000000"} />
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
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
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
  },
  supportOptionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 15,
  },
  supportOptionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  supportOptionCard: {
    width: "48%",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginBottom: 15,
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
  },
  faqContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  faqItem: {
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
  },
  faqHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  faqQuestion: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    flex: 1,
    marginRight: 10,
  },
  faqAnswer: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
    padding: 15,
    paddingTop: 0,
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
  },
  noResultsSubtext: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
  },
  contactSupportContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  contactSupportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 8,
  },
  contactSupportText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginRight: 10,
  },
})

