import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";

import { Button, Text, TextInput } from "react-native-paper";

const auth = () => {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Funcion para cambiar entre modos de autenticacion
  const handleSwitchMode = () => {
    setIsSignUp((prevState) => !prevState);
  };

  // Funcion para manejar la autenticacion
  const handleAuth = () => {
    if (!email || !password) {
      setError("Por favor, complete todos los campos.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setError(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>
          {isSignUp ? "Crear Cuenta" : "Bienvenido de nuevo"}
        </Text>
        <TextInput
          label="Email"
          placeholder="example@gmail.com"
          keyboardType="email-address"
          autoCapitalize="none"
          mode="outlined"
          onChangeText={setEmail}
        />
        <TextInput
          label="Contraseña"
          keyboardType="email-address"
          autoCapitalize="none"
          mode="outlined"
          onChangeText={setPassword}
        />

        {/* Error si hay algun campo vacio */}
        {error && <Text style={{ color: "red" }}>{error}</Text>}

        <Button mode="contained" onPress={handleAuth}>
          {isSignUp ? "Registrarse" : "Iniciar sesion"}
        </Button>
        <Button mode="text" onPress={handleSwitchMode}>
          {isSignUp
            ? "¿Ya tienes una cuenta? Iniciar sesión"
            : "¿No tienes una cuenta? Registrarse"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};

export default auth;

// ESTILOS DE LA PANTALLA

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 25,
    marginBottom: 20,
    textAlign: "center",
  },
});
