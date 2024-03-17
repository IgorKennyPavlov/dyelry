import { Text } from 'react-native'
import { PageProps } from './types'
import BasicLayout from '../layouts/BasicLayout'

const About = ({ navigation }: PageProps) => {
  return (
    <BasicLayout navigation={navigation}>
      <Text>Version: 0</Text>
    </BasicLayout>
  )
}
export default About
