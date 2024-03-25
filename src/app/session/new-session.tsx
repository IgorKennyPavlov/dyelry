import { Text, Button, Pressable, View, StyleSheet } from 'react-native'
import { useCallback, useState } from 'react'
import RNDateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker'

const NewSession = () => {
  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)

// TODO add eslint-plugin-react-hooks for exhaustive deps
  const selectDate = useCallback((_: DateTimePickerEvent, date: Date) => {
    setDate(date)
    setShowDatePicker(false)
  }, [date])

  const createNewSession = useCallback(() => {
    console.log(date.toLocaleDateString('ru-RU'))
  }, [date])

  return (
    <>
      <Pressable style={styles.selectedDate} onPress={() => setShowDatePicker(true)}>
        <Text>{date.toLocaleDateString('ru-RU')}</Text>
      </Pressable>
      {showDatePicker && <RNDateTimePicker value={date} locale="ru-RU" onChange={selectDate} />}
      <View style={styles.confirmBtn}>
        <Button title="Create session" onPress={createNewSession} />
      </View>
    </>
  )
}

const styles = StyleSheet.create({
  selectedDate: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  confirmBtn: { position: 'absolute', bottom: 0, left: 0, right: 0 },
})

export default NewSession
