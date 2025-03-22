"use client"
import { StatusBar } from "expo-status-bar"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { useFonts } from "expo-font"
import { ActivityIndicator, View, StyleSheet, Text } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { LinearGradient } from "expo-linear-gradient"
import { Drawer } from "expo-router/drawer"
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons"
import { DrawerContentScrollView } from "@react-navigation/drawer"
import { useState, useRef, useEffect } from "react"
import { Animated, Pressable } from "react-native"

// Custom drawer item component with animation
function CustomDrawerItem({ label, icon, isActive, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 100,
      useNativeDriver: true,
    }).start()
  }

  return (
    <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View
        style={[styles.customDrawerItem, isActive && styles.activeDrawerItem, { transform: [{ scale: scaleAnim }] }]}
      >
        <LinearGradient
          colors={isActive ? ["#2A2A2A", "#333333"] : ["transparent", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.itemGradient, isActive && styles.activeItemGradient]}
        >
          <View style={styles.iconContainer}>{icon}</View>
          <Text style={[styles.drawerItemLabel, isActive && styles.activeDrawerItemLabel]}>{label}</Text>
          {isActive && <View style={styles.activeIndicator} />}
        </LinearGradient>
      </Animated.View>
    </Pressable>
  )
}

// Custom drawer content
function CustomDrawerContent(props) {
  const [activeRoute, setActiveRoute] = useState("(tabs)")

  // Extract the current route name
  useEffect(() => {
    if (props.state && props.state.routes) {
      const currentRouteName = props.state.routes[props.state.index]?.name
      setActiveRoute(currentRouteName)
    }
  }, [props.state])

  const drawerItems = [
    {
      name: "(tabs)",
      label: "Dashboard",
      icon: (color) => <FontAwesome5 name="th-large" size={18} color={color} />,
    },
    {
      name: "(sidebar)/dao-proposal",
      label: "DAO Proposal",
      icon: (color) => <FontAwesome5 name="vote-yea" size={18} color={color} />,
    },
    {
      name: "(sidebar)/settings",
      label: "Settings",
      icon: (color) => <Ionicons name="settings-outline" size={20} color={color} />,
    },
    {
      name: "(sidebar)/wallet-settings",
      label: "Wallet Settings",
      icon: (color) => <Ionicons name="wallet-outline" size={20} color={color} />,
    },
    {
      name: "(sidebar)/contact",
      label: "Contact",
      icon: (color) => <Ionicons name="mail-outline" size={20} color={color} />,
    },
    {
      name: "(sidebar)/support",
      label: "Support",
      icon: (color) => <Ionicons name="help-circle-outline" size={20} color={color} />,
    },
  ]

  return (
    <View style={styles.drawerContainer}>
      <LinearGradient colors={["#121212", "#000000"]} style={styles.drawerGradient}>
        <View style={styles.drawerHeader}>
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={["#333", "#222"]}
              style={styles.logoBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <MaterialCommunityIcons name="shield-check" size={28} color="#FFFFFF" />
            </LinearGradient>
          </View>
          <Text style={styles.drawerTitle}>Consent Manager</Text>
          <Text style={styles.drawerSubtitle}>Secure • Private • Trusted</Text>
        </View>

        <View style={styles.divider} />

        <DrawerContentScrollView
          {...props}
          style={styles.drawerScrollView}
          contentContainerStyle={styles.drawerContentContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.drawerItemsContainer}>
            {drawerItems.map((item) => (
              <CustomDrawerItem
                key={item.name}
                label={item.label}
                icon={item.icon(activeRoute === item.name ? "#FFFFFF" : "#AAAAAA")}
                isActive={activeRoute === item.name}
                onPress={() => {
                  props.navigation.navigate(item.name)
                }}
              />
            ))}
          </View>
        </DrawerContentScrollView>

        <View style={styles.drawerFooter}>
          <LinearGradient colors={["rgba(18, 18, 18, 0.8)", "rgba(0, 0, 0, 0.9)"]} style={styles.footerGradient}>
            <Pressable style={styles.logoutButton}>
              <Ionicons name="log-out-outline" size={20} color="#FF5555" />
              <Text style={styles.logoutText}>Disconnect</Text>
            </Pressable>
            <Text style={styles.versionText}>v1.2.0</Text>
          </LinearGradient>
        </View>
      </LinearGradient>
    </View>
  )
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
  })

  // Show loading screen while fonts are loading
  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <StatusBar style="light" />
        <LinearGradient colors={["#000000", "#121212"]} style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFFFFF" />
          <Text style={styles.loadingText}>Loading...</Text>
        </LinearGradient>
      </SafeAreaProvider>
    )
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <Drawer
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={{
            headerShown: false,
            drawerStyle: {
              backgroundColor: "transparent",
              width: 300,
            },
            drawerType: "front",
            overlayColor: "rgba(0, 0, 0, 0.7)",
            sceneContainerStyle: {
              backgroundColor: "#000000",
            },
          }}
        >
          <Drawer.Screen name="index" options={{ headerShown: false }} />
          <Drawer.Screen name="(onboarding)" options={{ headerShown: false, swipeEnabled: false }} />
          <Drawer.Screen name="(auth)" options={{ headerShown: false, swipeEnabled: false }} />
          <Drawer.Screen name="(tabs)" options={{ headerShown: false }} />
          <Drawer.Screen name="(sidebar)/dao-proposal" />
          <Drawer.Screen name="(sidebar)/settings" />
          <Drawer.Screen name="(sidebar)/wallet-settings" />
          <Drawer.Screen name="(sidebar)/contact" />
          <Drawer.Screen name="(sidebar)/support" />
          <Drawer.Screen name="+not-found" options={{ headerShown: false }} />
        </Drawer>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "#FFFFFF",
    marginTop: 20,
    fontSize: 18,
    fontFamily: "Poppins-Medium",
  },
  // Drawer styles
  drawerContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  drawerGradient: {
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: "#222222",
  },
  drawerScrollView: {
    backgroundColor: "transparent",
  },
  drawerContentContainer: {
    paddingTop: 0,
  },
  drawerHeader: {
    padding: 24,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 20,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoBackground: {
    width: 60,
    height: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  drawerTitle: {
    fontSize: 22,
    fontFamily: "Poppins-Bold",
    color: "#FFFFFF",
    textAlign: "center",
  },
  drawerSubtitle: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: "#AAAAAA",
    marginTop: 4,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: "#333333",
    marginHorizontal: 20,
    marginBottom: 16,
  },
  drawerItemsContainer: {
    marginTop: 5,
    paddingHorizontal: 12,
  },
  customDrawerItem: {
    marginVertical: 6,
    borderRadius: 12,
    overflow: "hidden",
  },
  activeDrawerItem: {
    backgroundColor: "#333333",
  },
  itemGradient: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  activeItemGradient: {
    borderLeftWidth: 0,
  },
  iconContainer: {
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  drawerItemLabel: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#AAAAAA",
    flex: 1,
  },
  activeDrawerItemLabel: {
    color: "#FFFFFF",
    fontFamily: "Poppins-SemiBold",
  },
  activeIndicator: {
    width: 4,
    height: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 2,
    position: "absolute",
    right: 0,
  },
  drawerFooter: {
    padding: 16,
    marginTop: "auto",
  },
  footerGradient: {
    borderTopWidth: 1,
    borderTopColor: "#222222",
    paddingTop: 16,
    paddingHorizontal: 12,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255, 85, 85, 0.1)",
  },
  logoutText: {
    fontFamily: "Poppins-Medium",
    fontSize: 14,
    color: "#FF5555",
    marginLeft: 12,
  },
  versionText: {
    fontFamily: "Poppins-Regular",
    fontSize: 12,
    color: "#666666",
    textAlign: "center",
    marginTop: 16,
  },
})

