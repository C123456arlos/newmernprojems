import { format } from "date-fns"
import { CheckIcon, Loader2, X } from "lucide-react"
import { useState } from "react"
import api from "../../api/axios"

const LeaveHistory = ({ leaves, isAdmin, onUpdate }) => {
    const [processing, setProcessing] = useState(null)
    const handleStatusUpdate = async (id, status) => {
        setProcessing(id)
        try {
            await api.patch(`/leave/${id}`, { status })
            onUpdate()
        } catch (error) {
            toast.error(error?.response?.data?.error || error?.message)
        } finally {
            setProcessing(null)
        }
    }
  return (
 <div className="card overflow-hidden">
          <div className="overflow-x-auto">
              <table className="table-modern">
                  <thead>
                      <tr>
                          {isAdmin && <th>employee</th>}
                          <th>type</th>
                          <th>dates</th>
                          <th>reason</th>
                          <th>status</th>
                          {isAdmin && <th className="text-center">actions</th>}
                      </tr>
                  </thead>
                  <tbody>
                      {leaves.length === 0 ? (
                          <tr>
                              <td colSpan={isAdmin ?6 :4} className="text-center py-12 text-slate-400">
                                  no leave applications found
                              </td>
                          </tr>
                      ) : (leaves.map((leave) => {
                          return (
                              <tr key={leave._id || leave.id}>
                                  {isAdmin && (
                                  <td className="text-slate-900">
                                      {leave.employee?.firstName} {leave.employee?.lastName}
                                  </td>
                                  )}
                                  <td>
                                      <span className="badge bg-slate-100 text-slate-600">{leave.type}</span>
                                  </td>
                                  <td className="text-xs text-slate-500">
                                      {format(new Date(leave.startDate), 'MMM dd')} - {format(new Date(leave.endDate), 'MMM dd, yyyy')}
                                  </td>
                                  <td className="max-w-xs truncate text-slate-500">
                                      {leave.reason}
                                  </td>
                                  <td>
                                      <span className={`badge ${leave.status==='APPROVED'?'badge-success':leave.status==='REJECTED'?'badge-danger':'badge-warning'}`}>
                                          {leave.status}
                                     </span> 
                                  </td>
                                  {isAdmin && (
                                  <td>
                                          {leave.status === 'PENDING' && (
                                              <div className="flex justify-center gap-2">
                                                  <button onClick={()=>handleStatusUpdate(leave._id || leave.id, 'APPROVED')} disabled={!!processing} className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-colors">
                                                      {
                                                          processing === (leave._id || leave.id) ? <Loader2 className="w-4 h-4 animate-spin"></Loader2> :<CheckIcon className="w-4 h-4"></CheckIcon>
                                                      }
                                                  </button>
                                                  <button onClick={()=>handleStatusUpdate(leave._id || leave.id, 'REJECTED')} disabled={!!processing}
                                                       className="p-1.5 rounded-md bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors">
                                                      {
                                                          processing === (leave._id || leave.id) ? <Loader2 className="w-4 h-4 animate-spin"></Loader2> :<X className="w-4 h-4"></X>
                                                      }
                                                  </button>
                                              </div>
                                     )} 
                                  </td>   
                                  )}
                              </tr>
                          )
                      }))}
                  </tbody>
              </table>
          </div>
    </div>
  )
}

export default LeaveHistory