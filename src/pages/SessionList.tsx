import { FlatList } from 'react-native'
import Session from './Session'
import { SessionListProps } from './types'

const SessionList = ({ sessions }: SessionListProps) => {
  return <FlatList data={sessions} renderItem={Session} />
}

export default SessionList
