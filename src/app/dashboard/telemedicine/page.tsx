"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockDoctors } from "@/lib/data";
import { Video, PhoneOff } from "lucide-react";
import Image from "next/image";
import React from "react";

export default function TelemedicinePage() {
    const [inCall, setInCall] = React.useState(false);

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="font-headline text-3xl font-bold">Telemedicine</h1>
            </div>
            
            {!inCall ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">Start a Consultation</CardTitle>
                        <CardDescription>Connect with your doctor via video call.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Select a Doctor</label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a doctor for your consultation" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mockDoctors.map(doctor => (
                                        <SelectItem key={doctor.id} value={doctor.id}>
                                            <div className="flex items-center gap-2">
                                                <Image src={doctor.avatarUrl} alt={doctor.name} width={24} height={24} className="rounded-full" />
                                                {doctor.name} - {doctor.specialty}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button size="lg" className="w-full h-12 text-lg" onClick={() => setInCall(true)}>
                            <Video className="mr-2 h-5 w-5"/>
                            Start Video Call
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline">In Call with Dr. Evelyn Reed</CardTitle>
                        <CardDescription>Time elapsed: 00:34</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-video bg-black rounded-lg flex items-center justify-center text-white">
                            Video feed would be here.
                        </div>
                        <div className="flex justify-center mt-6">
                            <Button size="lg" variant="destructive" className="h-14 w-14 rounded-full" onClick={() => setInCall(false)}>
                                <PhoneOff className="h-6 w-6"/>
                                <span className="sr-only">End Call</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
