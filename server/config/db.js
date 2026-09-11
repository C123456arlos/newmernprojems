// import mongoose from "mongoose"
// const connectDB = async () => {
//     try {
//         mongoose.connection.on('connected', () => console.log('database connected'))
//         await mongoose.connect(process.env.MONGODB_URI)
//     } catch (error) {
//         console.error('database connection failed', error.message)
//     }
// }
// export default connectDB

import mongoose from 'mongoose'
export const connectDB = async () => {
    try {
       const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`mongodb connected ${conn.connection.host}`)
    } catch (error) {
        console.log('mongodb connection error', error)
    }
}