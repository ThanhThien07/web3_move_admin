import { createContext, useContext, useState, useEffect } from 'react';

type Language = 'en' | 'vi';

interface Translations {
  [key: string]: {
    [lang in Language]: string;
  };
}

const translations: Translations = {
  dashboard: { en: 'Dashboard', vi: 'Bảng điều khiển' },
  overview: { en: 'Overview', vi: 'Tổng quan' },
  manageBooks: { en: 'Manage Books', vi: 'Quản lý sách' },
  salesRecords: { en: 'Sales Records', vi: 'Lịch sử bán hàng' },
  signOut: { en: 'Sign Out', vi: 'Đăng xuất' },
  totalBooks: { en: 'Total Books', vi: 'Tổng số sách' },
  totalPurchases: { en: 'Total Purchases', vi: 'Tổng lượt mua' },
  totalRevenue: { en: 'Total Revenue', vi: 'Tổng doanh thu' },
  recentActivity: { en: 'Recent Activity', vi: 'Hoạt động gần đây' },
  addBook: { en: 'Add New Book', vi: 'Thêm sách mới' },
  editBook: { en: 'Edit Book', vi: 'Chỉnh sửa sách' },
  title: { en: 'Title', vi: 'Tiêu đề' },
  author: { en: 'Author', vi: 'Tác giả' },
  price: { en: 'Price (MIST)', vi: 'Giá (MIST)' },
  coverUrl: { en: 'Cover URL', vi: 'Link ảnh bìa' },
  accessUrl: { en: 'Access URL', vi: 'Link truy cập' },
  ownerWallet: { en: 'Owner Wallet', vi: 'Ví chủ sở hữu' },
  save: { en: 'Save Changes', vi: 'Lưu thay đổi' },
  publish: { en: 'Publish Now', vi: 'Đăng ngay' },
  cancel: { en: 'Cancel', vi: 'Hủy' },
  search: { en: 'Search...', vi: 'Tìm kiếm...' },
  welcomeAdmin: { en: 'Welcome back, Admin!', vi: 'Chào mừng quay lại, Admin!' },
  login: { en: 'Sign In', vi: 'Đăng nhập' },
  register: { en: 'Register', vi: 'Đăng ký' },
  username: { en: 'Username', vi: 'Tên đăng nhập' },
  password: { en: 'Password', vi: 'Mật khẩu' },
  messages: { en: 'Messages', vi: 'Tin nhắn' },
  chatWith: { en: 'Chat with', vi: 'Trò chuyện với' },
  typeMessage: { en: 'Type a message...', vi: 'Nhập tin nhắn...' },
  send: { en: 'Send', vi: 'Gửi' },
  noChats: { en: 'No messages yet.', vi: 'Chưa có tin nhắn nào.' },
};

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

export const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>(() => {
    return (localStorage.getItem('lang') as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = (key: string): string => {
    const translation = (translations as any)[key];
    return translation?.[lang] || key;
  };

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}
