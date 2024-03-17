import { Text, ListRenderItemInfo, StyleSheet, Pressable } from 'react-native'
import { SessionProps } from './types'

const Session = ({ item }: ListRenderItemInfo<SessionProps>) => {
  const onPress = () => {
    console.log(`Open ${item.id}`)
  }

  return (
    <Pressable style={styles.sessionPlaque} onPress={onPress}>
      <Text>{item.date}</Text>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  sessionPlaque: {
    height: 44,
    marginVertical: 8,
    paddingVertical: 4,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#ccc',
    borderRadius: 8,
  },
})

export default Session
