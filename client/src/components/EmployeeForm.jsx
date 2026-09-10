import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { DEPARTMENTS } from "../assets/assets"
import { Loader2Icon } from "lucide-react"
const EmployeeForm = ({initialData, onSuccess, onCancel}) => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const isEditMode = !!initialData
    const handleSubmit = async (e) => {
        e.preventDefault()
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl animate-fade-in">
            <div className="card p-5 sm:p-6">
                <h3 className="font-medium mb-6 pb-4 border-b border-slate-100">personal information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
                    <div>
                        <label className="block mb-2">first name</label>
                        <input name="firstName" required defaultValue={initialData?.firstName}></input>
                    </div>
                    <div>
                        <label className="block mb-2">last name</label>
                        <input name="lastName" required defaultValue={initialData?.lastName}></input>
                    </div>
                    <div>
                        <label className="block mb-2">phone number</label>
                        <input name="phone" required defaultValue={initialData?.phone}></input>
                    </div>
                    <div>
                        <label className="block mb-2">join date</label>
                        <input type="date" name="joinDate" required defaultValue={initialData?.joinDate ? new Date(initialData.joinDate).toISOString().split('T')[0]:''}></input>
                    </div>
                    <div className="sm:col-span-2">
                        <label className="block mb-2">bio (optional)</label>
                        <textarea name="bio" defaultValue={initialData?.bio} rows={3} className="resize-none"
                        placeholder="brief description"></textarea>
                    </div>
                </div>
            </div>
            <div className="card p-5 sm:p-6">
                <h3 className="text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100">employment details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
                    <div>
                        <label className="block mb-2">department</label>
                        <select name="department" defaultValue={initialData?.department || ''}>
                            <option value=''>select department</option>
                            {DEPARTMENTS.map((deptName)=>(
                            <option key={deptName} value={deptName}>{deptName}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block mb-2">position</label>
                        <input name="position" required defaultValue={initialData?.position}></input>
                    </div>
                    <div>
                        <label className="block mb-2">basic salary</label>
                        <input type="number" name="basicSalary" required defaultValue={initialData?.basicSalary ||0} min='0' step='0.01'></input>
                    </div>
                                        <div>
                        <label className="block mb-2">allowances</label>
                        <input name="allowances" min='0' step='0.01' required type="number" defaultValue={initialData?.allowances || 0}></input>
                    </div>
                                        <div>
                        <label className="block mb-2">deductions</label>
                        <input name="deductions" min='0' step='0.01' required type="number" defaultValue={initialData?.deductions || 0}></input>
                    </div>
                    {isEditMode && (<div>
                        <label className="block mb-2">status</label>
                        <select name="employmentStatus" defaultValue={initialData?.employmentStatus}>
                            <option value='ACTIVE'>active</option>
                            <option value='INACTIVE'>inactive</option>
                        </select>
                    </div>)}
                </div>
            </div>
                <div className="card p-5 sm:p-6">
                <h3 className="text-base font-medium text-slate-900 mb-6 pb-4 border-b border-slate-100">account setup</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-sm text-slate-700">
                    <div className="sm:col-span-2">
                        <label className="block mb-2">work email</label>
                        <input type="email" name='email' required defaultValue={initialData?.email}></input>
                    </div>
                    {!isEditMode && (
                        <div>
                        <label className="block mb-2">temporary password</label>
                        <input type="password" name='password' required ></input>
                    </div>
                    )}
                    {isEditMode && (
                        <div>
                        <label className="block mb-2">change password (optional)</label>
                        <input type="password" name='password' placeholder="leave blank or keep current" ></input>
                    </div>
                    )}

                    <div>
                        <label className="block mb-2">system role (optional)</label>
                        <select name="role" defaultValue={initialData?.user?.role || 'EMPLOYEE'}>
                            <option value='EMPLOYEE'>employee</option>
                            <option value='ADMIN'>admin</option>
                </select>
                    </div>
                </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-2">
<button type="button" className="btn-secondary" onClick={()=>(onCancel ? onCancel():navigate(-1))}>cancel</button>
                <button type="submit" className="btn-primary flex items-center justify-center" disabled={loading}>
                    {loading && <Loader2Icon className="w-4 h-4 mr-2 animate-spin"></Loader2Icon>}
                    {isEditMode ?'update employee':'create employee'}
                </button>
            </div>
    </form>
  )
}

export default EmployeeForm