"use client"

import "react-native-get-random-values"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TextInput } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { router } from "expo-router"
import * as SecureStore from "expo-secure-store"
import AsyncStorage from "@react-native-async-storage/async-storage"
import algosdk from "algosdk"

export default function ImportWalletScreen() {
  const [mnemonic, setMnemonic] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [mnemonicWords, setMnemonicWords] = useState<string[]>(Array(25).fill(""))

  const updateMnemonicWord = (index: number, word: string) => {
    const newWords = [...mnemonicWords]
    newWords[index] = word.trim().toLowerCase()
    setMnemonicWords(newWords)
    setMnemonic(newWords.join(" ").trim())
  }

  const handleImportWallet = async () => {
    try {
      setIsLoading(true)

      // Validate mnemonic
      if (mnemonic.split(" ").length !== 25) {
        Alert.alert("Invalid Mnemonic", "Please enter all 25 words of your recovery phrase.")
        setIsLoading(false)
        return
      }

      // Verify mnemonic is valid
      try {
        // Convert mnemonic to secret key
        const secretKey = algosdk.mnemonicToSecretKey(mnemonic)
        const address = secretKey.addr

        // Store wallet information securely
        await SecureStore.setItemAsync("walletMnemonic", mnemonic)
        await SecureStore.setItemAsync("walletAddress", address.toString())

        // Mark signup as completed
        await AsyncStorage.setItem("onboardingComplete", "true")

        // Navigate to the main app
        router.replace("/(tabs)")
      } catch (error) {
        console.error("Invalid mnemonic:", error)
        Alert.alert(
          "Invalid Recovery Phrase",
          "The recovery phrase you entered is invalid. Please check and try again.",
        )
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Error importing wallet:", error)
      Alert.alert("Error", "Failed to import wallet. Please try again.")
      setIsLoading(false)
    }
  }

  const handlePaste = async () => {
    try {
      // This would use Clipboard API in a real app
      // For now, we'll just simulate a paste
      Alert.alert(
        "Paste Recovery Phrase",
        "Enter your 25-word recovery phrase separated by spaces",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: (text) => {
              if (text) {
                const words = text.trim().split(/\s+/)
                if (words.length === 25) {
                  setMnemonicWords(words)
                  setMnemonic(words.join(" "))
                } else {
                  Alert.alert("Invalid Format", "Please enter exactly 25 words separated by spaces.")
                }
              }
            },
          },
        ],
        {
          cancelable: true,
          prompt: true,
          defaultValue: "",
        },
      )
    } catch (error) {
      console.error("Error pasting mnemonic:", error)
    }
  }

  return (
    <LinearGradient colors={["#000000", "#121212"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Import Wallet</Text>
            <View style={styles.placeholder} />
          </View>

          <View style={styles.content}>
            <Text style={styles.title}>Enter Recovery Phrase</Text>
            <Text style={styles.description}>
              Enter your 25-word recovery phrase to import your existing Algorand wallet.
            </Text>

            <View style={styles.mnemonicInputContainer}>
              <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.mnemonicBox}>
                <View style={styles.mnemonicHeader}>
                  <Text style={styles.mnemonicHeaderText}>Recovery Phrase</Text>
                  <TouchableOpacity style={styles.pasteButton} onPress={handlePaste}>
                    <Text style={styles.pasteButtonText}>Paste</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.mnemonicWordsContainer}>
                  {mnemonicWords.map((word, index) => (
                    <View key={index} style={styles.wordInputContainer}>
                      <Text style={styles.wordNumber}>{index + 1}.</Text>
                      <TextInput
                        style={styles.wordInput}
                        value={word}
                        onChangeText={(text) => updateMnemonicWord(index, text)}
                        placeholder={`Word ${index + 1}`}
                        placeholderTextColor="#555555"
                        autoCapitalize="none"
                        autoCorrect={false}
                        spellCheck={false}
                      />
                    </View>
                  ))}
                </View>
              </LinearGradient>
            </View>

            <View style={styles.warningContainer}>
              <Ionicons name="information-circle-outline" size={24} color="#6a11cb" />
              <Text style={styles.warningText}>
                Make sure you're entering your recovery phrase in a private, secure environment.
              </Text>
            </View>

            <TouchableOpacity
              style={[styles.importButton, mnemonic.split(" ").length !== 25 && styles.disabledButton]}
              onPress={handleImportWallet}
              disabled={mnemonic.split(" ").length !== 25 || isLoading}
            >
              <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.buttonGradient}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>Import Wallet</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.createNewButton} onPress={() => router.push("/(auth)/create-wallet")}>
              <Text style={styles.createNewButtonText}>Create New Wallet Instead</Text>
            </TouchableOpacity>
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
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
    marginBottom: 10,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#AAAAAA",
    textAlign: "center",
    marginBottom: 30,
  },
  mnemonicInputContainer: {
    marginBottom: 20,
  },
  mnemonicBox: {
    width: "100%",
    borderRadius: 12,
    padding: 15,
  },
  mnemonicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  mnemonicHeaderText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  pasteButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: "rgba(106, 17, 203, 0.2)",
    borderRadius: 5,
  },
  pasteButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#6a11cb",
  },
  mnemonicWordsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  wordInputContainer: {
    flexDirection: "row",
    width: "48%",
    marginBottom: 10,
    alignItems: "center",
  },
  wordNumber: {
    width: 25,
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    color: "#6a11cb",
  },
  wordInput: {
    flex: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 5,
    paddingHorizontal: 10,
    color: "#FFFFFF",
    fontFamily: "Poppins-Regular",
  },
  warningContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(106, 17, 203, 0.1)",
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
    alignItems: "flex-start",
  },
  warningText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#FFFFFF",
  },
  importButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 15,
  },
  disabledButton: {
    opacity: 0.5,
  },
  buttonGradient: {
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
  },
  createNewButton: {
    padding: 15,
    alignItems: "center",
  },
  createNewButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#6a11cb",
  },
})

