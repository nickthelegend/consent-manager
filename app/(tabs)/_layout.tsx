"use client"

import { useEffect, useRef, useState } from "react"
import { Tabs } from "expo-router"
import { StyleSheet, View, Pressable, Animated, Dimensions } from "react-native"
import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { DrawerToggleButton } from "@react-navigation/drawer"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop } from "react-native-svg"

const { width } = Dimensions.get("window")

// Custom tab bar component with animations and effects
function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets()
  const tabWidth = width / state.routes.length

  // useRef and useState must be called at the top level of the component
  const translateX = useRef(new Animated.Value(0)).current
  const scaleX = useRef(new Animated.Value(1)).current
  const [isFocusedIndex, setIsFocusedIndex] = useState(state.index)

  // Animation for the active indicator
  useEffect(() => {
    Animated.parallel([
      Animated.spring(translateX, {
        toValue: state.index * tabWidth,
        useNativeDriver: true,
        tension: 68,
        friction: 8,
      }),
      Animated.sequence([
        Animated.timing(scaleX, {
          toValue: 0.8,
          duration: 50,
          useNativeDriver: true,
        }),
        Animated.spring(scaleX, {
          toValue: 1,
          useNativeDriver: true,
          tension: 68,
          friction: 5,
        }),
      ]),
    ]).start()
  }, [state.index, tabWidth, translateX, scaleX])

  // Tab data with custom icons
  const tabs = [
    {
      route: "index",
      activeIcon: (color) => (
        <View style={styles.customIconContainer}>
          <MaterialCommunityIcons name="view-dashboard" size={30} color={color} />
        </View>
      ),
      inactiveIcon: (color) => <MaterialCommunityIcons name="view-dashboard-outline" size={28} color={color} />,
    },
    {
      route: "consents",
      activeIcon: (color) => (
        <View style={styles.customIconContainer}>
          <MaterialCommunityIcons name="clipboard-check" size={30} color={color} />
        </View>
      ),
      inactiveIcon: (color) => <MaterialCommunityIcons name="clipboard-check-outline" size={28} color={color} />,
    },
    {
      route: "documents",
      activeIcon: (color) => (
        <View style={styles.customIconContainer}>
          <MaterialCommunityIcons name="file-document" size={30} color={color} />
        </View>
      ),
      inactiveIcon: (color) => <MaterialCommunityIcons name="file-document-outline" size={28} color={color} />,
    },
    {
      route: "profile",
      activeIcon: (color) => (
        <View style={styles.customIconContainer}>
          <MaterialCommunityIcons name="account" size={30} color={color} />
        </View>
      ),
      inactiveIcon: (color) => <MaterialCommunityIcons name="account-outline" size={28} color={color} />,
    },
  ]

  return (
    <View style={[styles.tabBarContainer, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      <BlurView intensity={30} tint="dark" style={styles.blurView}>
        <LinearGradient colors={["rgba(25, 25, 30, 0.9)", "rgba(15, 15, 20, 0.95)"]} style={styles.tabBarGradient}>
          {/* Custom curved shape for the top of the tab bar */}
          <View style={styles.tabBarTopCurve}>
            <Svg height="20" width={width} style={styles.curveSvg}>
              <Defs>
                <SvgGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <Stop offset="0" stopColor="rgba(15, 15, 20, 0.95)" stopOpacity="1" />
                  <Stop offset="1" stopColor="rgba(25, 25, 30, 0.9)" stopOpacity="1" />
                </SvgGradient>
              </Defs>
              <Path d={`M0,0 L${width},0 L${width},10 Q${width / 2},20 0,10 Z`} fill="url(#grad)" />
            </Svg>
          </View>

          {/* Animated indicator for active tab */}
          <Animated.View
            style={[
              styles.activeTabIndicator,
              {
                transform: [{ translateX: translateX }, { scaleX: scaleX }],
                width: tabWidth * 0.6,
                left: tabWidth * 0.2,
              },
            ]}
          />

          {/* Tab buttons */}
          <View style={styles.tabButtonsContainer}>
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key]
              const isFocused = state.index === index
              const tab = tabs.find((t) => t.route === route.name)

              // Animation values
              const scale = useRef(new Animated.Value(isFocused ? 1 : 0.9)).current
              const opacity = useRef(new Animated.Value(isFocused ? 1 : 0.6)).current
              const translateY = useRef(new Animated.Value(isFocused ? -10 : 0)).current

              useEffect(() => {
                if (isFocused) {
                  Animated.parallel([
                    Animated.spring(scale, { toValue: 1, useNativeDriver: true, tension: 80, friction: 5 }),
                    Animated.timing(opacity, { toValue: 1, useNativeDriver: true, duration: 200 }),
                    Animated.spring(translateY, { toValue: -10, useNativeDriver: true, tension: 80, friction: 5 }),
                  ]).start()
                } else {
                  Animated.parallel([
                    Animated.spring(scale, { toValue: 0.9, useNativeDriver: true, tension: 80, friction: 5 }),
                    Animated.timing(opacity, { toValue: 0.6, useNativeDriver: true, duration: 200 }),
                    Animated.spring(translateY, { toValue: 0, useNativeDriver: true, tension: 80, friction: 5 }),
                  ]).start()
                }
              }, [isFocused, scale, opacity, translateY])

              const onPress = () => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                })

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name)
                }
              }

              // Animation values
              const [buttonScale] = useState(new Animated.Value(isFocused ? 1 : 0.9))
              const [buttonOpacity] = useState(new Animated.Value(isFocused ? 1 : 0.6))
              const [buttonTranslateY] = useState(new Animated.Value(isFocused ? -10 : 0))

              useEffect(() => {
                Animated.parallel([
                  Animated.spring(buttonScale, {
                    toValue: isFocused ? 1 : 0.9,
                    useNativeDriver: true,
                    tension: 80,
                    friction: 5,
                  }),
                  Animated.timing(buttonOpacity, {
                    toValue: isFocused ? 1 : 0.6,
                    useNativeDriver: true,
                    duration: 200,
                  }),
                  Animated.spring(buttonTranslateY, {
                    toValue: isFocused ? -10 : 0,
                    useNativeDriver: true,
                    tension: 80,
                    friction: 5,
                  }),
                ]).start()
              }, [isFocused, buttonScale, buttonOpacity, buttonTranslateY])

              return (
                <Pressable
                  key={index}
                  accessibilityRole="button"
                  accessibilityState={isFocused ? { selected: true } : {}}
                  accessibilityLabel={options.tabBarAccessibilityLabel}
                  onPress={onPress}
                  style={styles.tabButton}
                >
                  <Animated.View
                    style={[
                      styles.tabIconContainer,
                      isFocused && styles.activeTabIconContainer,
                      {
                        transform: [{ translateY: buttonTranslateY }, { scale: buttonScale }],
                        opacity: buttonOpacity,
                      },
                    ]}
                  >
                    {isFocused
                      ? tab.activeIcon(isFocused ? "#FFFFFF" : "#777777")
                      : tab.inactiveIcon(isFocused ? "#FFFFFF" : "#777777")}

                    {isFocused && (
                      <LinearGradient
                        colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.05)"]}
                        style={styles.activeIconGlow}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      />
                    )}
                  </Animated.View>
                </Pressable>
              )
            })}
          </View>
        </LinearGradient>
      </BlurView>
    </View>
  )
}

// Main layout component for tabs
export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: "#000000",
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTintColor: "#FFFFFF",
        headerTitleStyle: {
          fontFamily: "Poppins-Medium",
        },
        headerLeft: () => <DrawerToggleButton tintColor="#FFFFFF" />,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
        }}
      />
      <Tabs.Screen
        name="consents"
        options={{
          title: "Consents",
        }}
      />
      <Tabs.Screen
        name="documents"
        options={{
          title: "Documents",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  // Tab bar styles
  tabBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 75,
    zIndex: 100,
  },
  blurView: {
    overflow: "hidden",
    width: "100%",
    height: "100%",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  tabBarGradient: {
    flex: 1,
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
  },
  tabBarTopCurve: {
    position: "absolute",
    top: -20,
    left: 0,
    right: 0,
    height: 20,
  },
  curveSvg: {
    position: "absolute",
    top: 0,
  },
  activeTabIndicator: {
    position: "absolute",
  },
  tabButtonsContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: 60,
  },
  tabIconContainer: {
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  customIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  activeTabIconContainer: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    shadowColor: "#FFFFFF",
  },
  activeIconGlow: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 20,
  },
})

