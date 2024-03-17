import { FlatList, View, Button, StyleSheet, ListRenderItemInfo } from 'react-native'
import SessionListItem from './SessionListItem'
import { PageProps, SessionProps } from './types'
import BasicLayout from '../layouts/BasicLayout'
import { mockSessionList } from '../../mock'
import { useCallback } from 'react'

const SessionList = ({ navigation }: PageProps) => {
  const renderItem = useCallback((props: ListRenderItemInfo<SessionProps>) => <SessionListItem {...props} />, [])

  return (
    <BasicLayout navigation={navigation}>
      <View id="btn-panel" style={styles.actionPanel}>
        <Button title="Some Action" />
        <Button title="Another Action" />
      </View>
      <FlatList data={mockSessionList} renderItem={renderItem} />
    </BasicLayout>
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
