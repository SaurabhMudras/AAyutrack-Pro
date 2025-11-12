"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockStreaks } from "@/lib/data";
import { Flame, Medal, Target } from "lucide-react";

export default function StreaksPage() {
    const dailyStreak = mockStreaks.find(s => s.id === 'daily_checkin');
    const medStreak = mockStreaks.find(s => s.id === 'medication_adherence');

    return (
        <div className="flex flex-col gap-6">
             <div className="flex items-center justify-between">
                <h1 className="font-headline text-3xl font-bold">Your Streaks</h1>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
                {dailyStreak && (
                    <Card className="border-accent/50 hover:border-accent transition-colors">
                        <CardHeader>
                            <div className="flex items-center gap-3">
                                <Flame className="h-8 w-8 text-accent"/>
                                <div>
                                    <CardTitle className="font-headline text-2xl">{dailyStreak.name}</CardTitle>
                                    <CardDescription>Keep logging your health data daily.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center">
                                <p className="text-5xl font-bold text-accent">{dailyStreak.currentStreak}</p>
                                <p className="text-muted-foreground">day streak</p>
                            </div>
                             <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <Medal className="h-5 w-5 text-muted-foreground"/>
                                    <span>Longest Streak: <strong>{dailyStreak.longestStreak} days</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                     <Target className="h-5 w-5 text-muted-foreground"/>
                                     <span>Next Goal: <strong>{dailyStreak.goal} days</strong></span>
                                </div>
                            </div>
                            <Progress value={(dailyStreak.currentStreak / dailyStreak.goal) * 100} className="h-3 [&>div]:bg-accent" />
                        </CardContent>
                    </Card>
                )}
                {medStreak && (
                    <Card className="border-primary/50 hover:border-primary transition-colors">
                        <CardHeader>
                             <div className="flex items-center gap-3">
                                <Flame className="h-8 w-8 text-primary"/>
                                <div>
                                    <CardTitle className="font-headline text-2xl">{medStreak.name}</CardTitle>
                                    <CardDescription>Stay consistent with your medications.</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-center">
                                <p className="text-5xl font-bold text-primary">{medStreak.currentStreak}</p>
                                <p className="text-muted-foreground">day streak</p>
                            </div>
                             <div className="flex justify-between items-center text-sm">
                                <div className="flex items-center gap-2">
                                    <Medal className="h-5 w-5 text-muted-foreground"/>
                                    <span>Longest Streak: <strong>{medStreak.longestStreak} days</strong></span>
                                </div>
                                <div className="flex items-center gap-2">
                                     <Target className="h-5 w-5 text-muted-foreground"/>
                                     <span>Next Goal: <strong>{medStreak.goal} days</strong></span>
                                </div>
                            </div>
                            <Progress value={(medStreak.currentStreak / medStreak.goal) * 100} className="h-3" />
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
