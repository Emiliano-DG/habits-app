import { Habit } from "@/types/database.type";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text } from "react-native-paper";
import {
  client,
  DATABASE_ID,
  databases,
  HABITS_TABLE_ID,
  RealTimeResponse,
} from "../../lib/appwrite";
import { useAuth } from "../../lib/auth-context";

export default function Index() {
  const { signOut, user } = useAuth();
  const [habits, setHabits] = useState<Habit[]>([]);
  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});

  //funcion para obtener los habits
  const fetchHabits = async () => {
    const response = await databases.listDocuments<Habit>(
      DATABASE_ID,
      HABITS_TABLE_ID,
      [Query.equal("user_id", user?.$id ?? "")]
    );
    setHabits(response.documents);
  };

  // funcion para renderizar las acciones al deslizar a la derecha
  const renderRightActions = () => (
    <View style={styles.rightAction}>
      <MaterialCommunityIcons
        name="check-circle-outline"
        size={32}
        color="#fff"
        // style={{ backgroundColor: "#4caf50", padding: 20 }}
      />
    </View>
  );

  // funcion para renderizar las acciones al deslizar a la izquierda
  const renderLeftActions = () => (
    <View style={styles.leftAction}>
      <MaterialCommunityIcons
        name="trash-can-outline"
        size={32}
        color="#fff"
        // style={{ backgroundColor: "#ff5252", padding: 20 }}
      />
    </View>
  );

  // suscripcion en tiempo real para escuchar cambios en los habits
  useEffect(() => {
    if (!user) return; // evita escuchar la base de datos de un usuario que no esta logueado
    const habitsSubscription = client.subscribe(
      [`databases.${DATABASE_ID}.collections.${HABITS_TABLE_ID}.documents`],
      (response: RealTimeResponse) => {
        if (
          response.events.includes(
            `databases.${DATABASE_ID}.collections.${HABITS_TABLE_ID}.documents.*.create`
          )
        ) {
          fetchHabits();
        } else if (
          response.events.includes(
            `databases.${DATABASE_ID}.collections.${HABITS_TABLE_ID}.documents.*.update`
          )
        ) {
          fetchHabits();
        } else if (
          response.events.includes(
            `databases.${DATABASE_ID}.collections.${HABITS_TABLE_ID}.documents.*.delete`
          )
        ) {
          fetchHabits();
        }
      }
    );
    fetchHabits(); // obtener los habits al montar el componente
    return () => {
      habitsSubscription();
    };
  }, [user]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Habitos Actuales
        </Text>
        <Button mode="text" onPress={signOut} icon={"logout"}>
          Cerrar sesion
        </Button>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {habits?.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text variant="bodyMedium" style={styles.emptyText}>
              No hay habits actuales
            </Text>
          </View>
        ) : (
          habits.map((habit, key) => (
            <Swipeable
              ref={(ref) => {
                swipeableRefs.current[habit.$id] = ref;
              }}
              key={key}
              overshootLeft={false}
              overshootRight={false}
              renderRightActions={renderRightActions}
              renderLeftActions={renderLeftActions}
            >
              <Surface style={styles.card} elevation={0}>
                <View style={styles.cardContainer}>
                  <Text style={styles.cardTitle}>{habit.title}</Text>
                  <Text style={styles.cardDescription}>
                    {habit.description}
                  </Text>
                  <View style={styles.cardFooter}>
                    <View style={styles.streakBadge}>
                      <MaterialCommunityIcons
                        name="fire"
                        size={18}
                        color="#ff9800"
                      />
                      <Text style={styles.streakText}>
                        {habit.streak_count} rachas seguidas
                      </Text>
                    </View>
                    <View style={styles.frequencyBadge}>
                      <Text style={styles.frequencyText}>
                        {habit.frequency}
                      </Text>
                    </View>
                  </View>
                </View>
              </Surface>
            </Swipeable>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#000" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: { fontWeight: "bold" },
  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#f7f2fa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    color: "666666",
  },
  cardContainer: { padding: 20 },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#22223b",
  },
  cardDescription: {
    fontSize: 15,
    marginBottom: 16,
    color: "#6c6c80",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  streakText: {
    marginLeft: 6,
    color: "#ff9800",
    fontWeight: "bold",
    fontSize: 14,
  },
  frequencyBadge: {
    backgroundColor: "#ede7f6",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  frequencyText: {
    color: "#7c4dff",
    fontWeight: "bold",
    fontSize: 14,
    textTransform: "capitalize",
  },
  rightAction: {
    justifyContent: "center",
    alignItems: "center",
  },
  leftAction: {
    justifyContent: "center",
    alignItems: "center",
  },
});
