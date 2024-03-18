import { Tabs } from 'expo-router'

const BasicLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#1c357f',
        },
        headerTintColor: '#fff',
      }}>
      <Tabs.Screen name="index" options={{ title: 'Session List' }} />
      <Tabs.Screen name="session/[id]" options={{ href: null }} />
      <Tabs.Screen name="about" options={{ title: 'About' }} />
    </Tabs>
  )
}

export default BasicLayout
