
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { X, Plus } from 'lucide-react';

interface AdvisorProfile {
  id?: string;
  full_name: string;
  phone: string;
  email: string;
  avatar_url?: string;
  job_title: string;
  years_experience: number;
  certifications: string[];
  languages: string[];
  bank_name: string;
  branch_name: string;
  branch_address: string;
  bank_employee_id: string;
  department: string;
  bio: string;
  specializations: string[];
  achievements: string[];
  loan_types: Record<string, number>;
  rate_update_frequency: string;
  availability_status: string;
  working_hours: Record<string, any>;
}

const AdvisorProfileForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [existingProfile, setExistingProfile] = useState<AdvisorProfile | null>(null);
  
  const [formData, setFormData] = useState<AdvisorProfile>({
    full_name: '',
    phone: '',
    email: user?.email || '',
    job_title: '',
    years_experience: 0,
    certifications: [],
    languages: [],
    bank_name: '',
    branch_name: '',
    branch_address: '',
    bank_employee_id: '',
    department: '',
    bio: '',
    specializations: [],
    achievements: [],
    loan_types: {},
    rate_update_frequency: 'weekly',
    availability_status: 'available',
    working_hours: {
      monday: { start: '09:00', end: '17:00', available: true },
      tuesday: { start: '09:00', end: '17:00', available: true },
      wednesday: { start: '09:00', end: '17:00', available: true },
      thursday: { start: '09:00', end: '17:00', available: true },
      friday: { start: '09:00', end: '17:00', available: true },
      saturday: { start: '09:00', end: '12:00', available: false },
      sunday: { start: '09:00', end: '12:00', available: false }
    }
  });

  // Temporary states for adding new items
  const [newCertification, setNewCertification] = useState('');
  const [newLanguage, setNewLanguage] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newAchievement, setNewAchievement] = useState('');
  const [newLoanType, setNewLoanType] = useState('');
  const [newLoanRate, setNewLoanRate] = useState('');

  useEffect(() => {
    if (user) {
      fetchExistingProfile();
    }
  }, [user]);

  const fetchExistingProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('advisor_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (data) {
        const profileData: AdvisorProfile = {
          ...data,
          certifications: data.certifications || [],
          languages: data.languages || [],
          specializations: data.specializations || [],
          achievements: data.achievements || [],
          loan_types: (data.loan_types as Record<string, number>) || {},
          working_hours: (data.working_hours as Record<string, any>) || formData.working_hours
        };
        
        setExistingProfile(profileData);
        setFormData(profileData);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addToArray = (field: 'certifications' | 'languages' | 'specializations' | 'achievements', value: string) => {
    if (value.trim()) {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], value.trim()]
      }));
    }
  };

  const removeFromArray = (field: 'certifications' | 'languages' | 'specializations' | 'achievements', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addLoanType = () => {
    if (newLoanType.trim() && newLoanRate) {
      setFormData(prev => ({
        ...prev,
        loan_types: {
          ...prev.loan_types,
          [newLoanType.trim()]: parseFloat(newLoanRate)
        }
      }));
      setNewLoanType('');
      setNewLoanRate('');
    }
  };

  const removeLoanType = (loanType: string) => {
    setFormData(prev => {
      const newLoanTypes = { ...prev.loan_types };
      delete newLoanTypes[loanType];
      return { ...prev, loan_types: newLoanTypes };
    });
  };

  const handleWorkingHoursChange = (day: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      working_hours: {
        ...prev.working_hours,
        [day]: {
          ...prev.working_hours[day],
          [field]: value
        }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      const profileData = {
        user_id: user.id,
        ...formData,
        updated_at: new Date().toISOString()
      };

      let result;
      if (existingProfile) {
        result = await supabase
          .from('advisor_profiles')
          .update(profileData)
          .eq('user_id', user.id);
      } else {
        result = await supabase
          .from('advisor_profiles')
          .insert([profileData]);
      }

      if (result.error) {
        throw result.error;
      }

      toast({
        title: "Hồ sơ đã được lưu",
        description: existingProfile ? "Hồ sơ tư vấn viên đã được cập nhật thành công." : "Hồ sơ tư vấn viên đã được tạo thành công.",
      });

      if (!existingProfile) {
        await fetchExistingProfile();
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast({
        title: "Lỗi",
        description: "Không thể lưu hồ sơ. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-800">
            {existingProfile ? 'Cập nhật hồ sơ tư vấn viên' : 'Tạo hồ sơ tư vấn viên'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="personal">Cá nhân</TabsTrigger>
                <TabsTrigger value="bank">Ngân hàng</TabsTrigger>
                <TabsTrigger value="professional">Chuyên môn</TabsTrigger>
                <TabsTrigger value="rates">Lãi suất</TabsTrigger>
                <TabsTrigger value="schedule">Lịch làm việc</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Họ và tên *</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => handleInputChange('full_name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="years_experience">Số năm kinh nghiệm</Label>
                    <Input
                      id="years_experience"
                      type="number"
                      value={formData.years_experience}
                      onChange={(e) => handleInputChange('years_experience', parseInt(e.target.value) || 0)}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Giới thiệu bản thân</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    placeholder="Hãy giới thiệu về bản thân, kinh nghiệm và phong cách làm việc của bạn..."
                  />
                </div>

                <div>
                  <Label>Ngôn ngữ</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newLanguage}
                      onChange={(e) => setNewLanguage(e.target.value)}
                      placeholder="Thêm ngôn ngữ"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addToArray('languages', newLanguage);
                          setNewLanguage('');
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        addToArray('languages', newLanguage);
                        setNewLanguage('');
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.languages.map((lang, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {lang}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeFromArray('languages', index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="bank" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bank_name">Tên ngân hàng *</Label>
                    <Input
                      id="bank_name"
                      value={formData.bank_name}
                      onChange={(e) => handleInputChange('bank_name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="branch_name">Chi nhánh</Label>
                    <Input
                      id="branch_name"
                      value={formData.branch_name}
                      onChange={(e) => handleInputChange('branch_name', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="branch_address">Địa chỉ chi nhánh</Label>
                    <Input
                      id="branch_address"
                      value={formData.branch_address}
                      onChange={(e) => handleInputChange('branch_address', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bank_employee_id">Mã nhân viên</Label>
                    <Input
                      id="bank_employee_id"
                      value={formData.bank_employee_id}
                      onChange={(e) => handleInputChange('bank_employee_id', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="job_title">Chức vụ</Label>
                    <Input
                      id="job_title"
                      value={formData.job_title}
                      onChange={(e) => handleInputChange('job_title', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="department">Phòng ban</Label>
                    <Input
                      id="department"
                      value={formData.department}
                      onChange={(e) => handleInputChange('department', e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="professional" className="space-y-4">
                <div>
                  <Label>Chuyên môn</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newSpecialization}
                      onChange={(e) => setNewSpecialization(e.target.value)}
                      placeholder="Thêm chuyên môn"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addToArray('specializations', newSpecialization);
                          setNewSpecialization('');
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        addToArray('specializations', newSpecialization);
                        setNewSpecialization('');
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.specializations.map((spec, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {spec}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeFromArray('specializations', index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Chứng chỉ</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newCertification}
                      onChange={(e) => setNewCertification(e.target.value)}
                      placeholder="Thêm chứng chỉ"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addToArray('certifications', newCertification);
                          setNewCertification('');
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        addToArray('certifications', newCertification);
                        setNewCertification('');
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.certifications.map((cert, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {cert}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeFromArray('certifications', index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Thành tích</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newAchievement}
                      onChange={(e) => setNewAchievement(e.target.value)}
                      placeholder="Thêm thành tích"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addToArray('achievements', newAchievement);
                          setNewAchievement('');
                        }
                      }}
                    />
                    <Button
                      type="button"
                      size="sm"
                      onClick={() => {
                        addToArray('achievements', newAchievement);
                        setNewAchievement('');
                      }}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.achievements.map((achievement, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {achievement}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => removeFromArray('achievements', index)}
                        />
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="rates" className="space-y-4">
                <div>
                  <Label htmlFor="rate_update_frequency">Tần suất cập nhật lãi suất</Label>
                  <Select value={formData.rate_update_frequency} onValueChange={(value) => handleInputChange('rate_update_frequency', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Hàng ngày</SelectItem>
                      <SelectItem value="weekly">Hàng tuần</SelectItem>
                      <SelectItem value="monthly">Hàng tháng</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Loại vay và lãi suất</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={newLoanType}
                      onChange={(e) => setNewLoanType(e.target.value)}
                      placeholder="Loại vay"
                    />
                    <Input
                      value={newLoanRate}
                      onChange={(e) => setNewLoanRate(e.target.value)}
                      placeholder="Lãi suất (%)"
                      type="number"
                      step="0.01"
                    />
                    <Button type="button" size="sm" onClick={addLoanType}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {Object.entries(formData.loan_types).map(([loanType, rate]) => (
                      <div key={loanType} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>{loanType}: {rate}%</span>
                        <X
                          className="h-4 w-4 cursor-pointer text-red-500"
                          onClick={() => removeLoanType(loanType)}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="schedule" className="space-y-4">
                <div>
                  <Label htmlFor="availability_status">Trạng thái hiện tại</Label>
                  <Select value={formData.availability_status} onValueChange={(value) => handleInputChange('availability_status', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Có thể liên hệ</SelectItem>
                      <SelectItem value="busy">Đang bận</SelectItem>
                      <SelectItem value="offline">Ngoại tuyến</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Lịch làm việc</Label>
                  <div className="space-y-3">
                    {Object.entries(formData.working_hours).map(([day, schedule]: [string, any]) => (
                      <div key={day} className="flex items-center gap-4">
                        <div className="w-20 font-medium capitalize">
                          {day === 'monday' ? 'Thứ 2' : 
                           day === 'tuesday' ? 'Thứ 3' :
                           day === 'wednesday' ? 'Thứ 4' :
                           day === 'thursday' ? 'Thứ 5' :
                           day === 'friday' ? 'Thứ 6' :
                           day === 'saturday' ? 'Thứ 7' : 'Chủ nhật'}
                        </div>
                        <Switch
                          checked={schedule.available}
                          onCheckedChange={(checked) => handleWorkingHoursChange(day, 'available', checked)}
                        />
                        {schedule.available && (
                          <>
                            <Input
                              type="time"
                              value={schedule.start}
                              onChange={(e) => handleWorkingHoursChange(day, 'start', e.target.value)}
                              className="w-32"
                            />
                            <span>-</span>
                            <Input
                              type="time"
                              value={schedule.end}
                              onChange={(e) => handleWorkingHoursChange(day, 'end', e.target.value)}
                              className="w-32"
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end mt-6">
              <Button type="submit" disabled={loading} className="bg-brand-600 hover:bg-brand-700">
                {loading ? 'Đang lưu...' : (existingProfile ? 'Cập nhật hồ sơ' : 'Tạo hồ sơ')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvisorProfileForm;
