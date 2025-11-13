
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPharmacies } from "@/lib/data";
import { Bike, FileText, Pill } from "lucide-react";
import React, { useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import type { Prescription } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function OrderMedicinePage() {
    const { toast } = useToast();
    const { user, firestore } = useFirebase();

    const prescriptionsQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, 'users', user.uid, 'prescriptions'), orderBy('date', 'desc'), limit(1));
    }, [user, firestore]);

    const { data: prescriptions, isLoading } = useCollection<Prescription>(prescriptionsQuery);
    const latestPrescription = useMemo(() => prescriptions?.[0], [prescriptions]);

    const handleOrder = (pharmacyName: string) => {
        toast({
            title: "Order Placed!",
            description: `Your prescription has been sent to ${pharmacyName}. It will be delivered to your doorstep.`,
        })
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="font-headline text-3xl font-bold">Order Medicine</h1>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <FileText className="h-6 w-6 text-primary"/>
                            <CardTitle className="font-headline">Your Latest Prescription</CardTitle>
                        </div>
                        <CardDescription>
                            This is the most recent prescription found in your records.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoading && <Skeleton className="h-24 w-full" />}
                        {!isLoading && latestPrescription ? (
                            <div>
                                <p className="text-sm text-muted-foreground mb-3">From Dr. {latestPrescription.doctorName} on {new Date(latestPrescription.date).toLocaleDateString()}</p>
                                <div className="space-y-3 rounded-lg border p-4">
                                {latestPrescription.medicines.map((med, index) => (
                                    <div key={index} className="text-sm">
                                        <p className="font-medium">{med.name} <span className="text-muted-foreground">({med.dosage})</span></p>
                                        <p className="text-xs text-muted-foreground">{med.instructions}</p>
                                    </div>
                                ))}
                                </div>
                            </div>
                        ) : (
                             <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-40 border-2 border-dashed rounded-lg">
                                <FileText className="h-10 w-10 mb-2" />
                                <p className="font-semibold">No prescription found.</p>
                                <p className="text-sm">Add a prescription from the "My Prescriptions" page.</p>
                             </div>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Pill className="h-6 w-6 text-primary" />
                            <CardTitle className="font-headline">Order for Delivery</CardTitle>
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
                                    <Button size="sm" onClick={() => handleOrder(pharmacy.name)} disabled={!latestPrescription || isLoading}>
                                        <Bike className="mr-2 h-4 w-4"/>
                                        Order
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
