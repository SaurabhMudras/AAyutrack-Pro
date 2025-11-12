"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { healthTrendsData } from "@/lib/data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const bpChartConfig = {
    systolic: {
      label: "Systolic",
      color: "hsl(var(--primary))",
    },
    diastolic: {
      label: "Diastolic",
      color: "hsl(var(--accent))",
    },
} satisfies ChartConfig;

const sugarChartConfig = {
    level: {
        label: "Level",
        color: "hsl(var(--primary))",
    }
} satisfies ChartConfig;

const stepsChartConfig = {
    steps: {
        label: "Steps",
        color: "hsl(var(--primary))",
    }
} satisfies ChartConfig;

export default function ProgressPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-headline text-3xl font-bold">Health Trends</h1>
        <div className="flex items-center gap-2">
            <Tabs defaultValue="week">
                <TabsList>
                    <TabsTrigger value="week">Week</TabsTrigger>
                    <TabsTrigger value="month">Month</TabsTrigger>
                    <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Blood Pressure (mmHg)</CardTitle>
            <CardDescription>Your systolic and diastolic trends for this week.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={bpChartConfig} className="min-h-[300px] w-full">
              <LineChart accessibilityLayer data={healthTrendsData.bloodPressure}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis domain={[60, 140]} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                <Line type="monotone" dataKey="systolic" stroke="var(--color-systolic)" strokeWidth={2} name="Systolic" dot={false} />
                <Line type="monotone" dataKey="diastolic" stroke="var(--color-diastolic)" strokeWidth={2} name="Diastolic" dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Blood Sugar (mg/dL)</CardTitle>
            <CardDescription>Your blood sugar levels over the past week.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={sugarChartConfig} className="min-h-[300px] w-full">
              <AreaChart accessibilityLayer data={healthTrendsData.bloodSugar}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis domain={[80, 130]} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                <defs>
                  <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-level)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="var(--color-level)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="level" stroke="var(--color-level)" fill="url(#colorLevel)" strokeWidth={2} name="Level" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Daily Steps</CardTitle>
            <CardDescription>Your step count over the past week.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={stepsChartConfig} className="min-h-[300px] w-full">
              <BarChart accessibilityLayer data={healthTrendsData.steps}>
                <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="steps" fill="var(--color-steps)" radius={[4, 4, 0, 0]} name="Steps" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
