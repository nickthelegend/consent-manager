import * as SecureStore from "expo-secure-store"

// Key constants
const SESSION_KEY = "supabase.session"
const WALLET_MNEMONIC_KEY = "walletMnemonic"
const WALLET_ADDRESS_KEY = "walletAddress"

/**
 * Store Supabase session in secure storage
 * @param session The session object to store
 */
export const storeSession = async (session: any): Promise<void> => {
  try {
    const serializedSession = JSON.stringify(session)
    await SecureStore.setItemAsync(SESSION_KEY, serializedSession)
    console.log("Session stored successfully")
  } catch (error) {
    console.error("Error storing session:", error)
    throw error
  }
}

/**
 * Get stored Supabase session from secure storage
 * @returns The session object or null if not found
 */
export const getStoredSession = async (): Promise<any | null> => {
  try {
    const sessionData = await SecureStore.getItemAsync(SESSION_KEY)
    if (!sessionData) {
      console.log("No session found in secure storage")
      return null
    }
    
    const session = JSON.parse(sessionData)
    console.log("Session retrieved successfully")
    return session
  } catch (error) {
    console.error("Error retrieving session:", error)
    return null
  }
}

/**
 * Delete stored Supabase session from secure storage
 */
export const deleteSession = async (): Promise<void> => {
  try {
    await SecureStore.deleteItemAsync(SESSION_KEY)
    console.log("Session deleted successfully")
  } catch (error) {
    console.error("Error deleting session:", error)
    throw error
  }
}

/**
 * Store wallet mnemonic in secure storage
 * @param mnemonic The wallet mnemonic to store
 */
export const storeWalletMnemonic = async (mnemonic: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(WALLET_MNEMONIC_KEY, mnemonic)
    console.log("Wallet mnemonic stored successfully")
  } catch (error) {
    console.error("Error storing wallet mnemonic:", error)
    throw error
  }
}

/**
 * Get stored wallet mnemonic from secure storage
 * @returns The wallet mnemonic or null if not found
 */
export const getWalletMnemonic = async (): Promise<string | null> => {
  try {
    const mnemonic = await SecureStore.getItemAsync(WALLET_MNEMONIC_KEY)
    return mnemonic
  } catch (error) {
    console.error("Error retrieving wallet mnemonic:", error)
    return null
  }
}

/**
 * Store wallet address in secure storage
 * @param address The wallet address to store
 */
export const storeWalletAddress = async (address: string): Promise<void> => {
  try {
    await SecureStore.setItemAsync(WALLET_ADDRESS_KEY, address)
    console.log("Wallet address stored successfully")
  } catch (error) {
    console.error("Error storing wallet address:", error)
    throw error
  }
}

/**
 * Get stored wallet address from secure storage
 * @returns The wallet address or null if not found
 */
export const getWalletAddress = async (): Promise<string | null> => {
  try {
    const address = await SecureStore.getItemAsync(WALLET_ADDRESS_KEY)
    return address
  } catch (error) {
    console.error("Error retrieving wallet address:", error)
    return null
  }
}
