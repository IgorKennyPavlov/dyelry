import { View, Button, StyleSheet, StatusBar } from 'react-native'

const BasicLayout = ({ children }) => {
  return (
    <View id="basic-layout" style={styles.basicLayout}>
      <View id="btn-panel" style={styles.btnPanel}>
        <Button title="Some Action" />
        <Button title="Another Action" />
      </View>
      <View id="outlet">
        {children}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  basicLayout: {
    paddingTop: StatusBar.currentHeight || 0,
    paddingHorizontal: '1%',
    width: '98%',
  },
  btnPanel: {
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

export default BasicLayout
