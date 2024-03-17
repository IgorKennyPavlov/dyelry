import { Text, ListRenderItemInfo } from 'react-native'
import { SessionProps } from './types'

const Session = ({ item }: ListRenderItemInfo<SessionProps>) => {
  return <Text>{item.date}</Text>
}

export default Session
