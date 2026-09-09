import { Toaster } from "react-hot-toast"
import { Navigate, Route, Routes } from "react-router-dom"
import LoginLanding from "./pages/LoginLanding"
import Layout from "./pages/Layout"
import Dashboard from "./pages/Dashboard"
import Employees from "./pages/Employees"
import Attendance from "./pages/Attendance"
import Leave from "./pages/Leave"
import Payslips from "./pages/Payslips"
import Settings from "./pages/Settings"
import PrintPayslips from "./pages/PrintPayslips"
import LoginForm from "./components/LoginForm"
const App = () => {
  return (
    <>
      <Toaster></Toaster>
      <Routes>
        <Route path='/login' element={<LoginLanding></LoginLanding>}></Route>
        <Route path='/login/admin' element={<LoginForm role='admin' title='admin portal' subtitle='sign in to manage the organization'></LoginForm>}></Route>
        <Route path='/login/employee' element={<LoginForm role='employee' title='employee portal' subtitle='sign in to access your account'></LoginForm>}></Route>
        <Route element={<Layout></Layout>}>
          <Route path="/dashboard" element={<Dashboard></Dashboard>}></Route>
          <Route path="/employees" element={<Employees></Employees>}></Route>
          <Route path="/attendance" element={<Attendance></Attendance>}></Route>
          <Route path="/leave" element={<Leave></Leave>}></Route>
          <Route path="/payslips" element={<Payslips></Payslips>}></Route>
          <Route path="/settings" element={<Settings></Settings>}></Route>
        </Route>
        <Route path="/print/payslips/:id" element={<PrintPayslips></PrintPayslips>}></Route>
        <Route path="*" element={<Navigate to={'/dashboard'} replace></Navigate>}></Route>
      </Routes>
    </>
  )
}

export default App