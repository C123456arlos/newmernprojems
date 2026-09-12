import { useEffect, useState } from "react"
import { dummyProfileData } from "../assets/assets"
import Loading from "../components/Loading"
import { Lock } from "lucide-react"
import ProfileForm from "../components/ProfileForm"
import ChangePasswordModal from "../components/ChangePasswordModal"
import { useAuth } from "../context/AuthContext"
import api from "../api/axios"
import toast from "react-hot-toast"
const Settings = () => {
  const {user}= useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile')
      const profile = res.data
      if(profile) setProfile(profile)
    } catch (error) {
      toast.error(error?.response?.data?.error || error.message)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    fetchProfile()
  }, [user])
  if(loading) return <Loading></Loading>
  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1 className="page-title">settings</h1>
        <p className="page-subtitle">manage your account and preferences</p>
      </div>
      {profile && <ProfileForm initialData={profile} onSuccess={fetchProfile}></ProfileForm>}
      <div className="card max-w-md p-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-slate-100 rounded-lg">
            <Lock className="w-5 h-5 text-slate-600"></Lock>
          </div>
          <div>
            <p className="font-medium text-slate-900">password</p>
            <p className="text-sm text-slate-500">update your account password</p>
          </div>
        </div>
        <button className="btn-secondary text-sm" onClick={()=>setShowPasswordModal(true)}>change</button>
      </div>
      <ChangePasswordModal open={showPasswordModal} onClose={()=>setShowPasswordModal(false)}></ChangePasswordModal>
    </div>
  )
}

export default Settings