
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, Check } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: 'customer' | 'advisor';
  onRoleChange: (role: 'customer' | 'advisor') => void;
}

const RoleSelector = ({ selectedRole, onRoleChange }: RoleSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-semibold mb-2">Chọn loại tài khoản</h3>
        <p className="text-sm text-gray-600">Vui lòng chọn loại tài khoản phù hợp với nhu cầu của bạn</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedRole === 'customer' 
              ? 'border-brand-500 bg-brand-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onRoleChange('customer')}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  selectedRole === 'customer' ? 'bg-brand-100' : 'bg-gray-100'
                }`}>
                  <Users className={`h-5 w-5 ${
                    selectedRole === 'customer' ? 'text-brand-600' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h4 className="font-medium">Khách hàng</h4>
                  <p className="text-sm text-gray-600">Tìm kiếm và so sánh các gói vay</p>
                </div>
              </div>
              {selectedRole === 'customer' && (
                <Check className="h-5 w-5 text-brand-600" />
              )}
            </div>
            <div className="mt-3">
              <Badge variant={selectedRole === 'customer' ? 'default' : 'secondary'} className="text-xs">
                Dành cho người cần vay
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedRole === 'advisor' 
              ? 'border-brand-500 bg-brand-50' 
              : 'border-gray-200 hover:border-gray-300'
          }`}
          onClick={() => onRoleChange('advisor')}
        >
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-full ${
                  selectedRole === 'advisor' ? 'bg-brand-100' : 'bg-gray-100'
                }`}>
                  <UserCheck className={`h-5 w-5 ${
                    selectedRole === 'advisor' ? 'text-brand-600' : 'text-gray-600'
                  }`} />
                </div>
                <div>
                  <h4 className="font-medium">Tư vấn viên</h4>
                  <p className="text-sm text-gray-600">Hỗ trợ khách hàng tìm gói vay phù hợp</p>
                </div>
              </div>
              {selectedRole === 'advisor' && (
                <Check className="h-5 w-5 text-brand-600" />
              )}
            </div>
            <div className="mt-3">
              <Badge variant={selectedRole === 'advisor' ? 'default' : 'secondary'} className="text-xs">
                Dành cho chuyên gia tài chính
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RoleSelector;
