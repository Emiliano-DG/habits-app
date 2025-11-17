import { DATABASE_ID, databases, HABITS_TABLE_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { ID } from "react-native-appwrite";
import {
  Button,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";

//definimos las frecuencias disponibles
const frequencies = [
  { label: "Diario", value: "daily" },
  { label: "Semanal", value: "weekly" },
  { label: "Mensual", value: "monthly" },
];

//definimos el tipo de frecuencia
type Frequency = (typeof frequencies)[number]["value"];

//componente para agregar habito
const AddHabitScreen = () => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [frequency, setFrequency] = useState<Frequency>("daily");
  const [error, setError] = useState<string>("");
  const { user } = useAuth();
  const router = useRouter();
  const theme = useTheme();

  //funcion para agregar habito
  const handleSubmit = async () => {
    try {
      if (!user) return;
      await databases.createDocument(
        DATABASE_ID,
        HABITS_TABLE_ID,
        ID.unique(),
        {
          user_id: user.$id,
          title,
          description,
          frequency,
          streak_count: 0,
          last_completed: new Date().toISOString(),
          created_at: new Date().toISOString(),
        }
      );
      router.back();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
        return;
      }
      setError("there was an error creating the habit");
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.container}>
        <TextInput
          label="Titulo"
          mode="outlined"
          style={styles.input}
          onChangeText={setTitle}
        />
        <TextInput
          label="Descripcion"
          mode="outlined"
          multiline
          numberOfLines={4}
          style={styles.input}
          onChangeText={setDescription}
        />
        <View style={styles.frequencyContainer}>
          <SegmentedButtons
            value={frequency}
            onValueChange={(value) => setFrequency(value as Frequency)}
            buttons={frequencies.map((freq) => ({
              value: freq.value,
              label: freq.label,
            }))}
          />
        </View>
        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={!title || !description}
        >
          Agregar Habito
        </Button>
        {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}
      </View>
    </KeyboardAvoidingView>
  );
};

export default AddHabitScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },
  input: {
    marginBottom: 16,
  },
  frequencyContainer: {
    marginBottom: 24,
  },
});
