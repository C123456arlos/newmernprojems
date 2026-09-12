import { CalendarDays, FileText, Loader2, Send, X } from "lucide-react"
import { useState } from "react"
import api from "../../api/axios"
import toast from "react-hot-toast"

const ApplyLeaveModal = ({ open, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false)
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(today.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())
    try {
      await api.post('/leave', data)
      onSuccess()
      onClose()
    } catch (error) {
      toast.error(error.response?.data?.error || error?.message)
    }
  }
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg animate-fade-in" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-6 pb-0">
          <div>
            <h2 className="text-lg font-semibold text-slate-800">apply for leave</h2>
            <p className="text-sm text-slate-400 mt-0.5">submit your leave request for approval</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5"></X>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <FileText className="h-4 w-4 text-slate-400"></FileText>
              leave type
            </label>
            <select name="type" required>
              <option value='SICK'>sick leave</option>
              <option value='CASUAL'>casual leave</option>
              <option value='ANNUAL'>annual leave</option>
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
              <CalendarDays className="h-4 w-4 text-slate-400"></CalendarDays>
              duration
            </label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="block text-xs text-slate-400 mb-1">from</span>
                <input type="date" name="startDate" required min={minDate}></input>
              </div>
              <div>
                <span className="block text-xs text-slate-400 mb-1">to</span>
                <input type="date" name="endDate" required min={minDate}></input>
              </div>
            </div>
          </div>
          <div>
                <label className="text-sm font-medium text-slate-700 mb-2 block">
              reason
            </label>
            <textarea name='reason' required rows={3} className="resize-none" placeholder="briefly describe why you need this leave"></textarea>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-secondary flex-1" onClick={onClose}>
              cancel
            </button>
            <button type="submit" className="btn-primary flex-1 flex items-center justify-center gap-2"
            disabled={loading} >
              {loading ? <Loader2 className="w-4 h-4 animate-spin"></Loader2> : <Send className="w-4 h-4"></Send>}
              {loading ? 'submitting':'submit'}
            </button>
          </div>
        </form>
    </div>
    </div>
  )
}

export default ApplyLeaveModal