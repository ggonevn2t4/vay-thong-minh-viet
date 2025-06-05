
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Star, Users, CheckCircle, Edit, Trash2 } from 'lucide-react';
import { Advisor } from '@/types/dashboard';

const AdvisorManagement = () => {
  const [advisors, setAdvisors] = useState<Advisor[]>([
    {
      id: 'ADV-001',
      name: 'Nguyễn Thị Lan',
      email: 'lan.nguyen@vtm.com',
      role: 'advisor',
      title: 'Chuyên viên tư vấn cấp cao',
      specializations: ['Vay thế chấp', 'Vay tín chấp'],
      rating: 4.8,
      totalClients: 45,
      completedLoans: 78,
      experience: 5,
      location: 'Hà Nội',
      bankAffiliation: 'Vietcombank',
      createdAt: '2023-01-15',
      status: 'active'
    },
    {
      id: 'ADV-002',
      name: 'Trần Văn Minh',
      email: 'minh.tran@vtm.com',
      role: 'advisor',
      title: 'Tư vấn viên chuyên nghiệp',
      specializations: ['Vay mua xe', 'Vay tiêu dùng'],
      rating: 4.6,
      totalClients: 32,
      completedLoans: 56,
      experience: 3,
      location: 'TP.HCM',
      bankAffiliation: 'BIDV',
      createdAt: '2023-03-20',
      status: 'active'
    }
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAdvisor, setNewAdvisor] = useState({
    name: '',
    email: '',
    title: '',
    specializations: '',
    location: '',
    bankAffiliation: '',
    experience: ''
  });

  const handleAddAdvisor = () => {
    const advisor: Advisor = {
      id: `ADV-${String(advisors.length + 1).padStart(3, '0')}`,
      name: newAdvisor.name,
      email: newAdvisor.email,
      role: 'advisor',
      title: newAdvisor.title,
      specializations: newAdvisor.specializations.split(',').map(s => s.trim()),
      rating: 0,
      totalClients: 0,
      completedLoans: 0,
      experience: parseInt(newAdvisor.experience) || 0,
      location: newAdvisor.location,
      bankAffiliation: newAdvisor.bankAffiliation,
      createdAt: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    setAdvisors([...advisors, advisor]);
    setIsAddModalOpen(false);
    setNewAdvisor({
      name: '',
      email: '',
      title: '',
      specializations: '',
      location: '',
      bankAffiliation: '',
      experience: ''
    });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Danh sách tư vấn viên</CardTitle>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-brand-600 hover:bg-brand-700">
                <Plus className="h-4 w-4 mr-2" />
                Thêm tư vấn viên
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Thêm tư vấn viên mới</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Họ và tên</Label>
                  <Input
                    id="name"
                    value={newAdvisor.name}
                    onChange={(e) => setNewAdvisor({...newAdvisor, name: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newAdvisor.email}
                    onChange={(e) => setNewAdvisor({...newAdvisor, email: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="title">Chức danh</Label>
                  <Input
                    id="title"
                    value={newAdvisor.title}
                    onChange={(e) => setNewAdvisor({...newAdvisor, title: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="specializations">Chuyên môn (phân cách bằng dấu phẩy)</Label>
                  <Input
                    id="specializations"
                    value={newAdvisor.specializations}
                    onChange={(e) => setNewAdvisor({...newAdvisor, specializations: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="location">Địa điểm</Label>
                  <Input
                    id="location"
                    value={newAdvisor.location}
                    onChange={(e) => setNewAdvisor({...newAdvisor, location: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="bank">Ngân hàng liên kết</Label>
                  <Input
                    id="bank"
                    value={newAdvisor.bankAffiliation}
                    onChange={(e) => setNewAdvisor({...newAdvisor, bankAffiliation: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="experience">Kinh nghiệm (năm)</Label>
                  <Input
                    id="experience"
                    type="number"
                    value={newAdvisor.experience}
                    onChange={(e) => setNewAdvisor({...newAdvisor, experience: e.target.value})}
                  />
                </div>
                <Button onClick={handleAddAdvisor} className="w-full">
                  Thêm tư vấn viên
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tư vấn viên</TableHead>
              <TableHead>Chức danh</TableHead>
              <TableHead>Chuyên môn</TableHead>
              <TableHead>Đánh giá</TableHead>
              <TableHead>Khách hàng</TableHead>
              <TableHead>Hoàn thành</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {advisors.map((advisor) => (
              <TableRow key={advisor.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={advisor.avatar} alt={advisor.name} />
                      <AvatarFallback>{advisor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{advisor.name}</div>
                      <div className="text-sm text-gray-500">{advisor.email}</div>
                      <div className="text-xs text-gray-400">{advisor.location}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>{advisor.title}</div>
                  {advisor.bankAffiliation && (
                    <div className="text-sm text-gray-500">{advisor.bankAffiliation}</div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {advisor.specializations.map((spec, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {spec}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500" />
                    <span>{advisor.rating}/5.0</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4 text-blue-500" />
                    <span>{advisor.totalClients}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>{advisor.completedLoans}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={advisor.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {advisor.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default AdvisorManagement;
