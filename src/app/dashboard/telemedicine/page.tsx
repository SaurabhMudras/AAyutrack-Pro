
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockDoctors, mockPharmacies } from "@/lib/data";
import { Video, PhoneOff, Pill, Bike, FileText } from "lucide-react";
import Image from "next/image";
import React, { useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import type { Prescription } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function TelemedicinePage() {
    const [inCall, setInCall] = React.useState(false);
    const [callEnded, setCallEnded] = React.useState(false);
    const { toast } = useToast();
    const { user, firestore } = useFirebase();

    const prescriptionsQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, 'users', user.uid, 'prescriptions'), orderBy('date', 'desc'), limit(1));
    }, [user, firestore]);

    const { data: prescriptions, isLoading } = useCollection<Prescription>(prescriptionsQuery);
    const latestPrescription = useMemo(() => prescriptions?.[0], [prescriptions]);


    const handleEndCall = () => {
        setInCall(false);
        setCallEnded(true);
    }

    const handleOrder = (pharmacyName: string) => {
        toast({
            title: "Order Placed!",
            description: `Your prescription has been sent to ${pharmacyName}. It will be delivered to your doorstep.`,
        })
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="font-headline text-3xl font-bold">Telemedicine</h1>
            </div>
            
            {!inCall && !callEnded && (
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
                        <Button size="lg" className="w-full h-12 text-lg" onClick={() => { setInCall(true); setCallEnded(false); }}>
                            <Video className="mr-2 h-5 w-5"/>
                            Start Video Call
                        </Button>
                    </CardContent>
                </Card>
            )}

            {inCall && (
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
                            <Button size="lg" variant="destructive" className="h-14 w-14 rounded-full" onClick={handleEndCall}>
                                <PhoneOff className="h-6 w-6"/>
                                <span className="sr-only">End Call</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {callEnded && (
                 <div className="grid md:grid-cols-2 gap-6 animate-in fade-in-50">
                    <Card>
                        <CardHeader>
                            <CardTitle className="font-headline">Consultation Ended</CardTitle>
                            <CardDescription>Here's a summary and next steps.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-sm text-muted-foreground">Your consultation with Dr. Evelyn Reed is complete. Your latest prescription is shown opposite, which you can order for delivery.</p>
                            <Button className="w-full" onClick={() => { setInCall(false); setCallEnded(false);}}>
                                Start Another Call
                            </Button>
                             <Card className="mt-4">
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <FileText className="h-5 w-5 text-primary"/>
                                        <CardTitle className="font-headline text-lg">Latest Prescription</CardTitle>
                                    </div>
                                    <CardDescription>From Dr. {latestPrescription?.doctorName} on {latestPrescription ? new Date(latestPrescription.date).toLocaleDateString() : 'N/A'}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                {isLoading && <Skeleton className="h-20 w-full" />}
                                {!isLoading && latestPrescription ? (
                                    latestPrescription.medicines.map((med, index) => (
                                        <div key={index} className="text-sm">
                                            <p className="font-medium">{med.name} <span className="text-muted-foreground">({med.dosage})</span></p>
                                            <p className="text-xs text-muted-foreground">{med.instructions}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground">No recent prescription found.</p>
                                )}
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <div className="flex items-center gap-2">
                                <Pill className="h-6 w-6 text-primary" />
                                <CardTitle className="font-headline">Order Your Prescription</CardTitle>
                            </div>
                            <CardDescription>Get your prescribed medicines delivered from a nearby pharmacy.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {mockPharmacies.map((pharmacy) => (
                                <div key={pharmacy.id} className="p-3 rounded-lg border flex justify-between items-center bg-background">
                                    <div>
                                        <p className="font-semibold">{pharmacy.name}</p>
                                        <p className="text-sm text-muted-foreground">{pharmacy.address}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <p className="text-sm font-medium">{pharmacy.distance}</p>
                                        <Button size="sm" onClick={() => handleOrder(pharmacy.name)} disabled={!latestPrescription}>
                                            <Bike className="mr-2 h-4 w-4"/>
                                            Order
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}
