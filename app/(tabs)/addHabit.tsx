import React from "react";
import { StyleSheet, View } from "react-native";
import { Button, SegmentedButtons, TextInput } from "react-native-paper";

const frequencies = [
  { label: "Diario", value: "daily" },
  { label: "Semanal", value: "weekly" },
  { label: "Mensual", value: "monthly" },
];

const addHabit = () => {
  return (
    <View style={styles.container}>
      <TextInput label="Titulo" mode="outlined" />
      <TextInput
        label="Descripcion"
        mode="outlined"
        multiline
        numberOfLines={4}
      />
      <View>
        <SegmentedButtons
          buttons={frequencies.map((freq) => ({
            value: freq.value,
            label: freq.label,
          }))}
        />
      </View>
      <Button mode="contained" onPress={() => {}}>
        Agregar Habito
      </Button>
    </View>
  );
};

export default addHabit;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
});
