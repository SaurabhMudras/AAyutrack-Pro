
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Medal, Target, Award, Gem } from "lucide-react";
import React, { useMemo } from "react";
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection } from "firebase/firestore";
import type { Reminder } from "@/types";
import { isSameDay, subDays, format, parse } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

type Streak = {
    id: 'daily_checkin' | 'medication_adherence';
    name: string;
    currentStreak: number;
    longestStreak: number; // This would need to be stored in Firestore to be persisted
    goal: number;
};

const getAchievement = (streak: number) => {
    if (streak >= 91) return { title: 'Diamond', icon: Gem, color: 'text-cyan-400' };
    if (streak >= 31) return { title: 'Gold', icon: Award, color: 'text-yellow-500' };
    if (streak >= 11) return { title: 'Silver', icon: Award, color: 'text-slate-400' };
    if (streak >= 1) return { title: 'Bronze', icon: Award, color: 'text-orange-400' };
    return null;
}

const calculateStreak = (reminders: Reminder[], type: 'all' | 'medicine'): number => {
    if (!reminders || reminders.length === 0) return 0;

    const relevantReminders = type === 'medicine' ? reminders.filter(r => r.type === 'medicine') : reminders;
    if (relevantReminders.length === 0 && type === 'medicine') return 0;

    let streak = 0;
    let checkDate = new Date();

    const uniqueCompletedDates = [...new Set(reminders.flatMap(r => r.completedOn || []))];
    const parsedCompletedDates = uniqueCompletedDates.map(d => parse(d, 'yyyy-MM-dd', new Date()));

    const dailyScheduledReminders = (date: Date): Reminder[] => {
        const dateStr = format(date, 'yyyy-MM-dd');
        return relevantReminders.filter(r => r.isRecurring || r.date === dateStr);
    };
    
    const wereAllTasksCompletedOn = (date: Date): boolean => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const tasksForDay = dailyScheduledReminders(date);
        if (tasksForDay.length === 0) return true; // Or false if you require at least one task
        
        return tasksForDay.every(task => task.completedOn?.includes(dateStr));
    };

    const wasAtLeastOneTaskCompletedOn = (date: Date): boolean => {
         return parsedCompletedDates.some(completedDate => isSameDay(date, completedDate));
    }

    // Check today first, then go backwards
    const firstCheckDate = new Date();
    const tasksForToday = dailyScheduledReminders(firstCheckDate);
    const allTodayCompleted = type === 'medicine' ? wereAllTasksCompletedOn(firstCheckDate) : wasAtLeastOneTaskCompletedOn(firstCheckDate);

    if (allTodayCompleted || (tasksForToday.length === 0 && type === 'medicine')) {
        streak = 1;
        checkDate = subDays(checkDate, 1);
    } else {
        // If today's tasks are not complete, check if yesterday's were.
        const yesterday = subDays(new Date(), 1);
        const tasksForYesterday = dailyScheduledReminders(yesterday);
        const allYesterdayCompleted = type === 'medicine' ? wereAllTasksCompletedOn(yesterday) : wasAtLeastOneTaskCompletedOn(yesterday);

        if (allYesterdayCompleted || (tasksForYesterday.length === 0 && type === 'medicine')) {
            streak = 1;
            checkDate = subDays(yesterday, 1);
        } else {
            return 0;
        }
    }


    while (true) {
        const tasksForDate = dailyScheduledReminders(checkDate);
        const allTasksCompleted = type === 'medicine' ? wereAllTasksCompletedOn(checkDate) : wasAtLeastOneTaskCompletedOn(checkDate);
        
        if (allTasksCompleted || (tasksForDate.length === 0 && type === 'medicine')) {
            streak++;
            checkDate = subDays(checkDate, 1);
        } else {
            break;
        }
    }

    return streak;
};


