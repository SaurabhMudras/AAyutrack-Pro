'use server';

/**
 * @fileOverview AI-powered symptom checker flow.
 *
 * - aiSymptomChecker - A function that processes user-reported symptoms and provides possible next steps.
 * - AISymptomCheckerInput - The input type for the aiSymptomChecker function.
 * - AISymptomCheckerOutput - The return type for the aiSymptomChecker function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AISymptomCheckerInputSchema = z.object({
  symptoms: z
    .string()
    .describe('A detailed description of the symptoms being experienced.'),
  age: z.number().describe('The age of the user in years.'),
  gender: z.enum(['male', 'female', 'other']).describe('The gender of the user.'),
});
export type AISymptomCheckerInput = z.infer<typeof AISymptomCheckerInputSchema>;

const AISymptomCheckerOutputSchema = z.object({
  possibleCauses: z
    .string()
    .describe('Possible causes or conditions related to the symptoms.'),
  nextSteps: z
    .string()
    .describe('Recommended next steps, such as seeing a doctor or self-care.'),
  disclaimer: z
    .string()
    .describe('A disclaimer that this is not a substitute for professional medical advice.'),
});
export type AISymptomCheckerOutput = z.infer<typeof AISymptomCheckerOutputSchema>;

export async function aiSymptomChecker(input: AISymptomCheckerInput): Promise<AISymptomCheckerOutput> {
  return aiSymptomCheckerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiSymptomCheckerPrompt',
  input: {schema: AISymptomCheckerInputSchema},
  output: {schema: AISymptomCheckerOutputSchema},
  prompt: `You are an AI-powered symptom checker that provides a preliminary understanding of symptoms and possible next steps.

  Based on the following information, provide possible causes and recommended next steps. Include a disclaimer that this is not a substitute for professional medical advice.

  Symptoms: {{{symptoms}}}
  Age: {{{age}}}
  Gender: {{{gender}}}`,
});

const aiSymptomCheckerFlow = ai.defineFlow(
  {
    name: 'aiSymptomCheckerFlow',
    inputSchema: AISymptomCheckerInputSchema,
    outputSchema: AISymptomCheckerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
