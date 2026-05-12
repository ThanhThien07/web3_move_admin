import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    overview: 'System Overview',
    manageBooks: 'Inventory',
    salesRecords: 'Sales',
    messages: 'Messages',
    totalBooks: 'Total Books',
    totalPurchases: 'Total Purchases',
    totalRevenue: 'Total Revenue',
    activeWatchers: 'Active Watchers',
    recentActivity: 'Recent Publishing Activity',
    networkStatus: 'Network Status',
    suiNodeActive: 'SUI NODE ACTIVE',
    search: 'Search...',
    addBook: 'Add Book',
    editBook: 'Edit Book',
    title: 'Book Title',
    author: 'Author Name',
    price: 'Price (MIST)',
    coverUrl: 'Cover Image URL',
    ownerWallet: 'Owner Wallet Address',
    save: 'Save Changes',
    cancel: 'Cancel',
    publish: 'Publish Book',
    signOut: 'Sign Out',
    loading: 'Syncing Library...',
    systemHealthy: 'SYSTEM HEALTHY',
    realTimeSync: 'REAL-TIME SYNC',
    metricsDesc: 'Real-time metrics from your Web3 Library platform.',
    networkDesc: 'Your platform is currently connected to SUI Testnet. All transactions are being monitored in real-time.',
    username: 'Username',
    password: 'Password',
    login: 'LOG IN SYSTEM',
    register: 'Register Account',
    signInDesc: 'Sign in to manage your Web3 Library',
    loginSuccess: 'Logged in successfully',
    loginFailed: 'Invalid credentials'
  },
  vi: {
    overview: 'Tổng quan hệ thống',
    manageBooks: 'Quản lý kho sách',
    salesRecords: 'Lịch sử bán hàng',
    messages: 'Tin nhắn hỗ trợ',
    totalBooks: 'Tổng số sách',
    totalPurchases: 'Tổng đơn hàng',
    totalRevenue: 'Tổng doanh thu',
    activeWatchers: 'Người đang xem',
    recentActivity: 'Hoạt động xuất bản gần đây',
    networkStatus: 'Trạng thái mạng lưới',
    suiNodeActive: 'SUI NODE ĐANG CHẠY',
    search: 'Tìm kiếm sách...',
    addBook: 'Thêm sách mới',
    editBook: 'Chỉnh sửa sách',
    title: 'Tiêu đề sách',
    author: 'Tên tác giả',
    price: 'Giá bán (MIST)',
    coverUrl: 'Link ảnh bìa',
    ownerWallet: 'Địa chỉ ví người sở hữu',
    save: 'Lưu thay đổi',
    cancel: 'Hủy bỏ',
    publish: 'Xuất bản sách',
    signOut: 'Đăng xuất',
    loading: 'Đang đồng bộ thư viện...',
    systemHealthy: 'HỆ THỐNG ỔN ĐỊNH',
    realTimeSync: 'ĐỒNG BỘ THỜI GIAN THỰC',
    metricsDesc: 'Các chỉ số đo lường trực tiếp từ nền tảng Thư viện Web3.',
    networkDesc: 'Nền tảng của bạn hiện đang kết nối với SUI Testnet. Tất cả giao dịch đều được giám sát trực tiếp.',
    username: 'Tên đăng nhập',
    password: 'Mật khẩu',
    login: 'ĐĂNG NHẬP HỆ THỐNG',
    register: 'Đăng ký tài khoản mới',
    signInDesc: 'Đăng nhập để quản lý Thư viện Web3 của bạn',
    loginSuccess: 'Đăng nhập thành công',
    loginFailed: 'Sai tài khoản hoặc mật khẩu'
  }
};

type Language = 'en' | 'vi';

interface I18nContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: keyof typeof translations.en) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Language>('vi');

  const t = (key: keyof typeof translations.en) => {
    return translations[lang][key] || translations.en[key] || key;
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
