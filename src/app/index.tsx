import { FlatList, View, Button, StyleSheet, ListRenderItemInfo } from 'react-native'
import SessionListItem from '../components/SessionListItem'
import { useCallback } from 'react'
import { SessionProps } from './types'
import { mockSessionList } from '../mock'
import { useRouter } from 'expo-router'

const SessionList = () => {
  const router = useRouter()
  const renderItem = useCallback((props: ListRenderItemInfo<SessionProps>) => <SessionListItem {...props} />, [])
  const onNewSessionClick = useCallback(() => router.push(`/session/new-session`), [])

  return (
    <>
      <View id="btn-panel" style={styles.actionPanel}>
        <Button title="new session" onPress={onNewSessionClick} />
        <Button title="Another Action" />
      </View>
      <FlatList data={mockSessionList} renderItem={renderItem} />
    </>
  )
}

const styles = StyleSheet.create({
  actionPanel: {
    marginVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
})

export default SessionList
