import { StatusBar } from "expo-status-bar";
import { StyleSheet, View } from "react-native";
import { mockSessionList } from "./mock";
import BasicLayout from "./src/layouts/BasicLayout";
import SessionList from "./src/pages/SessionList";

const App = () => (
  <View style={styles.container}>
    <BasicLayout>
      <SessionList sessions={mockSessionList} />
    </BasicLayout>
    <StatusBar style="auto" />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

export default App;
