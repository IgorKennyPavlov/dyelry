import { Text, ListRenderItemInfo, StyleSheet, Pressable } from 'react-native'
import { SessionProps } from './types'
import { useNavigation } from '@react-navigation/native'
import { Router } from './router'

const SessionListItem = ({ item }: ListRenderItemInfo<SessionProps>) => {
  const { navigate } = useNavigation()

  const openSession = () => {
    // TODO PAVLOV for fuck's sake, how to type this!?
    // @ts-ignore
    navigate(Router.Session, { item })
  }

  return (
    <Pressable style={styles.sessionPlaque} onPress={openSession}>
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

export default SessionListItem
