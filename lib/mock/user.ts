import { User } from '../types';

export const mockUser: User = {
  id: '1',
  name: '山田太郎',
  email: 'yamada@example.com',
  location: {
    id: 'loc1',
    name: 'カフェ＆レストラン 桜',
    address: '東京都渋谷区道玄坂1-2-3',
  },
};

export const mockLocations = [
  {
    id: 'loc1',
    name: 'カフェ＆レストラン 桜',
    address: '東京都渋谷区道玄坂1-2-3',
  },
  {
    id: 'loc2',
    name: 'カフェ＆レストラン 桜 新宿店',
    address: '東京都新宿区西新宿1-1-1',
  },
  {
    id: 'loc3',
    name: 'カフェ＆レストラン 桜 池袋店',
    address: '東京都豊島区東池袋1-1-1',
  },
];
