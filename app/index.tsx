import {
  Inter_400Regular,
  useFonts
} from '@expo-google-fonts/inter';
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import { Animated, LogBox, StyleSheet, Text, View } from "react-native";

// Hide Expo Go push notification warnings
LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications',
  '`expo-notifications` functionality is not fully supported in Expo Go'
]);

export default function Index() {

  // Load fonts
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
  });

  const router = useRouter(); // Router to move between files

  // Animations (Do not know the complexities of the code in detail)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 10,
        friction: 2,
        useNativeDriver: true,
      }),
    ]).start();

    const timer = setTimeout(() => {
      router.replace("/auth"); // Remove the index page from the route system
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {fontsLoaded && (
          <View>
            <Ionicons name="medical" size={100} color="black" style={{textAlign: "center"}}/>
            <Text style={styles.appName}>RemedyDose</Text>
          </View>)}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  iconContainer: {
    alignItems: "center",
  },
  appName: {
    color: "black",
    fontSize: 32,
    marginTop: 20,
    fontFamily: "Inter_400Regular"
  },
});