import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

// Offline notification has been completely disabled per user requirement:
// The app is offline-first by design and works seamlessly offline without nagging banners.
export const OfflineIndicator: React.FC = () => {
  return null;
};

