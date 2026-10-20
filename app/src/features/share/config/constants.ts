import { Briefcase, Globe, Mail, Send } from 'lucide-react';
import type { ShareIntentKey } from '../utils/shareIntents';

export const SHARE_INTENTS = [
  { key: 'x', icon: Send },
  { key: 'facebook', icon: Globe },
  { key: 'linkedin', icon: Briefcase },
  { key: 'email', icon: Mail },
] as const satisfies readonly { key: ShareIntentKey; icon: typeof Send }[];
