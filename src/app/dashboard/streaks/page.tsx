
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockStreaks } from "@/lib/data";
import { Flame, Medal, Target, Award, Gem } from "lucide-react";
import React from "react";

export default function StreaksPage() {
    const dailyStreak = mockStreaks.find(s => s.id === 'daily_checkin');
    const medStreak = mockStreaks.find(s => s.id === 'medication_adherence');

    const getAchievement = (streak: number) => {
        if (streak >= 91) return { title: 'Diamond', icon: Gem, color: 'text-cyan-400' };
        if (streak >= 31) return { title: 'Gold', icon: Award, color: 'text-yellow-500' };
        if (streak >= 11) return { title: 'Silver', icon: Award, color: 'text-slate-400' };
        if (streak >= 1) return { title: 'Bronze', icon: Award, color: 'text-orange-400' };
        return null;
    }

    const StreakCard = ({ streak }: { streak: (typeof mockStreaks)[0] | undefined }) => {
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

    return (
        <div className="flex flex-col gap-6">
             <div className="flex items-center justify-between">
                <h1 className="font-headline text-3xl font-bold">Your Streaks</h1>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                <StreakCard streak={dailyStreak} />
                <StreakCard streak={medStreak} />
            </div>
        </div>
    );
}
