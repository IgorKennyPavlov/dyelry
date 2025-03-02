import { useSessionsStore, useTemplatesStore } from "../../store";
import { SESSIONS, TEMPLATES } from "../../store/keys";

export const useAllSessionData = () => {
  const { [SESSIONS]: sessions } = useSessionsStore();
  const { [TEMPLATES]: templates } = useTemplatesStore();
  return [...sessions, ...templates];
};
