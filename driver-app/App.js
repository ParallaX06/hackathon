import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import * as Location from "expo-location";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth, signInAnonymously } from "firebase/auth";
import firebaseConfig from "./firebaseConfig";

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export default function App() {
  const [tracking, setTracking] = useState(false);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    // Sign in anonymously (so every driver can send data without login)
    signInAnonymously(auth).catch((error) => console.log(error));
  }, []);

  const startTracking = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      alert("Permission to access location was denied");
      return;
    }

    setTracking(true);

    // Watch position every 10 seconds
    Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 10000, // 10 sec
        distanceInterval: 0,
      },
      (loc) => {
        const coords = {
          lat: loc.coords.latitude,
          lon: loc.coords.longitude,
          timestamp: Date.now(),
        };

        setLocation(coords);

        // Push to Firebase under bus_id = "bus_101"
        const busRef = ref(db, "buses/bus_101");
        set(busRef, coords);
      }
    );
  };

  const stopTracking = () => {
    setTracking(false);
    setLocation(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Driver App</Text>
      {!tracking ? (
        <Button title="Start Trip" onPress={startTracking} />
      ) : (
        <Button title="Stop Trip" onPress={stopTracking} />
      )}
      {location && (
        <Text>
          Location: {location.lat.toFixed(5)}, {location.lon.toFixed(5)}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 20, marginBottom: 20 },
});
