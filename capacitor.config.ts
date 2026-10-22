import type { CapacitorConfig } from '@capacitor/cli'

const config: CapacitorConfig = {
  appId: 'in.instantphoto.photographer',
  appName: 'Instant Photo Partner',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
  },
}

export default config
