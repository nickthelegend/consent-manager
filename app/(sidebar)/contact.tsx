"use client"

import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useState } from "react"
import { useNavigation } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { useSafeAreaInsets } from "react-native-safe-area-context"

export default function Contact() {
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")

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
        <Text style={styles.headerTitle}>Contact Us</Text>
        <View style={styles.rightPlaceholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contactInfo}>
          <Text style={styles.contactTitle}>Get in Touch</Text>
          <Text style={styles.contactDescription}>
            Have questions or need assistance? Fill out the form below and our team will get back to you as soon as
            possible.
          </Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Name</Text>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.inputContainer}>
              <Ionicons name="person-outline" size={20} color="#AAAAAA" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Your Name"
                placeholderTextColor="#777777"
                value={name}
                onChangeText={setName}
                selectionColor="#FFFFFF"
              />
            </LinearGradient>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email</Text>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.inputContainer}>
              <Ionicons name="mail-outline" size={20} color="#AAAAAA" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Your Email"
                placeholderTextColor="#777777"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
                selectionColor="#FFFFFF"
              />
            </LinearGradient>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Subject</Text>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.inputContainer}>
              <Ionicons name="help-circle-outline" size={20} color="#AAAAAA" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Subject"
                placeholderTextColor="#777777"
                value={subject}
                onChangeText={setSubject}
                selectionColor="#FFFFFF"
              />
            </LinearGradient>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Message</Text>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.textareaContainer}>
              <TextInput
                style={styles.textarea}
                placeholder="Your Message"
                placeholderTextColor="#777777"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                value={message}
                onChangeText={setMessage}
                selectionColor="#FFFFFF"
              />
            </LinearGradient>
          </View>

          <TouchableOpacity style={styles.submitButtonContainer}>
            <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.submitButton}>
              <Text style={styles.submitButtonText}>Send Message</Text>
              <Ionicons name="send" size={18} color="#FFFFFF" style={styles.submitButtonIcon} />
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.contactMethodsContainer}>
          <Text style={styles.contactMethodsTitle}>Other Ways to Reach Us</Text>

          <View style={styles.contactMethodCard}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.contactMethodCardGradient}>
              <LinearGradient colors={["#4a00e0", "#8e2de2"]} style={styles.contactMethodIcon}>
                <Ionicons name="mail" size={24} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.contactMethodInfo}>
                <Text style={styles.contactMethodLabel}>Email</Text>
                <Text style={styles.contactMethodValue}>support@consentmanager.com</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.contactMethodCard}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.contactMethodCardGradient}>
              <LinearGradient colors={["#00b09b", "#96c93d"]} style={styles.contactMethodIcon}>
                <Ionicons name="call" size={24} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.contactMethodInfo}>
                <Text style={styles.contactMethodLabel}>Phone</Text>
                <Text style={styles.contactMethodValue}>+1 (555) 123-4567</Text>
              </View>
            </LinearGradient>
          </View>

          <View style={styles.contactMethodCard}>
            <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.contactMethodCardGradient}>
              <LinearGradient colors={["#ff9966", "#ff5e62"]} style={styles.contactMethodIcon}>
                <Ionicons name="location" size={24} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.contactMethodInfo}>
                <Text style={styles.contactMethodLabel}>Address</Text>
                <Text style={styles.contactMethodValue}>
                  123 Privacy Street, Security Building, Suite 456, Data City, DC 10101
                </Text>
              </View>
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
  contactInfo: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  contactTitle: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    marginBottom: 10,
    color: "#FFFFFF",
  },
  contactDescription: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    lineHeight: 22,
    color: "#AAAAAA",
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
    color: "#FFFFFF",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333333",
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
    color: "#FFFFFF",
  },
  textareaContainer: {
    borderWidth: 1,
    borderColor: "#333333",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textarea: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    height: 120,
    color: "#FFFFFF",
  },
  submitButtonContainer: {
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 10,
  },
  submitButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
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
    color: "#FFFFFF",
  },
  contactMethodCard: {
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  contactMethodCardGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
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
    color: "#FFFFFF",
  },
  contactMethodValue: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#AAAAAA",
  },
})

