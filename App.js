import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { mockSessionList } from "./mock";
import SessionList from "./src/pages/SessionList";

const App = () => (
  <View style={styles.container}>
    <SessionList sessions={mockSessionList} />
    <StatusBar style="auto" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});

export default App;
