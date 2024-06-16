// clear all history and navigate to target route
import { useRouter, Href } from "expo-router";

export const useNavigate = () => {
  const router = useRouter();

  const navigate = (route: Href<string>) => {
    while (router.canGoBack()) {
      router.back();
    }
    router.push(route);
  };

  return { navigate };
};
