import { PageProps, SessionProps } from './types'
import { Text, View } from 'react-native'

const Session = ({ route }: PageProps) => {
  const { id, date } = route.params.item as SessionProps

  return (
    <View>
      <Text>Session #{id}</Text>
      <Text>{date}</Text>
    </View>
  )
}

export default Session
