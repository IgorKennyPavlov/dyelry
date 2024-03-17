import { FlatList, View } from 'react-native'
import Session from './Session'
import { SessionListProps } from './types'

const SessionList = ({ sessions }: SessionListProps) => {
  return (
    <View>
      <FlatList data={sessions} renderItem={Session} />
    </View>
  )
}

export default SessionList
