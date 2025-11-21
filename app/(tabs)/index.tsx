import { useHabits } from "@/hooks/useHabits";
import { useRealtimeHabits } from "@/hooks/useRealtimeHabits";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { Button, Surface, Text } from "react-native-paper";
import {
  COMPLETIONS_TABLE_ID,
  DATABASE_ID,
  HABITS_TABLE_ID,
} from "../../lib/appwrite";
import { useAuth } from "../../lib/auth-context";

export default function Index() {
  const { signOut, user } = useAuth();
  const {
    habits,
    completedHabits,
    fetchHabits,
    fetchCompletedHabits,
    handleDeleteHabit,
    handleComleteHabit,
    isHabitCompleted,
  } = useHabits(user?.$id ?? "");

  const swipeableRefs = useRef<{ [key: string]: Swipeable | null }>({});

  // FUNCION PARA RENDERIZAR LAS ACCIONES AL DESLIZAR A LA DERECHA
  const renderRightActions = () => (
    <View style={styles.rightAction}>
      <MaterialCommunityIcons name="trash-can-outline" size={32} color="#fff" />
    </View>
  );

  // FUNCION PARA RENDERIZAR LAS ACCIONES AL DESLIZAR A LA IZQUIERDA
  const renderLeftActions = () => (
    <View style={styles.leftAction}>
      <MaterialCommunityIcons
        name="check-circle-outline"
        size={32}
        color="#fff"
      />
    </View>
  );

  useRealtimeHabits({
    user: user?.$id ? user : null,
    fetchHabits,
    fetchCompletedHabits,
    DATABASE_ID,
    HABITS_TABLE_ID,
    COMPLETIONS_TABLE_ID,
  });

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
              onSwipeableOpen={(direction) => {
                if (direction === "right") {
                  swipeableRefs.current[habit.$id]?.close();
                  handleDeleteHabit(habit.$id);
                } else if (direction === "left") {
                  swipeableRefs.current[habit.$id]?.close();
                  handleComleteHabit(habit.$id);
                }
              }}
            >
              <Surface
                style={[
                  styles.card,
                  isHabitCompleted(habit.$id) && styles.completedCard,
                ]}
                elevation={0}
              >
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
  container: { flex: 1, padding: 16, backgroundColor: "#f5f5f5" },
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
  completedCard: {
    opacity: 0.6,
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
    alignItems: "flex-end",
    flex: 1,
    backgroundColor: "#ff5252",
    borderRadius: 18,
    marginBottom: 18,
    paddingHorizontal: 20,
    marginTop: 2,
  },
  leftAction: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#4caf50",
    borderRadius: 18,
    marginBottom: 18,
    paddingHorizontal: 20,
    marginTop: 2,
  },
});
