'use server';

/**
 * @fileOverview Summarizes a user's health logs into an easy-to-understand format.
 *
 * - summarizeHealthLogs - A function that summarizes health logs.
 * - SummarizeHealthLogsInput - The input type for the summarizeHealthLogs function.
 * - SummarizeHealthLogsOutput - The return type for the summarizeHealthLogs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeHealthLogsInputSchema = z.object({
  healthLogs: z.string().describe('A string containing the user health logs.'),
});
export type SummarizeHealthLogsInput = z.infer<typeof SummarizeHealthLogsInputSchema>;

const SummarizeHealthLogsOutputSchema = z.object({
  summary: z.string().describe('A summary of the health logs.'),
});
export type SummarizeHealthLogsOutput = z.infer<typeof SummarizeHealthLogsOutputSchema>;

export async function summarizeHealthLogs(input: SummarizeHealthLogsInput): Promise<SummarizeHealthLogsOutput> {
  return summarizeHealthLogsFlow(input);
}

const summarizeHealthLogsPrompt = ai.definePrompt({
  name: 'summarizeHealthLogsPrompt',
  input: {schema: SummarizeHealthLogsInputSchema},
  output: {schema: SummarizeHealthLogsOutputSchema},
  prompt: `You are an AI assistant specialized in summarizing health logs. Please provide a concise and easy-to-understand summary of the following health logs:\n\nHealth Logs:\n{{{healthLogs}}}\n\nSummary: `,
});

const summarizeHealthLogsFlow = ai.defineFlow(
  {
    name: 'summarizeHealthLogsFlow',
    inputSchema: SummarizeHealthLogsInputSchema,
    outputSchema: SummarizeHealthLogsOutputSchema,
  },
  async input => {
    const {output} = await summarizeHealthLogsPrompt(input);
    return output!;
  }
);