const StreakCard = ({ streak }: { streak: Streak | undefined }) => {
    if (!streak) return null;

    const achievement = getAchievement(streak.currentStreak);
    const cardBorderColor = streak.id === 'daily_checkin' ? 'border-accent/50 hover:border-accent' : 'border-primary/50 hover:border-primary';
    const textColor = streak.id === 'daily_checkin' ? 'text-accent' : 'text-primary';
    const progressBg = streak.id === 'daily_checkin' ? '[&>div]:bg-accent' : '';

    return (
        <Card className={`${cardBorderColor} transition-colors`}>
            <CardHeader>
                <div className="flex items-center gap-3">
                    <Flame className={`h-8 w-8 ${textColor}`}/>
                    <div>
                        <CardTitle className="font-headline text-2xl">{streak.name}</CardTitle>
                        <CardDescription>Keep up your consistency!</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex justify-around items-center">
                    <div className="text-center">
                        <p className={`text-5xl font-bold ${textColor}`}>{streak.currentStreak}</p>
                        <p className="text-muted-foreground">day streak</p>
                    </div>
                    {achievement && (
                         <div className="text-center">
                            <achievement.icon className={`h-12 w-12 mx-auto ${achievement.color}`} />
                            <p className={`text-xl font-bold ${achievement.color}`}>{achievement.title}</p>
                         </div>
                    )}
                </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                            <Medal className="h-5 w-5 text-muted-foreground"/>
                            <span>Longest Streak: <strong>{streak.longestStreak} days</strong></span>
                        </div>
                        <div className="flex items-center gap-2">
                             <Target className="h-5 w-5 text-muted-foreground"/>
                             <span>Next Goal: <strong>{streak.goal} days</strong></span>
                        </div>
                    </div>
                    <Progress value={(streak.currentStreak / streak.goal) * 100} className={`h-3 ${progressBg}`} />
                 </div>
            </CardContent>
        </Card>
    )
}

export default function StreaksPage() {
    const { user, firestore } = useFirebase();

    const remindersQuery = useMemoFirebase(() => {
        if (!user) return null;
        return collection(firestore, 'users', user.uid, 'reminders');
    }, [user, firestore]);

    const { data: reminders, isLoading } = useCollection<Reminder>(remindersQuery);
    
    const streaks: Streak[] | null = useMemo(() => {
        if (!reminders) return null;
        return [
            {
                id: "daily_checkin",
                name: "Daily Activity Log",
                currentStreak: calculateStreak(reminders, 'all'),
                longestStreak: 25, // Note: Longest streak should be stored in Firestore
                goal: 14,
            },
            {
                id: "medication_adherence",
                name: "Medication Adherence",
                currentStreak: calculateStreak(reminders, 'medicine'),
                longestStreak: 34, // Note: Longest streak should be stored in Firestore
                goal: 30,
            }
        ]
    }, [reminders]);

    const dailyStreak = streaks?.find(s => s.id === 'daily_checkin');
    const medStreak = streaks?.find(s => s.id === 'medication_adherence');


    return (
        <div className="flex flex-col gap-6">
             <div className="flex items-center justify-between">
                <h1 className="font-headline text-3xl font-bold">Your Streaks</h1>
            </div>
            {isLoading && (
                 <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader><Skeleton className="h-10 w-2/3" /></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-around items-center">
                                <Skeleton className="h-20 w-24" />
                                <Skeleton className="h-20 w-24" />
                            </div>
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader><Skeleton className="h-10 w-2/3" /></CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex justify-around items-center">
                                <Skeleton className="h-20 w-24" />
                                <Skeleton className="h-20 w-24" />
                            </div>
                            <Skeleton className="h-10 w-full" />
                        </CardContent>
                    </Card>
                </div>
            )}
            {!isLoading && streaks && (
                <div className="grid gap-6 md:grid-cols-2 animate-in fade-in-50">
                    <StreakCard streak={dailyStreak} />
                    <StreakCard streak={medStreak} />
                </div>
            )}
        </div>
    );
}
