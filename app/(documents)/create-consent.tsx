"use client"

import { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
  Platform,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons, FontAwesome5 } from "@expo/vector-icons"
import { router, useLocalSearchParams } from "expo-router"
import { createClient } from "@supabase/supabase-js"
import { getStoredSession, getWalletAddress } from "../../utils/secure-storage"
import DateTimePicker from "@react-native-community/datetimepicker"
import { Picker } from "@react-native-picker/picker"
import algosdk from "algosdk"
// Initialize Supabase client
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || "https://uorbdplqtxmcdhbnkbmf.supabase.co"
const supabaseKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvcmJkcGxxdHhtY2RoYm5rYm1mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI2MjE0MTIsImV4cCI6MjA1ODE5NzQxMn0.h01gicHiW7yTjqT2JWCSYRmLAIzBMOlPg-kIy6q8Kk0"
const supabase = createClient(supabaseUrl, supabaseKey)
import * as SecureStore from "expo-secure-store"

const METHODS = [
  new algosdk.ABIMethod({ name: "createConsent", desc: "", args: [
    { type: "string", name: "title", desc: "" },
     { type: "string", name: "description", desc: "" },
      { type: "string", name: "organization", desc: "" },
      { type: "uint64", name: "duration", desc: "" },
       { type: "string", name: "consentHash", desc: "" },
        { type: "string", name: "signedUrl", desc: "" },
         { type: "string", name: "consetData", desc: "" }],
          returns: { type: "void", desc: "" } }),
  new algosdk.ABIMethod({ name: "createBox", desc: "", args: [], returns: { type: "void", desc: "" } }),

];



