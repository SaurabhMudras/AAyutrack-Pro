
"use client";

import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AlertCircle, Bot, BrainCircuit, HeartPulse, Lightbulb } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { aiSymptomChecker, AISymptomCheckerOutput } from "@/ai/flows/ai-symptom-checker";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

const formSchema = z.object({
  symptoms: z.string().min(10, {
    message: "Please describe your symptoms in at least 10 characters.",
  }),
  age: z.coerce.number().min(1, "Age must be a positive number.").max(120),
  gender: z.enum(["male", "female", "other"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function AiCheckupPage() {
  const [result, setResult] = useState<AISymptomCheckerOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symptoms: "",
      age: 30,
      gender: "male",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    const aiResult = await aiSymptomChecker(values);
    setResult(aiResult);
    setIsLoading(false);
  }

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-1">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
                <Bot className="h-6 w-6 text-primary"/>
                <CardTitle className="font-headline">AI Symptom Check</CardTitle>
            </div>
            <CardDescription>
              Describe your symptoms, and our AI will provide preliminary
              insights.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="symptoms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Describe your symptoms</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., I have a persistent dry cough and a slight fever..."
                          className="resize-none"
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age</FormLabel>
                        <FormControl>
                          <Input type="number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <Button type="submit" className="w-full font-bold" disabled={isLoading}>
                  {isLoading ? "Analyzing..." : "Check Symptoms"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card className="min-h-[400px]">
          <CardHeader>
            <CardTitle className="font-headline">Analysis Report</CardTitle>
            <CardDescription>
              Here's a preliminary analysis based on the information you provided.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading && (
              <div className="space-y-6">
                <div className="space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
                <Alert variant="destructive" className="mt-6">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <AlertTitle><Skeleton className="h-5 w-24" /></AlertTitle>
                    <AlertDescription>
                        <Skeleton className="h-4 w-full" />
                    </AlertDescription>
                </Alert>
              </div>
            )}
            {!isLoading && !result && (
                <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64">
                    <BrainCircuit className="h-12 w-12 mb-4"/>
                    <p className="font-semibold">Your results will appear here.</p>
                    <p className="text-sm">Fill out the form to get started.</p>
                </div>
            )}
            {result && (
              <div className="space-y-6 animate-in fade-in-50 duration-500">
                <div className="space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-primary">
                        <Lightbulb className="h-5 w-5"/>
                        <h3 className="font-headline">Possible Causes</h3>
                    </div>
                    <p className="text-sm">{result.possibleCauses}</p>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 font-semibold text-accent">
                        <HeartPulse className="h-5 w-5"/>
                        <h3 className="font-headline">Recommended Next Steps</h3>
                    </div>
                    <p className="text-sm">{result.nextSteps}</p>
                </div>
                <Alert variant="destructive" className="mt-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle className="font-headline">Important Disclaimer</AlertTitle>
                  <AlertDescription>
                    {result.disclaimer}
                  </AlertDescription>
                </Alert>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
