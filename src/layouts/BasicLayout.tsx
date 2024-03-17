import { View, StyleSheet, StatusBar, Pressable, Text, Dimensions } from 'react-native'
import { Router } from '../pages/router'

const BasicLayout = ({ navigation, children }) => {
  const navigate = (route: Router) => navigation.navigate(route)

  return (
    <View id="basic-layout" style={styles.basicLayout}>
      <View id="outlet">
        {children}
      </View>
      <View style={styles.navPanel}>
        <Pressable style={styles.navPanelBtn} onPress={() => navigate(Router.SessionList)}>
          <Text>Session List</Text>
        </Pressable>
        <Pressable style={styles.navPanelBtn} onPress={() => navigate(Router.About)}>
          <Text>About</Text>
        </Pressable>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  basicLayout: {
    paddingTop: StatusBar.currentHeight || 0,
    paddingLeft: '1%',
    paddingBottom: 60,
    width: '99%',
  },
  navPanel: {
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: Dimensions.get('window').height - 140, // TODO PAVLOV is there a better way to stick to bottom?
    left: '1%',
  },
  navPanelBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
    flexDirection: 'row',
    flex: 1,
    height: 44,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ddd',
  },
})

export default BasicLayout
