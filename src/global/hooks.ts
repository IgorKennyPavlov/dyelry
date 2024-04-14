import { useRouter, Href } from "expo-router";

// clear all history and navigate to target route
export const useNavigate = () => {
  const router = useRouter();

  const navigate = (route: Href<string>) => {
    while (router.canGoBack()) {
      router.back();
    }
    router.replace(route);
  };

  return { navigate };
};
