"use client";

import {
  Activity,
  ArrowUpRight,
  CircleUser,
  Droplets,
  Flame,
  Footprints,
  Pill,
} from "lucide-react";
import Image from "next/image";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/componentsui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import {
  healthMetrics,
  mockDoctors,
  mockMedicationSchedule,
  mockUser,
} from "@/lib/data";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ChartTooltipContent } from "@/components/ui/chart";

const chartData = [
  { day: "Mon", steps: 5500 },
  { day: "Tue", steps: 7200 },
  { day: "Wed", steps: 6800 },
  { day: "Thu", steps: 9000 },
  { day: "Fri", steps: 8200 },
  { day: "Sat", steps: 11500 },
  { day: "Sun", steps: 8230 },
];

export default function Dashboard() {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card className="hover:border-primary/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Steps</CardTitle>
            <Footprints className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthMetrics.steps.current.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Goal: {healthMetrics.steps.goal.toLocaleString()} steps
            </p>
            <Progress value={(healthMetrics.steps.current / healthMetrics.steps.goal) * 100} className="mt-4 h-2" />
          </CardContent>
        </Card>
        <Card className="hover:border-primary/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hydration</CardTitle>
            <Droplets className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthMetrics.hydration.current} L</div>
            <p className="text-xs text-muted-foreground">
              Goal: {healthMetrics.hydration.goal.toFixed(1)} L
            </p>
            <Progress value={(healthMetrics.hydration.current / healthMetrics.hydration.goal) * 100} className="mt-4 h-2" />
          </CardContent>
        </Card>
        <Card className="hover:border-primary/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Medication</CardTitle>
            <Pill className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{healthMetrics.medication.taken}/{healthMetrics.medication.total}</div>
            <p className="text-xs text-muted-foreground">doses taken today</p>
            <Progress value={(healthMetrics.medication.taken / healthMetrics.medication.total) * 100} className="mt-4 h-2" />
          </CardContent>
        </Card>
        <Card className="bg-accent/50 border-accent hover:border-accent/80 transition-colors">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Daily Streak</CardTitle>
            <Flame className="h-5 w-5 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 Days</div>
            <p className="text-xs text-muted-foreground">Keep it up for a new record!</p>
            <div className="mt-4 h-2" />
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle className="font-headline">This Week's Activity</CardTitle>
              <CardDescription>
                Summary of your steps over the last 7 days.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/dashboard/progress">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip cursor={{fill: 'hsl(var(--secondary))'}} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="steps" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Medication Schedule</CardTitle>
            <CardDescription>
              Your prescribed medications for today.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">Done</TableHead>
                  <TableHead>Medicine</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMedicationSchedule.map((med) => (
                  <TableRow key={med.id} className={med.taken ? "bg-secondary/50 hover:bg-secondary/70" : ""}>
                    <TableCell>
                      <Checkbox checked={med.taken} aria-label={`Mark ${med.name} as taken`} />
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{med.name}</div>
                      <div className="text-xs text-muted-foreground">{med.dosage}</div>
                    </TableCell>
                    <TableCell>{med.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
