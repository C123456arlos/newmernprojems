import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { dummyPayslipData } from "../assets/assets"
import Loading from "../components/Loading"
import { format } from "date-fns"
import api from "../api/axios"

const PrintPayslips = () => {
  const { id } = useParams()
  const [payslip, setPayslip] = useState(null)
  const [loading, setLoading] = useState(true)
  console.log(payslip, 'payslip')
  useEffect(() => {
api.get(`/payslips/${id}`).then((res)=>setPayslip(res.data)).catch(console.error).finally(()=>setLoading(false))
  }, [id])
  if (loading) return <Loading></Loading>
  if(!payslip) return <p className="text-center py-12 text-slate-400">payslip not found</p>
  return (
    <div className="max-w-2xl mx-auto p-8 bg-white animate-fade-in">
      <div className="text-center border-b border-slate-200 pb-6 mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">payslip</h1>
        <p className="text-slate-500 text-sm mt-1">{format(new Date(payslip.year, payslip.month-1), 'MMMM yyyy')}</p>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-8">
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">employee name</p>
          <p className="font-semibold text-slate-900">{payslip.employee?.firstName} {payslip.employee?.lastName}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">position</p>
          <p className="font-semibold text-slate-900">{payslip.employee?.position}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">email</p>
          <p className="font-semibold text-slate-900">{payslip.employee?.email}</p>
        </div>
        <div>
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">period</p>
          <p className="font-semibold text-slate-900">{format(new Date(payslip.year, payslip.month-1), 'MMMM yyyy')}</p>
        </div>
      </div>
      <div className="rounded-xl border border-slate-200 overflow-hidden mb-8">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50">
              <th className="text-left py-3 px-4 text-xs text-slate-500 uppercase tracking-wider">description</th>
              <th className="text-right py-3 px-4 text-xs text-slate-500 uppercase tracking-wider">amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-slate-100">
              <td className="py-3 px-4 text-slate-700">basic salary</td>
              <td className="text-right py-3 px-4 text-slate-900 font-medium">${payslip.basicSalary?.toLocaleString()}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-3 px-4 text-slate-700">allowances</td>
              <td className="text-right py-3 px-4 text-slate-900 font-medium">+${payslip.allowances?.toLocaleString()}</td>
            </tr>
            <tr className="border-t border-slate-100">
              <td className="py-3 px-4 text-slate-700">deductions</td>
              <td className="text-right py-3 px-4 text-slate-900 font-medium">-${payslip.deductions?.toLocaleString()}</td>
            </tr>
            <tr className="border-t-2 border-slate-200 bg-slate-50">
              <td className="py-4 px-4 font-bold text-slate-900">net salary</td>
              <td className="text-right py-4 px-4 font-bold text-slate-900 text-lg">${payslip.netSalary?.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="text-center">
        <button className="btn-primary print:hidden" onClick={()=>window.print()}>print payslip</button>
      </div>
    </div>
  )
}

export default PrintPayslips