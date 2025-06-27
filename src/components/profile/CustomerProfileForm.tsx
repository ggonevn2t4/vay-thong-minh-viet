
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { User, MapPin, IdCard, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface ProfileData {
  full_name: string;
  phone: string;
  email: string;
  date_of_birth: string;
  gender: 'nam' | 'nu' | 'khac' | null;
  permanent_address_city: string;
  permanent_address_district: string;
  permanent_address_ward: string;
  permanent_address_street: string;
  current_address_city: string;
  current_address_district: string;
  current_address_ward: string;
  current_address_street: string;
  id_number: string;
  id_type: 'cccd' | 'cmnd' | null;
  id_issue_date: string;
  id_expiry_date: string;
  id_never_expires: boolean;
  id_issuing_authority: string;
  old_id_number: string;
  employment_type: string;
  monthly_income: number;
  company_name: string;
  work_experience_years: number;
  kyc_verified: boolean;
}

const CustomerProfileForm = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    full_name: '',
    phone: '',
    email: '',
    date_of_birth: '',
    gender: null,
    permanent_address_city: '',
    permanent_address_district: '',
    permanent_address_ward: '',
    permanent_address_street: '',
    current_address_city: '',
    current_address_district: '',
    current_address_ward: '',
    current_address_street: '',
    id_number: '',
    id_type: null,
    id_issue_date: '',
    id_expiry_date: '',
    id_never_expires: false,
    id_issuing_authority: '',
    old_id_number: '',
    employment_type: '',
    monthly_income: 0,
    company_name: '',
    work_experience_years: 0,
    kyc_verified: false,
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setProfileData({
          full_name: data.full_name || '',
          phone: data.phone || '',
          email: data.email || user.email || '',
          date_of_birth: data.date_of_birth || '',
          gender: data.gender,
          permanent_address_city: data.permanent_address_city || '',
          permanent_address_district: data.permanent_address_district || '',
          permanent_address_ward: data.permanent_address_ward || '',
          permanent_address_street: data.permanent_address_street || '',
          current_address_city: data.current_address_city || '',
          current_address_district: data.current_address_district || '',
          current_address_ward: data.current_address_ward || '',
          current_address_street: data.current_address_street || '',
          id_number: data.id_number || '',
          id_type: data.id_type,
          id_issue_date: data.id_issue_date || '',
          id_expiry_date: data.id_expiry_date || '',
          id_never_expires: data.id_never_expires || false,
          id_issuing_authority: data.id_issuing_authority || '',
          old_id_number: data.old_id_number || '',
          employment_type: data.employment_type || '',
          monthly_income: data.monthly_income || 0,
          company_name: data.company_name || '',
          work_experience_years: data.work_experience_years || 0,
          kyc_verified: data.kyc_verified || false,
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Lỗi khi tải thông tin hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: any) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profileData,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      
      toast.success('Lưu thông tin thành công');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Lỗi khi lưu thông tin');
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (file: File, documentType: 'id_front' | 'id_back' | 'portrait') => {
    if (!user || !file) return;

    setUploadingFiles(prev => ({ ...prev, [documentType]: true }));
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${documentType}_${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(fileName);

      // Save document info to database
      const { error: dbError } = await supabase
        .from('kyc_documents')
        .insert({
          user_id: user.id,
          document_type: documentType,
          file_url: publicUrl,
          file_name: file.name,
        });

      if (dbError) throw dbError;

      // Update profile with photo URLs
      const updateField = documentType === 'id_front' ? 'id_front_photo_url' :
                         documentType === 'id_back' ? 'id_back_photo_url' : 'portrait_photo_url';
      
      await supabase
        .from('profiles')
        .update({ [updateField]: publicUrl })
        .eq('id', user.id);

      toast.success('Tải ảnh thành công');
      fetchProfile(); // Refresh profile data
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Lỗi khi tải ảnh lên');
    } finally {
      setUploadingFiles(prev => ({ ...prev, [documentType]: false }));
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Đang tải thông tin...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Hồ sơ khách hàng</h2>
        {profileData.kyc_verified && (
          <Badge className="bg-green-100 text-green-800">
            <CheckCircle className="h-4 w-4 mr-1" />
            Đã xác thực KYC
          </Badge>
        )}
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Thông tin cá nhân</TabsTrigger>
          <TabsTrigger value="address">Địa chỉ</TabsTrigger>
          <TabsTrigger value="kyc">Giấy tờ tùy thân</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Thông tin cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Họ và tên *</Label>
                  <Input
                    id="full_name"
                    value={profileData.full_name}
                    onChange={(e) => handleInputChange('full_name', e.target.value)}
                    placeholder="Nhập họ và tên"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Số điện thoại *</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Nhập số điện thoại"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Nhập email"
                  />
                </div>
                <div>
                  <Label htmlFor="date_of_birth">Ngày sinh *</Label>
                  <Input
                    id="date_of_birth"
                    type="date"
                    value={profileData.date_of_birth}
                    onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="gender">Giới tính</Label>
                  <Select value={profileData.gender || ''} onValueChange={(value) => handleInputChange('gender', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn giới tính" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nam">Nam</SelectItem>
                      <SelectItem value="nu">Nữ</SelectItem>
                      <SelectItem value="khac">Khác</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="employment_type">Loại công việc</Label>
                  <Input
                    id="employment_type"
                    value={profileData.employment_type}
                    onChange={(e) => handleInputChange('employment_type', e.target.value)}
                    placeholder="Ví dụ: Nhân viên văn phòng"
                  />
                </div>
                <div>
                  <Label htmlFor="monthly_income">Thu nhập hàng tháng (VND)</Label>
                  <Input
                    id="monthly_income"
                    type="number"
                    value={profileData.monthly_income}
                    onChange={(e) => handleInputChange('monthly_income', parseInt(e.target.value) || 0)}
                    placeholder="Nhập thu nhập hàng tháng"
                  />
                </div>
                <div>
                  <Label htmlFor="company_name">Tên công ty</Label>
                  <Input
                    id="company_name"
                    value={profileData.company_name}
                    onChange={(e) => handleInputChange('company_name', e.target.value)}
                    placeholder="Nhập tên công ty"
                  />
                </div>
                <div>
                  <Label htmlFor="work_experience_years">Số năm kinh nghiệm</Label>
                  <Input
                    id="work_experience_years"
                    type="number"
                    value={profileData.work_experience_years}
                    onChange={(e) => handleInputChange('work_experience_years', parseInt(e.target.value) || 0)}
                    placeholder="Nhập số năm kinh nghiệm"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="address">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Địa chỉ thường trú
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="permanent_city">Tỉnh/Thành phố *</Label>
                    <Input
                      id="permanent_city"
                      value={profileData.permanent_address_city}
                      onChange={(e) => handleInputChange('permanent_address_city', e.target.value)}
                      placeholder="Nhập tỉnh/thành phố"
                    />
                  </div>
                  <div>
                    <Label htmlFor="permanent_district">Quận/Huyện *</Label>
                    <Input
                      id="permanent_district"
                      value={profileData.permanent_address_district}
                      onChange={(e) => handleInputChange('permanent_address_district', e.target.value)}
                      placeholder="Nhập quận/huyện"
                    />
                  </div>
                  <div>
                    <Label htmlFor="permanent_ward">Phường/Xã *</Label>
                    <Input
                      id="permanent_ward"
                      value={profileData.permanent_address_ward}
                      onChange={(e) => handleInputChange('permanent_address_ward', e.target.value)}
                      placeholder="Nhập phường/xã"
                    />
                  </div>
                  <div>
                    <Label htmlFor="permanent_street">Địa chỉ chi tiết *</Label>
                    <Input
                      id="permanent_street"
                      value={profileData.permanent_address_street}
                      onChange={(e) => handleInputChange('permanent_address_street', e.target.value)}
                      placeholder="Số nhà, tên đường..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Địa chỉ hiện tại
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="current_city">Tỉnh/Thành phố</Label>
                    <Input
                      id="current_city"
                      value={profileData.current_address_city}
                      onChange={(e) => handleInputChange('current_address_city', e.target.value)}
                      placeholder="Nhập tỉnh/thành phố"
                    />
                  </div>
                  <div>
                    <Label htmlFor="current_district">Quận/Huyện</Label>
                    <Input
                      id="current_district"
                      value={profileData.current_address_district}
                      onChange={(e) => handleInputChange('current_address_district', e.target.value)}
                      placeholder="Nhập quận/huyện"
                    />
                  </div>
                  <div>
                    <Label htmlFor="current_ward">Phường/Xã</Label>
                    <Input
                      id="current_ward"
                      value={profileData.current_address_ward}
                      onChange={(e) => handleInputChange('current_address_ward', e.target.value)}
                      placeholder="Nhập phường/xã"
                    />
                  </div>
                  <div>
                    <Label htmlFor="current_street">Địa chỉ chi tiết</Label>
                    <Input
                      id="current_street"
                      value={profileData.current_address_street}
                      onChange={(e) => handleInputChange('current_address_street', e.target.value)}
                      placeholder="Số nhà, tên đường..."
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="kyc">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <IdCard className="h-5 w-5 mr-2" />
                Giấy tờ tùy thân
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="id_type">Loại giấy tờ *</Label>
                  <Select value={profileData.id_type || ''} onValueChange={(value) => handleInputChange('id_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại giấy tờ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cccd">Căn cước công dân</SelectItem>
                      <SelectItem value="cmnd">Chứng minh nhân dân</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="id_number">Số giấy tờ *</Label>
                  <Input
                    id="id_number"
                    value={profileData.id_number}
                    onChange={(e) => handleInputChange('id_number', e.target.value)}
                    placeholder="Nhập số giấy tờ"
                  />
                </div>
                <div>
                  <Label htmlFor="id_issue_date">Ngày cấp</Label>
                  <Input
                    id="id_issue_date"
                    type="date"
                    value={profileData.id_issue_date}
                    onChange={(e) => handleInputChange('id_issue_date', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="id_expiry_date">Ngày hết hạn</Label>
                  <Input
                    id="id_expiry_date"
                    type="date"
                    value={profileData.id_expiry_date}
                    onChange={(e) => handleInputChange('id_expiry_date', e.target.value)}
                    disabled={profileData.id_never_expires}
                  />
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="id_never_expires"
                      checked={profileData.id_never_expires}
                      onCheckedChange={(checked) => handleInputChange('id_never_expires', checked)}
                    />
                    <Label htmlFor="id_never_expires">Không thời hạn</Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="id_issuing_authority">Nơi cấp</Label>
                  <Input
                    id="id_issuing_authority"
                    value={profileData.id_issuing_authority}
                    onChange={(e) => handleInputChange('id_issuing_authority', e.target.value)}
                    placeholder="Ví dụ: Cục Cảnh sát QLHC về TTXH"
                  />
                </div>
                <div>
                  <Label htmlFor="old_id_number">Số CMND cũ (nếu có)</Label>
                  <Input
                    id="old_id_number"
                    value={profileData.old_id_number}
                    onChange={(e) => handleInputChange('old_id_number', e.target.value)}
                    placeholder="Nhập số CMND cũ"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Tải lên hình ảnh</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FileUploadCard
                    title="Mặt trước CCCD/CMND"
                    type="id_front"
                    uploading={uploadingFiles.id_front}
                    onUpload={handleFileUpload}
                  />
                  <FileUploadCard
                    title="Mặt sau CCCD/CMND"
                    type="id_back"
                    uploading={uploadingFiles.id_back}
                    onUpload={handleFileUpload}
                  />
                  <FileUploadCard
                    title="Ảnh chân dung"
                    type="portrait"
                    uploading={uploadingFiles.portrait}
                    onUpload={handleFileUpload}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end space-x-4">
        <Button
          onClick={handleSaveProfile}
          disabled={saving}
          className="bg-brand-600 hover:bg-brand-700"
        >
          {saving ? 'Đang lưu...' : 'Lưu thông tin'}
        </Button>
      </div>
    </div>
  );
};

interface FileUploadCardProps {
  title: string;
  type: 'id_front' | 'id_back' | 'portrait';
  uploading: boolean;
  onUpload: (file: File, type: 'id_front' | 'id_back' | 'portrait') => void;
}

const FileUploadCard: React.FC<FileUploadCardProps> = ({ title, type, uploading, onUpload }) => {
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onUpload(file, type);
    }
  };

  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
      <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
      <h5 className="font-medium mb-2">{title}</h5>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id={`upload-${type}`}
        disabled={uploading}
      />
      <label
        htmlFor={`upload-${type}`}
        className={`inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded cursor-pointer hover:bg-gray-200 transition-colors ${
          uploading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {uploading ? 'Đang tải...' : 'Chọn file'}
      </label>
    </div>
  );
};

export default CustomerProfileForm;
