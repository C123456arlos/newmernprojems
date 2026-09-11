export const getLeaves =async (req, res) => {
    try {
        const session = req.session
        const isAdmin = session.role === 'ADMIN'
        if (isAdmin) {
            const status = req.query.status
            const where = status ? { status } : {}
            const leaves = await LeaveApplication.find(where).populate('employeeId').sort({ createdAt: -1 })
            const data = leaves.map((l) => {
                const obj = l.toObject()
                return {
                    ...obj, 
                    id: obj._id.toString(),
                    employee: obj.employeeId,
                    employeeId:obj.employeeId?._id?.toString()
                }
            })
            return res.json({data})
        } else {
            const employee = await Employee.findOne({
                userId:session.userId
            }).lean()
            if (!employee) return res.status(404).json({ error: 'not found' })
            const leaves = await LeaveApplication.find({
                employeeId: employee._id
            }).sort({ createdAt: -1 })
            return res.json({
                data: leaves,
                employee:{...employee, id:employee._id.toString()}
            })
        }
    } catch (error) {
        return res.status(500).json({error:'failed'})
    }
}
export const updateLeaveStatus = async (req, res) => {
    try {
        const { status } = req.body
        if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
        return res.status(400).json({error:'invalid status'})
        }    
        const leave = await LeaveApplication.findByIdAndUpdate(req.params.id, { status }, { returnDocument: 'after' })
        return res.json({success:true, data:leave})
    } catch (error) {
    return res.status(500).json({error:'failed'})       
    }
}