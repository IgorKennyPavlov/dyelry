import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { StatusBar } from 'expo-status-bar'
import { StyleSheet, View } from 'react-native'
import SessionList from './src/pages/SessionList'
import About from './src/pages/About'
import { Router } from './src/pages/router'

// TODO PAVLOV router is strange. Is there something with better typing?
const Stack = createNativeStackNavigator()

const App = () => {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name={Router.SessionList}
            component={SessionList}
          />
          <Stack.Screen
            name={Router.About}
            component={About}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})

export default App
