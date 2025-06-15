
export interface DocumentItem {
  id: string;
  name: string;
  description: string;
  required: boolean;
  category: string;
  completed: boolean; 
}

export const documentItems: DocumentItem[] = [
    {
      id: '1',
      name: 'CMND/CCCD',
      description: 'Chứng minh nhân dân hoặc căn cước công dân còn hiệu lực',
      required: true,
      category: 'Giấy tờ tùy thân',
      completed: false
    },
    {
      id: '2',
      name: 'Sổ hộ khẩu',
      description: 'Bản sao có công chứng sổ hộ khẩu',
      required: true,
      category: 'Giấy tờ tùy thân',
      completed: false
    },
    {
      id: '3',
      name: 'Hợp đồng lao động',
      description: 'Hợp đồng lao động còn hiệu lực',
      required: true,
      category: 'Giấy tờ thu nhập',
      completed: false
    },
    {
      id: '4',
      name: 'Bảng lương 3 tháng gần nhất',
      description: 'Bảng lương có xác nhận của công ty',
      required: true,
      category: 'Giấy tờ thu nhập',
      completed: false
    },
    {
      id: '5',
      name: 'Sao kê tài khoản 6 tháng',
      description: 'Sao kê tài khoản ngân hàng 6 tháng gần nhất',
      required: true,
      category: 'Tài chính',
      completed: false
    },
    {
      id: '6',
      name: 'Giấy tờ tài sản đảm bảo',
      description: 'Sổ đỏ hoặc giấy tờ chứng minh quyền sở hữu tài sản',
      required: false,
      category: 'Tài sản đảm bảo',
      completed: false
    }
];

export const categories = Array.from(new Set(documentItems.map(doc => doc.category)));