export default function CreateConsent() {
  const params = useLocalSearchParams()
  const { documentId } = params

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [document, setDocument] = useState(null)
  const [walletAddress, setWalletAddress] = useState("")
  const [userId, setUserId] = useState("")

  // Form state
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [organization, setOrganization] = useState("")
  const [expiryEnabled, setExpiryEnabled] = useState(true)
  const [expiryDate, setExpiryDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)) // Default 30 days
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [showTimePicker, setShowTimePicker] = useState(false)
  const [accessType, setAccessType] = useState("view") // view, download, edit

  // Fetch document and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Get wallet address
        const address = await getWalletAddress()
        if (address) {
          setWalletAddress(address)
        }

        // Get session for user ID
        const session = await getStoredSession()
        if (session?.user?.id) {
          setUserId(session.user.id)

          // Set auth token
          supabase.auth.setSession(session)

          // Fetch document details
          if (documentId) {
            const { data, error } = await supabase.from("user_uploads").select("*").eq("id", documentId).single()

            if (error) {
              console.error("Error fetching document:", error)
              Alert.alert("Error", "Failed to load document details")
              router.back()
              return
            }

            if (data) {
              setDocument(data)
              setTitle(`Consent for ${data.title}`)
            }
          }
        } else {
          Alert.alert("Error", "You are not logged in")
          router.back()
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        Alert.alert("Error", "Failed to load data")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [documentId])

  // Handle date change
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false)
    if (selectedDate) {
      // Keep the time from the current expiryDate
      const newDate = new Date(selectedDate)
      newDate.setHours(expiryDate.getHours())
      newDate.setMinutes(expiryDate.getMinutes())
      setExpiryDate(newDate)

      // On iOS, we'll show the time picker right after date selection
      if (Platform.OS === "ios") {
        setShowTimePicker(true)
      }
    }
  }

  // Handle time change
  const onTimeChange = (event, selectedTime) => {
    setShowTimePicker(false)
    if (selectedTime) {
      // Keep the date from the current expiryDate
      const newDate = new Date(expiryDate)
      newDate.setHours(selectedTime.getHours())
      newDate.setMinutes(selectedTime.getMinutes())
      setExpiryDate(newDate)
    }
  }

  // Format date for display
  const formatDate = (date) => {
    return (
      date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }) +
      " at " +
      date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
    )
  }

  // Validate form
  const validateForm = () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter a title for the consent")
      return false
    }

    if (!organization.trim()) {
      Alert.alert("Error", "Please enter an organization name")
      return false
    }

    if (expiryEnabled) {
      const now = new Date()
      if (expiryDate <= now) {
        Alert.alert("Error", "Expiry date must be in the future")
        return false
      }
    }

    return true
  }

  // Create consent
  const handleCreateConsent = async () => {
    if (!validateForm()) return

    try {
      setSaving(true)

      // Get the latest session
      const session = await getStoredSession()
      if (!session) {
        Alert.alert("Error", "Your session has expired. Please log in again.")
        setSaving(false)
        return
      }

      // Set the auth token
      supabase.auth.setSession(session)

      // Create a signed URL with expiry if enabled
      let signedUrl = null
      if (document?.file_url) {
        const expirySeconds = expiryEnabled ? Math.floor((expiryDate.getTime() - Date.now()) / 1000) : 31536000 // 1 year if no expiry

        // Extract the path correctly from the URL
        // The URL format is: https://[project-ref].supabase.co/storage/v1/object/public/documents/userId/fileName
        try {
          // Log the full URL for debugging
          console.log("Full file URL:", document.file_url)

          // Parse the URL to get just the path part after the bucket name
          const url = new URL(document.file_url)
          const pathParts = url.pathname.split("/")

          // Find the index of 'documents' in the path
          const documentsIndex = pathParts.findIndex((part) => part === "documents")

          if (documentsIndex === -1) {
            throw new Error("Invalid file URL format: bucket name not found")
          }

          // Get all parts after 'documents' to form the correct path
          const path = pathParts.slice(documentsIndex + 1).join("/")
          console.log("Extracted storage path for signed URL:", path)

          const { data, error } = await supabase.storage.from("documents").createSignedUrl(path, expirySeconds)

          if (error) {
            console.error("Signed URL error:", error)
            throw new Error(`Failed to create signed URL: ${error.message}`)
          }

          signedUrl = data.signedUrl
          console.log("Successfully created signed URL")
        } catch (error) {
          console.error("Error parsing file URL:", error)
          throw new Error(`Failed to process file URL: ${error.message}`)
        }
      }

      // Create app using the external API
      let appId = null
      let appAddress = null

      const walletAddress = await SecureStore.getItemAsync("walletAddress")
      const mnemonic = await SecureStore.getItemAsync("walletMnemonic")
      if (!mnemonic) throw new Error("No mnemonic found")

      const account = algosdk.mnemonicToSecretKey(mnemonic)

      if (!walletAddress || !mnemonic) {
        throw new Error("Wallet not found")
      }



      try {
        console.log("Creating app for wallet address:", walletAddress)

        const response = await fetch("http://172.16.4.103:3000/createApp", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            owner: walletAddress,
          }),
        })

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`)
        }

        const appData = await response.json()
        appId = appData.appId
        appAddress = appData.appAddress

        console.log("App created successfully:", appData)
      } catch (error) {
        console.error("Error creating app:", error)
        throw new Error(`Failed to create app: ${error.message}`)
      }



     

      try {
        const algodClient = new algosdk.Algodv2("", "https://testnet-api.algonode.cloud", "");

        const suggestedParams = await algodClient.getTransactionParams().do()


        const txn1 = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          sender: account.addr,
          receiver: appAddress,
          amount: 1000000,
          suggestedParams,
      });
      
      const signedTxn = txn1.signTxn(account.sk)
      
        const { txid } = await algodClient.sendRawTransaction(signedTxn).do() 
        await algosdk.waitForConfirmation(algodClient, txid, 4)
  
        const boxKey = algosdk.coerceToBytes('consentData');

        const atc = new algosdk.AtomicTransactionComposer();


        atc.addMethodCall({
          appID: Number(appId),
          method: METHODS[1], // your ABI method (buyNFT)
          signer: algosdk.makeBasicAccountTransactionSigner(account),
          methodArgs: [], 
          sender: walletAddress,
          suggestedParams: { ...suggestedParams, fee: Number(30) },
        });


        atc.addMethodCall({
          appID: Number(appId),
          method: METHODS[0], // your ABI method (buyNFT)
          signer: algosdk.makeBasicAccountTransactionSigner(account),
          methodArgs: ["Consent for sad","Sad","sad",1742714450,"hash","signed_url","data"], 
          sender: walletAddress,
          suggestedParams: { ...suggestedParams, fee: Number(30) },
          boxes:[{
            appIndex: Number(appId),
            name: boxKey,
          },]
        });


        const result = await atc.execute(algodClient, 4);
        for (const mr of result.methodResults) {
          console.log(`${mr.returnValue}`);
        }
        



















//         const txn2 = algosdk.makeApplicationNoOpTxnFromObject({
//           sender: account.addr,
//           appIndex: Number(appId),
//           appArgs: [
              
//           ],
//           // foreignAssets: [questAssetID],
//           suggestedParams: { ...suggestedParams, fee: Number(30) },
//       });

//       const selector = algosdk.getMethodByName(METHODS, 'createConsent').getSelector();

// // Convert your string argument into a Uint8Array
// const encoder = new TextEncoder();
// const stringArg = "your string argument"; // Replace with your actual string
// const encodedStringArg = encoder.encode(stringArg);
// const consentDataBox = {
//   appIndex: Number(appId),  // Ensure this is the correct app index for the box
//   name: encoder.encode("consentData")
// };
//       const txn3 = algosdk.makeApplicationNoOpTxnFromObject({
//         sender: account.addr,
//         appIndex: Number(appId),
//         appArgs: [
//            selector,
//            encoder.encode("For SAD"),
//            encoder.encode("Iyoooo"),

//            encoder.encode("Iyoooo"),
//            algosdk.encodeUint64(1742799999),
//            encoder.encode("Iyoooo"),
//            encoder.encode("Iyoooo"),
//            encoder.encode("Iyoooo"),


//         ],
//         boxes:[consentDataBox],
//         suggestedParams: { ...suggestedParams, fee: Number(30) },
//     });

//     const txns = [txn2, txn3,];
//     const txGroup = algosdk.assignGroupID(txns);
//     const signedTxns = txns.map(txn => txn.signTxn(account.sk));
//     const txId = txn1.txID(); // Use the first transaction's txID

//     // Send the signed transactions atomically
//     await algodClient.sendRawTransaction(signedTxns).do();

//     await algosdk.waitForConfirmation(
//       algodClient,
//       txId.toString(),
//       3
//     );

      } catch (error) {
        console.error("Error Creating Consent:", error)
      Alert.alert("Error", "Error Creating Consent")
      throw new Error(`Failed Creating Consent: ${error.message}`)

      }




      // Create consent record with app ID
      const { data: consentData, error: consentError } = await supabase
        .from("user_consents")
        .insert([
          {
            user_id: userId,
            wallet_address: walletAddress,
            document_id: document.id,
            title: title,
            description: description,
            organization: organization,
            access_type: accessType,
            expires_at: expiryEnabled ? expiryDate.toISOString() : null,
            status: "active",
            signed_url: signedUrl,
            app_id: appId,
            app_address: appAddress,
          },
        ])
        .select()

      if (consentError) {
        throw new Error(`Failed to create consent: ${consentError.message}`)
      }

      Alert.alert("Success", "Consent created successfully", [{ text: "OK", onPress: () => router.back() }])
    } catch (error) {
      console.error("Error creating consent:", error)
      Alert.alert("Error", `Failed to create consent: ${error.message}`)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <LinearGradient colors={["#000000", "#121212"]} style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6a11cb" />
        <Text style={styles.loadingText}>Loading document details...</Text>
      </LinearGradient>
    )
  }

  return (
    <LinearGradient colors={["#000000", "#121212"]} style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Consent</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            {document && (
              <View style={styles.documentCard}>
                <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.documentCardGradient}>
                  <View style={styles.documentHeader}>
                    <Text style={styles.documentHeaderTitle}>Selected Document</Text>
                  </View>

                  <View style={styles.documentInfo}>
                    <View style={styles.documentIconContainer}>
                      <LinearGradient
                        colors={
                          document.category === "medical"
                            ? ["#4a00e0", "#8e2de2"]
                            : document.category === "research"
                              ? ["#00b09b", "#96c93d"]
                              : document.category === "legal"
                                ? ["#ff9966", "#ff5e62"]
                                : document.category === "marketing"
                                  ? ["#fc4a1a", "#f7b733"]
                                  : ["#6a11cb", "#2575fc"]
                        }
                        style={styles.documentIcon}
                      >
                        {document.file_type?.includes("pdf") ? (
                          <FontAwesome5 name="file-pdf" size={24} color="#FFFFFF" />
                        ) : document.file_type?.includes("image") ? (
                          <FontAwesome5 name="file-image" size={24} color="#FFFFFF" />
                        ) : document.file_type?.includes("word") || document.file_type?.includes("document") ? (
                          <FontAwesome5 name="file-word" size={24} color="#FFFFFF" />
                        ) : (
                          <FontAwesome5 name="file-alt" size={24} color="#FFFFFF" />
                        )}
                      </LinearGradient>
                    </View>

                    <View style={styles.documentDetails}>
                      <Text style={styles.documentTitle}>{document.title}</Text>
                      <Text style={styles.documentCategory}>
                        {document.category?.charAt(0).toUpperCase() + document.category?.slice(1) || "Other"}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            )}

            <View style={styles.formContainer}>
              <Text style={styles.label}>Consent Title</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter consent title"
                placeholderTextColor="#777777"
                value={title}
                onChangeText={setTitle}
              />

              <Text style={styles.label}>Organization</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter organization name"
                placeholderTextColor="#777777"
                value={organization}
                onChangeText={setOrganization}
              />

              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter consent description"
                placeholderTextColor="#777777"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />

              <Text style={styles.label}>Access Type</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={accessType}
                  onValueChange={(value) => setAccessType(value)}
                  style={styles.picker}
                  dropdownIconColor="#FFFFFF"
                >
                  <Picker.Item label="View Only" value="view" color="#FFFFFF" />
                  <Picker.Item label="Download" value="download" color="#FFFFFF" />
                  <Picker.Item label="Edit" value="edit" color="#FFFFFF" />
                </Picker>
              </View>

              <View style={styles.expiryContainer}>
                <Text style={styles.label}>Set Expiry Date</Text>
                <Switch
                  value={expiryEnabled}
                  onValueChange={setExpiryEnabled}
                  trackColor={{ false: "#333333", true: "#6a11cb" }}
                  thumbColor={expiryEnabled ? "#FFFFFF" : "#777777"}
                />
              </View>

              {expiryEnabled && (
                <View>
                  <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowDatePicker(true)}>
                    <LinearGradient colors={["#141414", "#1E1E1E"]} style={styles.datePickerGradient}>
                      <Ionicons name="calendar-outline" size={22} color="#AAAAAA" style={styles.dateIcon} />
                      <Text style={styles.dateText}>{formatDate(expiryDate)}</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  <View style={styles.timeButtonsContainer}>
                    <TouchableOpacity style={styles.timeButton} onPress={() => setShowDatePicker(true)}>
                      <Text style={styles.timeButtonText}>Change Date</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.timeButton} onPress={() => setShowTimePicker(true)}>
                      <Text style={styles.timeButtonText}>Change Time</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {showDatePicker && (
                <DateTimePicker
                  value={expiryDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                  minimumDate={new Date()}
                />
              )}

              {showTimePicker && (
                <DateTimePicker value={expiryDate} mode="time" display="default" onChange={onTimeChange} />
              )}

              <View style={styles.warningContainer}>
                <Ionicons name="information-circle-outline" size={24} color="#6a11cb" />
                <Text style={styles.warningText}>
                  {expiryEnabled
                    ? "The consent will automatically expire on the selected date and time. After expiry, the document will no longer be accessible to the organization."
                    : "Without an expiry date, this consent will remain active until manually revoked."}
                </Text>
              </View>

              <TouchableOpacity style={styles.createButton} onPress={handleCreateConsent} disabled={saving}>
                <LinearGradient colors={["#6a11cb", "#2575fc"]} style={styles.createButtonGradient}>
                  {saving ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <>
                      <Text style={styles.createButtonText}>Create Consent</Text>
                      <Ionicons name="shield-checkmark" size={20} color="#FFFFFF" style={{ marginLeft: 8 }} />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
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
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  documentCard: {
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  documentCardGradient: {
    padding: 15,
  },
  documentHeader: {
    marginBottom: 12,
  },
  documentHeaderTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
  },
  documentInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  documentIconContainer: {
    marginRight: 15,
  },
  documentIcon: {
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  documentDetails: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  documentCategory: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#AAAAAA",
  },
  formContainer: {
    marginBottom: 40,
  },
  label: {
    fontSize: 16,
    fontFamily: "Poppins-Medium",
    color: "#FFFFFF",
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    paddingHorizontal: 15,
    color: "#FFFFFF",
    fontFamily: "Poppins-Regular",
    borderWidth: 1,
    borderColor: "#333333",
  },
  textArea: {
    height: 100,
    paddingTop: 12,
    paddingBottom: 12,
    textAlignVertical: "top",
  },
  pickerContainer: {
    width: "100%",
    height: 50,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333333",
    justifyContent: "center",
    overflow: "hidden",
  },
  picker: {
    color: "#FFFFFF",
    backgroundColor: "transparent",
  },
  expiryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  datePickerButton: {
    width: "100%",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 8,
  },
  datePickerGradient: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    height: 50,
  },
  dateIcon: {
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    color: "#FFFFFF",
  },
  timeButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  timeButton: {
    flex: 1,
    backgroundColor: "#1E1E1E",
    borderRadius: 8,
    padding: 10,
    alignItems: "center",
    marginHorizontal: 4,
  },
  timeButtonText: {
    color: "#AAAAAA",
    fontFamily: "Poppins-Medium",
    fontSize: 14,
  },
  warningContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(106, 17, 203, 0.1)",
    borderRadius: 12,
    padding: 15,
    marginTop: 20,
    alignItems: "flex-start",
  },
  warningText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    color: "#FFFFFF",
  },
  createButton: {
    width: "100%",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 30,
  },
  createButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  createButtonText: {
    fontSize: 16,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
  },
})

