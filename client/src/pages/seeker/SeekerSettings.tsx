import { Upload } from 'lucide-react';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

function SeekerSettings() {
  return (
    <div className="bg-white">
      <Tabs defaultValue="profile" className="w-full">
        <div className="border-b border-[#d6ddeb] px-6 pt-6">
          <TabsList className="bg-transparent border-0 h-auto p-0">
            <TabsTrigger
              value="profile"
              className="data-[state=active]:border-b-[3px] data-[state=active]:border-[#4640de] data-[state=active]:text-[#25324b] text-[#7c8493] rounded-none px-0 pb-2 mr-8 font-['Epilogue',sans-serif] font-semibold text-[13px]"
            >
              My Profile
            </TabsTrigger>
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

        <TabsContent value="profile" className="mt-0 p-6 space-y-5">
          <Card className="border border-[#d6ddeb]">
            <div className="p-6 space-y-5">
              
              <div>
                <h3 className="font-['Epilogue',sans-serif] font-semibold text-[14px] text-[#202430] mb-1">
                  Basic Information
                </h3>
                <p className="font-['Epilogue',sans-serif] text-[13px] text-[#515b6f]">
                  This is your personal information that you can update anytime.
                </p>
              </div>

              <div className="h-px bg-[#d6ddeb]" />

              <div className="flex items-start justify-between">
                <div className="flex-1 max-w-xs">
                  <h4 className="font-['Epilogue',sans-serif] font-semibold text-[13px] text-[#25324b] mb-2">
                    Profile Photo
                  </h4>
                  <p className="font-['Epilogue',sans-serif] text-[13px] text-[#515b6f] leading-[1.6]">
                    This image will be shown publicly as your profile picture, it will help recruiters
                    recognize you!
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-[99px] h-[99px] rounded-full bg-gradient-to-br from-[#26a4ff] to-[#4640de] flex items-center justify-center text-white text-3xl font-bold">
                    JG
                  </div>
                  <div className="border-2 border-dashed border-[#4640de] rounded-lg p-8 bg-[#f8f8fd] text-center cursor-pointer hover:bg-[#f0f0fb] transition-colors">
                    <Upload className="w-6 h-6 text-[#4640de] mx-auto mb-2" />
                    <p className="font-['Epilogue',sans-serif] text-[13px] mb-1">
                      <span className="font-medium text-[#4640de]">Click to replace</span>
                      <span className="text-[#515b6f]"> or drag and drop</span>
                    </p>
                    <p className="font-['Epilogue',sans-serif] text-[13px] text-[#7c8493]">
                      SVG, PNG, JPG or GIF (max. 400 x 400px)
                    </p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-[#d6ddeb]" />

              <div>
                <div className="flex items-start justify-between mb-5">
                  <h4 className="font-['Epilogue',sans-serif] font-semibold text-[13px] text-[#25324b]">
                    Personal Details
                  </h4>
                </div>

                <div className="space-y-5">
                  <div>
                    <Label className="font-['Epilogue',sans-serif] font-semibold text-[13px] text-[#515b6f] mb-1">
                      Full Name <span className="text-[#ff6550]">*</span>
                    </Label>
                    <Input
                      defaultValue="Jake Gyll"
                      className="mt-1 border-[#d6ddeb] font-['Epilogue',sans-serif] text-[13px] h-9"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <Label className="font-['Epilogue',sans-serif] font-semibold text-[13px] text-[#515b6f] mb-1">
                        Phone Number <span className="text-[#ff6550]">*</span>
                      </Label>
                      <Input
                        defaultValue="+91 1245 572 135"
                        className="mt-1 border-[#d6ddeb] font-['Epilogue',sans-serif] text-[13px] h-9"
                      />
                    </div>
                    <div>
                      <Label className="font-['Epilogue',sans-serif] font-semibold text-[13px] text-[#515b6f] mb-1">
                        Email <span className="text-[#ff6550]">*</span>
                      </Label>
                      <Input
                        defaultValue="Jakegyll@gmail.com"
                        type="email"
                        className="mt-1 border-[#d6ddeb] font-['Epilogue',sans-serif] text-[13px] h-9"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <Label className="font-['Epilogue',sans-serif] font-semibold text-[13px] text-[#515b6f] mb-1">
                        Date of Birth <span className="text-[#ff6550]">*</span>
                      </Label>
                      <Input
                        type="date"
                        defaultValue="1997-08-09"
                        className="mt-1 border-[#d6ddeb] font-['Epilogue',sans-serif] text-[13px] h-9"
                      />
                    </div>
                    <div>
                      <Label className="font-['Epilogue',sans-serif] font-semibold text-[13px] text-[#515b6f] mb-1">
                        Gender <span className="text-[#ff6550]">*</span>
                      </Label>
                      <Select defaultValue="male">
                        <SelectTrigger className="mt-1 border-[#d6ddeb] font-['Epilogue',sans-serif] text-[13px] h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-[#d6ddeb]" />

              <div className="flex justify-end">
                <Button className="bg-[#4640de] hover:bg-[#3730cd] text-white px-5 py-2 rounded-lg font-['Epilogue',sans-serif] font-bold text-[13px]">
                  Save Profile
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="login" className="mt-0 p-6">
          <Card className="border border-[#d6ddeb] p-6">
            <h3 className="font-['Epilogue',sans-serif] font-semibold text-[16px] text-[#25324b] mb-5">
              Login Details
            </h3>
            <div className="space-y-5">
              <div>
                <Label className="font-['Epilogue',sans-serif] font-semibold text-[13px] text-[#515b6f]">
                  Current Password
                </Label>
                <Input type="password" className="mt-2 border-[#d6ddeb] h-9" />
              </div>
              <div>
                <Label className="font-['Epilogue',sans-serif] font-semibold text-[13px] text-[#515b6f]">
                  New Password
                </Label>
                <Input type="password" className="mt-2 border-[#d6ddeb] h-9" />
              </div>
              <div>
                <Label className="font-['Epilogue',sans-serif] font-semibold text-[13px] text-[#515b6f]">
                  Confirm Password
                </Label>
                <Input type="password" className="mt-2 border-[#d6ddeb] h-9" />
              </div>
              <Button className="bg-[#4640de] hover:bg-[#3730cd] text-white px-5 py-2 rounded-lg font-['Epilogue',sans-serif] font-bold text-[13px]">
                Update Password
              </Button>
            </div>
          </Card>
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