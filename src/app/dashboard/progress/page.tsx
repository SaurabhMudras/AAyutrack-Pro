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
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts";
import { ChartTooltipContent } from "@/components/ui/chart";

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
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={healthTrendsData.bloodPressure}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis domain={[60, 140]} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                <Line type="monotone" dataKey="systolic" stroke="hsl(var(--primary))" strokeWidth={2} name="Systolic" />
                <Line type="monotone" dataKey="diastolic" stroke="hsl(var(--accent))" strokeWidth={2} name="Diastolic" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Blood Sugar (mg/dL)</CardTitle>
            <CardDescription>Your blood sugar levels over the past week.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={healthTrendsData.bloodSugar}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis domain={[80, 130]} tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                <defs>
                  <linearGradient id="colorLevel" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <Area type="monotone" dataKey="level" stroke="hsl(var(--primary))" fill="url(#colorLevel)" strokeWidth={2} name="Level" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="font-headline">Daily Steps</CardTitle>
            <CardDescription>Your step count over the past week.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={healthTrendsData.steps}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="steps" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Steps" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
