import { FlatList, View, Button, StyleSheet, ListRenderItemInfo, StatusBar, Dimensions } from 'react-native'
import SessionListItem from '../components/SessionListItem'
import { useCallback } from 'react'
import { SessionProps } from './types'
import { mockSessionList } from '../mock'

const SessionList = () => {
  const renderItem = useCallback((props: ListRenderItemInfo<SessionProps>) => <SessionListItem {...props} />, [])

  return (
    <>
      <View id="btn-panel" style={styles.actionPanel}>
        <Button title="Some Action" />
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
