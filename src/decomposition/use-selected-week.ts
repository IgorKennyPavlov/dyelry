import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";

import { SESSIONS, getSessionInterval } from "../global";
import { usePersistentStore } from "../store";

interface DisplayedWeekForm {
  targetDate: Date;
}

export const useSelectedWeek = () => {
  const { [SESSIONS]: sessions } = usePersistentStore();

  const getLastMonday = useCallback((date: Date) => {
    const monday = new Date(date);
    monday.setDate(date.getDate() - ((date.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);
    return monday;
  }, []);

  const getWeek = useCallback(
    (targetDate: Date) => {
      const monday = getLastMonday(targetDate);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);
      sunday.setHours(23, 59, 59, 999);
      const week = sessions.filter((s) => {
        const [start] = getSessionInterval(s);
        return !start || (start > monday && start < sunday);
      });
      return { monday, sunday, weekSessions: week };
    },
    [getLastMonday, sessions],
  );

  const form = useForm<DisplayedWeekForm>({
    defaultValues: { targetDate: getLastMonday(new Date()) },
  });
  const { getValues, setValue, watch, control } = form;

  const selectDate = useCallback(
    (_: DateTimePickerEvent, date?: Date) =>
      date && setValue("targetDate", date),
    [setValue],
  );

  const targetDate = watch("targetDate");
  const week = useMemo(() => getWeek(targetDate), [getWeek, targetDate]);

  const shiftWeek = useCallback(
    (direction: number) => {
      const lastMonday = getLastMonday(getValues().targetDate);
      lastMonday.setDate(lastMonday.getDate() + 7 * direction);
      setValue("targetDate", lastMonday);
    },
    [getLastMonday, getValues, setValue],
  );

  return { week, shiftWeek, selectDate, control };
};
