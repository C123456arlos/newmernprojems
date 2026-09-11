import Employee from "../models/Employee.js"
import bcrypt from 'bcrypt'
import User from "../models/User.js"
export const getEmployees = async (req, res) => {
    try {
        const { department } = req.query
        const where = {}
        if (department) where.department = department
        const employees = await Employee.find(where).sort({ createdAt: -1 }).populate('userId', 'email role').lean()
        const result = employees.map((emp) => ({
            ...emp, id: emp._id.toString(), user: emp.userId ? { email: emp.userId.email, role: emp.userId.role } : null
        }))
        return res.json(result)
    } catch (error) {
        return res.status(500).json({ error: 'failed to fetch employee' })
    }
}
export const createEmployee = async (req, res) => {
    try {
        const { firstName, lastName, email, phone, position, department, basicSalary, allowances, deductions, joinDate, password, role, bio } = req.body
        if (!email || !password || !firstName || !lastName) {
            return res.status(400).json({error:'missing required fields'})
        }
        const hashed = await bcrypt.hash(password, 10)
        const user = await User.create({ email, password: hashed, role: role || 'EMPLOYEE' })
        const employee = await Employee.create({
            userId: user._id, 
            firstName, lastName, email, phone, position, department: department || 'Engineering',
            basicSalary:Number(basicSalary) ||0,
            allowances:Number(allowances) ||0,
            deductions: Number(deductions) || 0,
            joinDate: new Date(joinDate),
            bio:bio ||''
        })
        return res.status(201).json({success:true, employee})
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({error:'email already exists'})
        }
        console.error('create employee error', error)
        return res.status(500).json({error:'failed to create employee'})
    }
}
export const updateEmployee = async (req, res) => {
    try {
          const {id}= req.params
        const { firstName, lastName, email, phone, position, department, basicSalary, allowances, deductions, password, role, bio, employmentStatus } = req.body
        const employee = await Employee.findById(id)
        if (!employee) return res.status(404).json({ error: 'employee not found' })
        await Employee.findByIdAndUpdate(id, {
            firstName, lastName, email, phone, position, department: department || 'Engineering',
            basicSalary:Number(basicSalary) ||0,
            allowances:Number(allowances) ||0,
            deductions: Number(deductions) || 0,
            employmentStatus:employmentStatus || 'ACTIVE',
            bio:bio ||''
        })
        const userUpdate = { email }
        if (role) userUpdate.role = role
        if (password) userUpdate.password = await bcrypt.hash(password, 10)
        await User.findByIdAndUpdate(employee.userId, userUpdate)
        return res.json({success:true})
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({error:'email already exists'})
        }
        return res.status(500).json({error:'failed to update employee'})
    }
}
export const deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params
        const employee = await Employee.findById(id)
        if (!employee) return res.status(404).json({ error: 'employee not found' })
        employee.isDeleted = true
        employee.employmentStatus = 'INACTIVE'
        await employee.save()
        return res.json({success:true})
    } catch (error) {
        return res.status(500).json({error:'failed to delete employee'})
    }   
}





import { inngest } from "../inngest/index.js"
import Employee from "../models/Employee.js"
import LeaveApplication from "../models/LeaveApplication.js"

export const createLeave = async(req, res) => {
    try {
        const session = req.session
        const employee = await Employee.findOne({ userId: session.userId })
        if (!employee) return res.status(404).json({ error: 'employee not found' })
        if (employee.isDeleted) {
            return res.status(403).json({error:'your account is deactivated you cannot apply for leave'})
        }
        const { type, startDate, endDate, reason } = req.body
        if (!type || !startDate || !endDate || !reason) {
            return res.status(400).json({error:'missing fields'})
        }
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        if (new Date(startDate) <= today || new Date(endDate) <= today) {
            return res.status(200).json({error:'leave dates must be in the future'})
        }
        if (new Date(endDate) < new Date(startDate)) {
            return res.status(400).json({ error:'end date cannot be before start date'})
        }
        const leave = await LeaveApplication.create({
            employeeId: employee._id,
            type,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            reason,
            status: 'PENDING'
        })
        await inngest.send({
            name: 'leave/pending',
            data: {
                leaveApplicationId:leave._id
            }
        })
        return res.json({success:true, data:leave})
    } catch (error) {
        return res.status(500).json({error:'failed'})
    }
}
// export const getLeaves =async (req, res) => {
//     try {
//         const session = req.session
//         const isAdmin = session.role === 'ADMIN'
//         if (isAdmin) {
//             const status = req.query.status
//             const where = status ? { status } : {}
//             const leaves = await LeaveApplication.find(where).populate('employeeId').sort({ createdAt: -1 })
//             const data = leaves.map((l) => {
//                 const obj = l.toObject()
//                 return {
//                     ...obj, 
//                     id: obj._id.toString(),
//                     employee: obj.employeeId,
//                     employeeId:obj.employeeId?._id?.toString()
//                 }
//             })
//             return res.json({data})
//         } else {
//             const employee = await Employee.findOne({
//                 userId:session.userId
//             }).lean()
//             if (!employee) return res.status(404).json({ error: 'not found' })
//             const leaves = await LeaveApplication.find({
//                 employeeId: employee._id
//             }).sort({ createdAt: -1 })
//             return res.json({
//                 data: leaves,
//                 employee:{...employee, id:employee._id.toString()}
//             })
//         }
//     } catch (error) {
//         return res.status(500).json({error:'failed'})
//     }
// }
// export const updateLeaveStatus = async (req, res) => {
//     try {
//         const { status } = req.body
//         if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
//         return res.status(400).json({error:'invalid status'})
//         }    
//         const leave = await LeaveApplication.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' })
//         return res.json({success:true, data:leave})
//     } catch (error) {
//     return res.status(500).json({error:'failed'})       
//     }
// }