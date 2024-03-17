import { RouteProp } from '@react-navigation/core/lib/typescript/src/types'

export interface PageProps {
  route: RouteProp<any, any>;
  navigation: any;
}

export interface SessionProps {
  id: string
  date: string
}
