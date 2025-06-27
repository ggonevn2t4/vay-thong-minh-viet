
import React from 'react';
import CustomerProfileForm from '@/components/profile/CustomerProfileForm';

const UserProfileTab = () => {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Hồ sơ cá nhân</h2>
        <p className="text-gray-600">
          Quản lý thông tin cá nhân và tài liệu xác thực của bạn
        </p>
      </div>
      
      <CustomerProfileForm />
    </div>
  );
};

export default UserProfileTab;
