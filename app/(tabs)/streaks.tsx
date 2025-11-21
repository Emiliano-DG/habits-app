import { HabitCompletion } from "@/types/database.type";
import { useState } from "react";
import { Text, View } from "react-native";
import { Query } from "react-native-appwrite";
import { useHabits } from "../../hooks/useHabits";
import { useRealtimeHabits } from "../../hooks/useRealtimeHabits";
import {
  COMPLETIONS_TABLE_ID,
  DATABASE_ID,
  databases,
  HABITS_TABLE_ID,
} from "../../lib/appwrite";
import { useAuth } from "../../lib/auth-context";

export default function login() {
  const { signOut, user } = useAuth();
  const [completedHabits, setCompletedHabits] = useState<HabitCompletion[]>([]);
  const {
    habits,
    fetchHabits,
    handleDeleteHabit,
    handleComleteHabit,
    isHabitCompleted,
  } = useHabits(user?.$id ?? "");

  // FUNCION PARA OBTENER LOS HABITS COMPLETADOS HOY
  const fetchCompletedHabits = async () => {
    const response = await databases.listDocuments<HabitCompletion>(
      DATABASE_ID,
      COMPLETIONS_TABLE_ID,
      [Query.equal("user_id", user?.$id ?? "")]
    );

    const completions = response.documents;
    setCompletedHabits(completions);
  };

  useRealtimeHabits({
    user: user?.$id ? user : null,
    fetchHabits,
    fetchCompletedHabits,
    DATABASE_ID,
    HABITS_TABLE_ID,
    COMPLETIONS_TABLE_ID,
  });

  //Obtiene las fechas de completado del hábito y las ordena de forma cronológica (mas vieja a mas nueva)
  const getStreakData = (habitId: string) => {
    const habitsCompletions = completedHabits
      ?.filter((c) => c.habit_id === habitId)
      .sort(
        (a, b) =>
          new Date(a.completed_at).getTime() -
          new Date(b.completed_at).getTime()
      );
  };

  return (
    <View>
      <Text>Rachas de Habitos</Text>
    </View>
  );
}
