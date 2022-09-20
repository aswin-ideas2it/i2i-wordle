import { startOfToday, startOfYesterday } from 'date-fns'

export const getToday = () => startOfToday()
export const getYesterday = () => startOfYesterday()

export const getISTDate = (dateUTC: number) => {
  const dateIST = new Date(dateUTC)
  dateIST.setHours(dateIST.getHours() - 5)
  dateIST.setMinutes(dateIST.getMinutes() - 30)
  return dateIST
}
