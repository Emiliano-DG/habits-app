import { StyleSheet, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator animating={true} size="large" color="#4f46e5" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

export default LoadingScreen;
