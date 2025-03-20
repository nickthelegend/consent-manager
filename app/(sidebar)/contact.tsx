"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, useColorScheme } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { useNavigation } from "expo-router"

export default function Contact() {
  const colorScheme = useColorScheme()
  const isDark = colorScheme === "dark"
  const navigation = useNavigation()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

  return (
    <View style={[styles.container, { backgroundColor: isDark ? "#121212" : "#FFFFFF" }]}>
      <View style={[styles.header, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
        <Text style={[styles.headerTitle, { color: isDark ? "#FFFFFF" : "#000000" }]}>Contact Us</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contactInfo}>
          <Text style={[styles.contactTitle, { color: isDark ? "#FFFFFF" : "#000000" }]}>Get in Touch</Text>
          <Text style={[styles.contactDescription, { color: isDark ? "#AAAAAA" : "#666666" }]}>
            Have questions or need assistance? Fill out the form below and our team will get back to you as soon as
            possible.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: isDark ? "#FFFFFF" : "#000000" }]}>Name</Text>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5", borderColor: isDark ? "#333333" : "#E0E0E0" },
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={isDark ? "#AAAAAA" : "#666666"}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: isDark ? "#FFFFFF" : "#000000" }]}
                placeholder="Your Name"
                placeholderTextColor={isDark ? "#777777" : "#999999"}
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: isDark ? "#FFFFFF" : "#000000" }]}>Email</Text>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5", borderColor: isDark ? "#333333" : "#E0E0E0" },
              ]}
            >
              <Ionicons name="mail-outline" size={20} color={isDark ? "#AAAAAA" : "#666666"} style={styles.inputIcon} />
              <TextInput
                style={[styles.input, { color: isDark ? "#FFFFFF" : "#000000" }]}
                placeholder="Your Email"
                placeholderTextColor={isDark ? "#777777" : "#999999"}
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: isDark ? "#FFFFFF" : "#000000" }]}>Subject</Text>
            <View
              style={[
                styles.inputContainer,
                { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5", borderColor: isDark ? "#333333" : "#E0E0E0" },
              ]}
            >
              <Ionicons
                name="help-circle-outline"
                size={20}
                color={isDark ? "#AAAAAA" : "#666666"}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, { color: isDark ? "#FFFFFF" : "#000000" }]}
                placeholder="Subject"
                placeholderTextColor={isDark ? "#777777" : "#999999"}
                value={subject}
                onChangeText={setSubject}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: isDark ? "#FFFFFF" : "#000000" }]}>Message</Text>
            <View
              style={[
                styles.textareaContainer,
                { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5", borderColor: isDark ? "#333333" : "#E0E0E0" },
              ]}
            >
              <TextInput
                style={[styles.textarea, { color: isDark ? "#FFFFFF" : "#000000" }]}
                placeholder="Your Message"
                placeholderTextColor={isDark ? "#777777" : "#999999"}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={message}
                onChangeText={setMessage}
              />
            </View>
          </View>

          <TouchableOpacity style={[styles.submitButton, { backgroundColor: isDark ? "#333333" : "#E0E0E0" }]}>
            <Text style={[styles.submitButtonText, { color: isDark ? "#FFFFFF" : "#000000" }]}>Send Message</Text>
            <Ionicons name="send" size={18} color={isDark ? "#FFFFFF" : "#000000"} style={styles.submitButtonIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.contactMethodsContainer}>
          <Text style={[styles.contactMethodsTitle, { color: isDark ? "#FFFFFF" : "#000000" }]}>
            Other Ways to Reach Us
          </Text>

          <View style={[styles.contactMethodCard, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
            <View style={[styles.contactMethodIcon, { backgroundColor: isDark ? "#333333" : "#E0E0E0" }]}>
              <Ionicons name="mail" size={24} color={isDark ? "#FFFFFF" : "#000000"} />
            </View>
            <View style={styles.contactMethodInfo}>
              <Text style={[styles.contactMethodLabel, { color: isDark ? "#FFFFFF" : "#000000" }]}>Email</Text>
              <Text style={[styles.contactMethodValue, { color: isDark ? "#AAAAAA" : "#666666" }]}>
                support@consentmanager.com
              </Text>
            </View>
          </View>

          <View style={[styles.contactMethodCard, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
            <View style={[styles.contactMethodIcon, { backgroundColor: isDark ? "#333333" : "#E0E0E0" }]}>
              <Ionicons name="call" size={24} color={isDark ? "#FFFFFF" : "#000000"} />
            </View>
            <View style={styles.contactMethodInfo}>
              <Text style={[styles.contactMethodLabel, { color: isDark ? "#FFFFFF" : "#000000" }]}>Phone</Text>
              <Text style={[styles.contactMethodValue, { color: isDark ? "#AAAAAA" : "#666666" }]}>
                +1 (555) 123-4567
              </Text>
            </View>
          </View>

          <View style={[styles.contactMethodCard, { backgroundColor: isDark ? "#1E1E1E" : "#F5F5F5" }]}>
            <View style={[styles.contactMethodIcon, { backgroundColor: isDark ? "#333333" : "#E0E0E0" }]}>
              <Ionicons name="location" size={24} color={isDark ? "#FFFFFF" : "#000000"} />
            </View>
            <View style={styles.contactMethodInfo}>
              <Text style={[styles.contactMethodLabel, { color: isDark ? "#FFFFFF" : "#000000" }]}>Address</Text>
              <Text style={[styles.contactMethodValue, { color: isDark ? "#AAAAAA" : "#666666" }]}>
                123 Privacy Street, Security Building, Suite 456, Data City, DC 10101
              </Text>
            </View>
          </View>
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
  contactInfo: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  contactTitle: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
  },
  contactDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
  },
  formContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  textareaContainer: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textarea: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    height: 120,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    borderRadius: 8,
    marginTop: 10,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
  },
  submitButtonIcon: {
    marginLeft: 10,
  },
  contactMethodsContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  contactMethodsTitle: {
    fontSize: 18,
    fontFamily: "Poppins-Bold",
    marginBottom: 15,
  },
  contactMethodCard: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
  },
  contactMethodIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  contactMethodInfo: {
    flex: 1,
  },
  contactMethodLabel: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    marginBottom: 5,
  },
  contactMethodValue: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
  },
})

