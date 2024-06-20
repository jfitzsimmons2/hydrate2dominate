import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.hydrate2dominate.app',
  appName: 'hydrate2dominate',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
