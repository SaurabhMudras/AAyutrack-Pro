
"use client";

import {
  Activity,
  ArrowUpRight,
  CircleUser,
  Droplets,
  Flame,
  Footprints,
  Pill,
  PlusCircle,
} from "lucide-react";
import Image from "next/image";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
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
  mockUser,
} from "@/lib/data";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip
} from "recharts";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useState, useEffect } from "react";
import AddReminderDialog from "@/components/dashboard/add-reminder-dialog";
import { useCollection, useFirebase, useMemoFirebase, updateDocumentNonBlocking } from "@/firebase";
import { collection, doc, arrayUnion, arrayRemove } from "firebase/firestore";
import { Reminder } from "@/types";
import { format } from "date-fns";
import { textToSpeech } from "@/ai/flows/text-to-speech";

const chartData = [
  { day: "Mon", steps: 5500 },
  { day: "Tue", steps: 7200 },
  { day: "Wed", steps: 6800 },
  { day: "Thu", steps: 9000 },
  { day: "Fri", steps: 8200 },
  { day: "Sat", steps: 11500 },
  { day: "Sun", steps: 8230 },
];

const chartConfig = {
  steps: {
    label: "Steps",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

export default function Dashboard() {
  const [isAddReminderOpen, setIsAddReminderOpen] = useState(false);
  const { user, firestore } = useFirebase();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const remindersQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, "users", user.uid, "reminders");
  }, [user, firestore]);

  const { data: reminderData, isLoading } = useCollection<Reminder>(remindersQuery);

  useEffect(() => {
    if (reminderData) {
        // sort by time
        const sorted = [...reminderData].sort((a, b) => a.time.localeCompare(b.time));
        setReminders(sorted);
    }
  }, [reminderData]);

  const handleReminderCheck = (reminderId: string, isChecked: boolean) => {
    if (!user) return;
    const reminderRef = doc(firestore, "users", user.uid, "reminders", reminderId);
    const today = format(new Date(), "yyyy-MM-dd");
    
    if(isChecked) {
        updateDocumentNonBlocking(reminderRef, {
            completedOn: arrayUnion(today)
        });
    } else {
         updateDocumentNonBlocking(reminderRef, {
            completedOn: arrayRemove(today)
        });
    }
  };

  useEffect(() => {
    const checkReminders = async () => {
      const now = new Date();
      const currentTime = format(now, "HH:mm");
      const today = format(now, "yyyy-MM-dd");

      for (const reminder of reminders) {
        const isRecurringToday = reminder.isRecurring;
        const isScheduledForToday = reminder.date === today;
        const shouldTrigger = isRecurringToday || isScheduledForToday;

        const isCompletedToday = reminder.completedOn?.includes(today);

        if (reminder.time === currentTime && shouldTrigger && !isCompletedToday) {
          const reminderText = `Reminder for ${reminder.title}. ${reminder.details || ''}`;
          
          // Play sound
          const audioDataUri = await textToSpeech(reminderText);
          const newAudio = new Audio(audioDataUri);
          setAudio(newAudio);
          newAudio.play();

          // Show notification
          if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(reminder.title, {
              body: reminder.details || 'It\'s time for your scheduled activity.',
              icon: '/logo.svg', // Optional: you can add an icon
            });
          }
        }
      }
    };

    const interval = setInterval(checkReminders, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminders]);

  useEffect(() => {
    return () => {
      if (audio) {
        audio.pause();
        setAudio(null);
      }
    };
  }, [audio]);

  const today = format(new Date(), "yyyy-MM-dd");

  return (
    <>
      <AddReminderDialog open={isAddReminderOpen} onOpenChange={setIsAddReminderOpen} />
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
            <div className="text-2xl font-bold">{reminders.filter(r => r.type === 'medicine' && r.completedOn?.includes(today)).length}/{reminders.filter(r => r.type === 'medicine').length}</div>
            <p className="text-xs text-muted-foreground">doses taken today</p>
            <Progress value={(reminders.filter(r => r.type === 'medicine' && r.completedOn?.includes(today)).length / reminders.filter(r => r.type === 'medicine').length) * 100} className="mt-4 h-2" />
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
            <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
              <BarChart accessibilityLayer data={chartData}>
                <XAxis dataKey="day" tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis tickLine={false} axisLine={false} stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(value) => `${value/1000}k`} />
                <Tooltip cursor={{fill: 'hsl(var(--secondary))'}} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="steps" fill="var(--color-steps)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center">
             <div className="grid gap-2">
                <CardTitle className="font-headline">Daily Reminders</CardTitle>
                <CardDescription>
                Your scheduled tasks for today.
                </CardDescription>
            </div>
            <Button size="sm" className="ml-auto gap-1" variant="ghost" onClick={() => setIsAddReminderOpen(true)}>
                <PlusCircle className="h-4 w-4" />
                Add
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? <p>Loading reminders...</p> : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-10">Done</TableHead>
                  <TableHead>Reminder</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reminders.map((reminder) => {
                    const isCompleted = reminder.completedOn?.includes(today);
                    const isRecurringToday = reminder.isRecurring;
                    const isScheduledForToday = reminder.date === today;

                    return (
                        (isRecurringToday || isScheduledForToday) &&
                        <TableRow key={reminder.id} className={isCompleted ? "bg-secondary/50 hover:bg-secondary/70" : ""}>
                            <TableCell>
                            <Checkbox 
                                checked={isCompleted}
                                onCheckedChange={(checked) => handleReminderCheck(reminder.id, !!checked)}
                                aria-label={`Mark ${reminder.title} as completed`} 
                            />
                            </TableCell>
                            <TableCell>
                            <div className="font-medium">{reminder.title}</div>
                            <div className="text-xs text-muted-foreground">{reminder.details}</div>
                            </TableCell>
                            <TableCell>{reminder.time}</TableCell>
                        </TableRow>
                    );
                })}
              </TableBody>
            </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
