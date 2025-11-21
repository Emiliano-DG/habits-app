import { useEffect } from "react";
import { Models } from "react-native-appwrite";
import { client, RealTimeResponse } from "../lib/appwrite";

interface UseRealtimeHabitsParams {
  user: Models.User<Models.Preferences> | null;
  fetchHabits: () => void;
  fetchCompletedHabits: () => void;
  DATABASE_ID: string;
  HABITS_TABLE_ID: string;
  COMPLETIONS_TABLE_ID: string;
}

export function useRealtimeHabits({
  user,
  fetchHabits,
  fetchCompletedHabits,
  DATABASE_ID,
  HABITS_TABLE_ID,
  COMPLETIONS_TABLE_ID,
}: UseRealtimeHabitsParams) {
  useEffect(() => {
    if (!user) return;

    const subscription = client.subscribe(
      [
        `databases.${DATABASE_ID}.collections.${HABITS_TABLE_ID}.documents`,
        `databases.${DATABASE_ID}.collections.${COMPLETIONS_TABLE_ID}.documents`,
      ],
      (response: RealTimeResponse) => {
        const event = response.events[0];
        //si cambio habitos (se creo, actualizo o elimino un habito)
        if (event.includes(HABITS_TABLE_ID)) {
          fetchHabits();
        }
        // si se ccompleto un habito (create)
        if (event.includes(COMPLETIONS_TABLE_ID)) {
          fetchCompletedHabits();
        }
      }
    );

    fetchHabits();
    fetchCompletedHabits();

    return () => {
      subscription();
    };
  }, [user]);
}
