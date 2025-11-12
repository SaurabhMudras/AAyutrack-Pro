import { config } from 'dotenv';
config();

import '@/ai/flows/ai-symptom-checker.ts';
import '@/ai/flows/appointment-reminder.ts';
import '@/ai/flows/summarize-health-logs.ts';