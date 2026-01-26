import { useState } from 'react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useAppSelector } from '@/hooks/useRedux';
import { authApi } from '@/api/auth.api';
import { toast } from 'sonner';

function LoginDetailsCard() {
  const { name, email } = useAppSelector((state) => state.auth);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }
    try {
      setLoading(true);
      const res = await authApi.changePassword(currentPassword, newPassword);
      if (res.success) {
        toast.success('Password updated successfully');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error(res.message || 'Failed to update password');
      }
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to update password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border border-[#d6ddeb] p-6">
      <h3 className="font-['Epilogue',sans-serif] font-semibold text-[16px] text-[#25324b] mb-5">
        Login Details
      </h3>
      <div className="space-y-5">
        <div>
          <Label className="font-['Epilogue',sans-serif] font-semibold text-[13px] text-[#515b6f]">Name</Label>
          <p className="mt-1 font-['Epilogue',sans-serif] text-[14px] text-[#25324b]">{name || '-'}</p>
        </div>
        <div>
          <Label className="font-['Epilogue',sans-serif] font-semibold text-[13px] text-[#515b6f]">Email</Label>
          <p className="mt-1 font-['Epilogue',sans-serif] text-[14px] text-[#25324b]">{email || '-'}</p>
        </div>
        <div className="h-px bg-[#d6ddeb]" />
        <div>
          <Label className="font-['Epilogue',sans-serif] font-semibold text-[13px] text-[#515b6f]">Current Password</Label>
          <Input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="mt-2 border-[#d6ddeb] h-9"
          />
        </div>
        <div>
          <Label className="font-['Epilogue',sans-serif] font-semibold text-[13px] text-[#515b6f]">New Password</Label>
          <Input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="mt-2 border-[#d6ddeb] h-9"
          />
        </div>
        <div>
          <Label className="font-['Epilogue',sans-serif] font-semibold text-[13px] text-[#515b6f]">Confirm Password</Label>
          <Input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-2 border-[#d6ddeb] h-9"
          />
        </div>
        <Button
          onClick={handleUpdatePassword}
          disabled={loading || !currentPassword || !newPassword || !confirmPassword}
          className="bg-[#4640de] hover:bg-[#3730cd] text-white px-5 py-2 rounded-lg font-['Epilogue',sans-serif] font-bold text-[13px]"
        >
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </div>
    </Card>
  );
}

function SeekerSettings() {
  return (
    <div className="bg-white">
      <Tabs defaultValue="login" className="w-full">
        <div className="border-b border-[#d6ddeb] px-6 pt-6">
          <TabsList className="bg-transparent border-0 h-auto p-0">
            <TabsTrigger
              value="login"
              className="data-[state=active]:border-b-[3px] data-[state=active]:border-[#4640de] data-[state=active]:text-[#25324b] text-[#7c8493] rounded-none px-0 pb-2 mr-8 font-['Epilogue',sans-serif] font-semibold text-[13px]"
            >
              Login Details
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:border-b-[3px] data-[state=active]:border-[#4640de] data-[state=active]:text-[#25324b] text-[#7c8493] rounded-none px-0 pb-2 font-['Epilogue',sans-serif] font-semibold text-[13px]"
            >
              Notifications
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="login" className="mt-0 p-6">
          <LoginDetailsCard />
        </TabsContent>

        <TabsContent value="notifications" className="mt-0 p-6">
          <Card className="border border-[#d6ddeb] p-6">
            <h3 className="font-['Epilogue',sans-serif] font-semibold text-[16px] text-[#25324b] mb-5">
              Notification Preferences
            </h3>
            <p className="font-['Epilogue',sans-serif] text-[13px] text-[#515b6f]">
              Manage your notification settings here.
            </p>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default SeekerSettings;