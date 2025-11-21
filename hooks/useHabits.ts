import { Habit, HabitCompletion } from "@/types/database.type";
import { useState } from "react";
import { ID, Query } from "react-native-appwrite";
import {
  COMPLETIONS_TABLE_ID,
  DATABASE_ID,
  HABITS_TABLE_ID,
  databases,
} from "../lib/appwrite";

export function useHabits(userId: string) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);

  //FUNCION PARA OBTENER LOS HABITS DE LA BASE DE DATOS
  const fetchHabits = async () => {
    const response = await databases.listDocuments<Habit>(
      DATABASE_ID,
      HABITS_TABLE_ID,
      [Query.equal("user_id", userId ?? "")]
    );
    setHabits(response.documents);
  };

  // FUNCION PARA OBTENER LOS HABITS COMPLETADOS HOY
  const fetchCompletedHabits = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // establecer al inicio del día
    const response = await databases.listDocuments<HabitCompletion>(
      DATABASE_ID,
      COMPLETIONS_TABLE_ID,
      [
        Query.equal("user_id", userId ?? ""),
        Query.greaterThan("completed_at", today.toISOString()),
      ]
    );

    const completions = response.documents;
    setCompletedHabits(completions.map((completion) => completion.habit_id));
  };

  //FUNCION PARA ELIMINAR UN HABIT
  const handleDeleteHabit = async (habitId: string) => {
    // eliminar habit de la interfaz de usuario inmediatamente
    setHabits((prevHabits) =>
      prevHabits.filter((habit) => habit.$id !== habitId)
    );
    // eliminar habit de la base de datos
    try {
      await databases.deleteDocument(DATABASE_ID, HABITS_TABLE_ID, habitId);
    } catch (error) {
      console.error("Error al eliminar el hábito:", error);
    }
  };

  // FUNCION PARA COMPLETAR UN HABIT
  const handleComleteHabit = async (habitId: string) => {
    const currentDate = new Date().toISOString();
    if (!userId || completedHabits.includes(habitId)) return;
    try {
      await databases.createDocument(
        DATABASE_ID,
        COMPLETIONS_TABLE_ID,
        ID.unique(),
        {
          habit_id: habitId,
          user_id: userId ?? "",
          completed_at: currentDate,
        }
      );
    } catch (error) {
      console.error("Error al completar el hábito:", error);
    }

    const habit = habits.find((h) => h.$id === habitId);
    if (!habit) return;

    await databases.updateDocument(DATABASE_ID, HABITS_TABLE_ID, habitId, {
      streak_count: habit.streak_count + 1,
      last_completed: currentDate,
    });
  };

  const isHabitCompleted = (habitId: string) => {
    return completedHabits.includes(habitId);
  };

  return {
    habits,
    completedHabits,
    fetchHabits,
    fetchCompletedHabits,
    handleDeleteHabit,
    handleComleteHabit,
    isHabitCompleted,
  };
}
