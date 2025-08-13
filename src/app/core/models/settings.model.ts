export interface Settings {
  id: 'user-settings';
  theme: 'light' | 'dark';
  locale: 'en' | 'es';
  notificationsEnabled: boolean;
  reminderTime?: string;
}
