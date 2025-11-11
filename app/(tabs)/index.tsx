import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { useAuth } from "../../lib/auth-context";

export default function Index() {
  const { signOut } = useAuth();
  return (
    <View style={styles.view}>
      <Text>Hello</Text>
      <Button mode="text" onPress={signOut} icon={"logout"}>
        Cerrar sesion
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  view: { flex: 1, justifyContent: "center", alignItems: "center" },
});
