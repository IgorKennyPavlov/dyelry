import { FlatList, View, Button, StyleSheet } from 'react-native'
import Session from './Session'
import { PageProps } from './types'
import BasicLayout from '../layouts/BasicLayout'
import { mockSessionList } from '../../mock'

const SessionList = ({ navigation }: PageProps) => {
  return (
    <BasicLayout navigation={navigation}>
      <View id="btn-panel" style={styles.actionPanel}>
        <Button title="Some Action" />
        <Button title="Another Action" />
      </View>
      <FlatList data={mockSessionList} renderItem={Session} />
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
