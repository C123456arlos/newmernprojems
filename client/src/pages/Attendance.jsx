import { useCallback, useEffect, useState } from "react"
import { dummyAttendanceData } from "../assets/assets"
import Loading from "../components/Loading"
import CheckInButton from "../components/attendance/CheckInButton"
import AttendanceStats from "../components/attendance/AttendanceStats"
import AttendanceHistory from "../components/attendance/AttendanceHistory"
import api from "../api/axios"
import toast from "react-hot-toast"

const Attendance = () => {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDeleted, setIsDeleted] = useState(false)
  const fetchData = useCallback(async () => {
try {
  const res = await api.get('/attendance')
  const json = res.data
  setHistory(json.data || [])
  if(json?.employee?.isDeleted) setIsDeleted(true)
} catch (error) {
  toast.error(error?.response?.data?.error || error?.message)
} finally {
  setLoading(false)
}
  }, [])
  useEffect(() => {
    fetchData()
  }, [fetchData])
  if (loading) return <Loading></Loading>
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayRecord= history.find((r)=>new Date(r.date).toDateString()===today.toDateString())
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">attendance</h1>
        <p className="page-subtitle">track your daily work hours and daily check-ins</p>
      </div>
      {isDeleted ? (<div className="mb-8 p-6 bg-rose-50 border border-rose-200 rouned-2xl text-center">
        <p className="text-rose-600">you can no longer clock in or out because your employee records have been marked as deleted</p>
      </div>)
        : (<div className="mb-8">
          <CheckInButton todayRecord={todayRecord} onAction={fetchData}></CheckInButton>
        </div>)}
      <AttendanceStats history={history}></AttendanceStats>
      <AttendanceHistory history={history}></AttendanceHistory>
    </div>
  )
}

export default Attendance