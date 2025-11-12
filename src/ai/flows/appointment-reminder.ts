// src/ai/flows/appointment-reminder.ts
'use server';
/**
 * @fileOverview A flow to determine if a user needs a reminder for an upcoming appointment.
 *
 * - shouldRemind - A function that determines if a reminder should be sent.
 * - AppointmentReminderInput - The input type for the shouldRemind function.
 * - AppointmentReminderOutput - The return type for the shouldRemind function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AppointmentReminderInputSchema = z.object({
  appointmentDateTime: z
    .string()
    .describe('The date and time of the upcoming appointment (ISO format).'),
  historicalAdherence: z
    .number()
    .describe(
      'The users historical adherence to appointments, on a scale of 0 to 1.  0 means never adheres, 1 means always adheres.'
    ),
  appointmentType: z.string().describe('The type of appointment (e.g., doctor, dentist).'),
  timeUntilAppointmentHours: z
    .number()
    .describe('The number of hours until the appointment.'),
});
export type AppointmentReminderInput = z.infer<typeof AppointmentReminderInputSchema>;

const AppointmentReminderOutputSchema = z.object({
  shouldRemind: z.boolean().describe('Whether or not a reminder should be sent.'),
  reason: z.string().describe('The reason for the reminder decision.'),
});
export type AppointmentReminderOutput = z.infer<typeof AppointmentReminderOutputSchema>;

export async function shouldRemind(input: AppointmentReminderInput): Promise<AppointmentReminderOutput> {
  return appointmentReminderFlow(input);
}

const appointmentReminderPrompt = ai.definePrompt({
  name: 'appointmentReminderPrompt',
  input: {schema: AppointmentReminderInputSchema},
  output: {schema: AppointmentReminderOutputSchema},
  prompt: `Based on the following information, determine if the user should be reminded of their upcoming appointment.

Appointment Type: {{{appointmentType}}}
Appointment Date/Time: {{{appointmentDateTime}}}
Historical Adherence: {{{historicalAdherence}}}
Time Until Appointment (hours): {{{timeUntilAppointmentHours}}}

Consider these factors:
- Users with low historical adherence should be reminded.
- Appointments that are soon should be reminded.
- Important appointment types should be reminded.

Respond with whether or not a reminder should be sent, and the reasoning behind the decision.`,
});

const appointmentReminderFlow = ai.defineFlow(
  {
    name: 'appointmentReminderFlow',
    inputSchema: AppointmentReminderInputSchema,
    outputSchema: AppointmentReminderOutputSchema,
  },
  async input => {
    const {output} = await appointmentReminderPrompt(input);
    return output!;
  }
);
