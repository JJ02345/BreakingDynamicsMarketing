import { BarChart3, FlaskConical, Type, MessageSquare, Hash, Timer, PlusCircle, Minus, AtSign, Bold, Calendar } from 'lucide-react';

export const BLOCKS = {
  POLL: { name: 'Umfrage-Kern', icon: BarChart3, req: true },
  CHALLENGE: { name: 'Validierungs-Herausforderung', icon: FlaskConical, req: false },
  TITLE: { name: 'Post-Titel', icon: Type, req: false },
  CTA: { name: 'Call-to-Action', icon: MessageSquare, req: false },
  HASHTAG: { name: 'Hashtags', icon: Hash, req: false },
  DURATION: { name: 'Laufzeit', icon: Timer, req: false },
  CUSTOM: { name: 'Custom Text', icon: PlusCircle, req: false },
  DIVIDER: { name: 'Trenner', icon: Minus, req: false },
  MENTION: { name: '@Mention', icon: AtSign, req: false },
  NUMBER: { name: 'Zahlen', icon: Bold, req: false },
  SCHEDULE: { name: 'Termin', icon: Calendar, req: false }
};

export const DUR_LABELS = { '1day': '24H', '3days': '3 TAGE', '1week': '1 WOCHE' };
