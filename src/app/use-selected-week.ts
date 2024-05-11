import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useCallback, useMemo } from "react";
import { useForm } from "react-hook-form";

import { getWeek, SESSIONS } from "../global";
import { usePersistentStore } from "../store";

interface DisplayedWeekForm {
  selectedWeek: Date;
}

export const useSelectedWeek = () => {
  const { [SESSIONS]: sessions } = usePersistentStore();

  const getLastMonday = useCallback((date: Date) => {
    const monday = new Date(date);
    monday.setUTCDate(date.getDate() - ((date.getDay() + 6) % 7));
    monday.setUTCHours(0, 0, 0, 0);
    return monday;
  }, []);

  const form = useForm<DisplayedWeekForm>({
    defaultValues: { selectedWeek: getLastMonday(new Date()) },
  });

  const { getValues, setValue, watch } = form;

  const selectDate = useCallback(
    (_: DateTimePickerEvent, date?: Date) =>
      date && setValue("selectedWeek", getLastMonday(date)),
    [getLastMonday, setValue],
  );

  const monday = watch("selectedWeek");

  const week = useMemo(() => getWeek(sessions, monday), [monday, sessions]);
  const shiftWeek = useCallback(
    (direction: number) => {
      const curMonday = getValues().selectedWeek;
      const copy = new Date(curMonday);
      copy.setDate(copy.getDate() + 7 * direction);
      setValue("selectedWeek", getLastMonday(copy));
    },
    [getLastMonday, getValues, setValue],
  );

  return { week, shiftWeek, selectDate, form };
};
