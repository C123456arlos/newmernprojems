import { Loader2, Plus, X } from 'lucide-react'
import React, { useState } from 'react'

const GeneratePayslipForm = ({employees, onSuccess}) => {
    const [isOpen, setIsOpen]=useState(false)
    const [loading, setLoading] = useState(false)
    if (!isOpen) return (
        <button onClick={()=>setIsOpen(true)} className='btn-primary flex items-center gap-2'>
            <Plus className='w-4 h-4 '></Plus> generate payslip
        </button>
    )
    const handleSubmit = async (e) => {
        e.preventDefault()

    }
  return (
      <div className='fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
          <div className='card max-w-lg w-full p-6 animate-slide-up'>
              <div className='flex justify-between items-center mb-6'>
                  <h3 className='text-lg font-bold text-slate-900'>generate monthly payslip</h3>
                  <button onClick={()=>setIsOpen(false)}
                      className='text-slate-400 hover:text-slate-600 p-1'>
                      <X size={20}></X>
                  </button>
              </div>
              <form onSubmit={handleSubmit} className='space-y-4'>
                  <div>
                      <label className='block text-sm font-medium text-slate-700 mb-2'>employee</label>
                      <select name='employeeId' required>
                          {employees.map((e) => (
                              <option value={e.id} key={e.id}>{e.firstName} {e.lastName} ({e.position})</option>
                          ))}
                      </select>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                      <div>
                          <label className='block text-sm font-medium text-slate-700 mb-2'>month</label>
                          <select name='month'>{Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                              <option value={m} key={m}>{m}</option>
                          ))}</select>
                      </div>
                      <div>
                          <label className='block text-sm font-medium text-slate-700 mb-2'>year</label>
                          <input type='number' name='year' defaultValue={new Date().getFullYear()}></input>
                      </div>
                  </div>
                      <div>
                          <label className='block text-sm font-medium text-slate-700 mb-2'>basic salary</label>
                          <input type='number' name='basicSalary' required placeholder='5000'></input>
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                      <div>
                          <label className='block text-sm font-medium text-slate-700 mb-2'>allowances</label>
                          <input type='number' name='allowances' defaultValue='0'></input>
                  </div>
                      <div>
                          <label className='block text-sm font-medium text-slate-700 mb-2'>deductions</label>
                          <input type='number' name='deductions' defaultValue='0'></input>
                  </div>
                  </div>
                  <div className='flex justify-end gap-3 pt-2'>
                      <button onClick={()=>setIsOpen(false)} type='button' className='btn-secondary'>
                          cancel 
                      </button>
                      <button type='submit' className='btn-primary flex items-center' disabled={loading}>
                         {loading && <Loader2 className='w-4 h-4 mr-2 animate-spin'></Loader2>}
                          generate
                      </button>
                  </div>
              </form>
          </div>
    </div>
  )
}

export default GeneratePayslipForm