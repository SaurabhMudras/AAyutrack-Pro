
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockPharmacies } from "@/lib/data";
import { Bike, FileText, Pill } from "lucide-react";
import React, { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { useCollection, useFirebase, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy } from "firebase/firestore";
import type { Prescription } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function OrderMedicinePage() {
    const { toast } = useToast();
    const { user, firestore } = useFirebase();
    const [selectedPrescriptionId, setSelectedPrescriptionId] = useState<string | null>(null);

    const prescriptionsQuery = useMemoFirebase(() => {
        if (!user) return null;
        return query(collection(firestore, 'users', user.uid, 'prescriptions'), orderBy('date', 'desc'));
    }, [user, firestore]);

    const { data: prescriptions, isLoading } = useCollection<Prescription>(prescriptionsQuery);
    
    const selectedPrescription = useMemo(() => {
        if (!selectedPrescriptionId || !prescriptions) return null;
        return prescriptions.find(p => p.id === selectedPrescriptionId) ?? null;
    }, [selectedPrescriptionId, prescriptions]);

    const handleOrder = (pharmacyName: string) => {
        if (!selectedPrescription) return;
        toast({
            title: "Order Placed!",
            description: `Your prescription from Dr. ${selectedPrescription.doctorName} has been sent to ${pharmacyName}.`,
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
                            <CardTitle className="font-headline">Your Prescriptions</CardTitle>
                        </div>
                        <CardDescription>
                            Select a prescription to view its details and order medicines.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isLoading && (
                            <div className="space-y-4">
                                <Skeleton className="h-10 w-full" />
                                <Skeleton className="h-24 w-full" />
                            </div>
                        )}
                        {!isLoading && prescriptions && prescriptions.length > 0 ? (
                           <>
                             <Select onValueChange={setSelectedPrescriptionId} value={selectedPrescriptionId || ""}>
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a prescription..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {prescriptions.map(p => (
                                        <SelectItem key={p.id} value={p.id}>
                                            Prescription from Dr. {p.doctorName} - {new Date(p.date).toLocaleDateString()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            
                            {selectedPrescription && (
                                <div className="space-y-3 rounded-lg border p-4 animate-in fade-in-50">
                                    <h4 className="font-semibold">Medicines to Order:</h4>
                                    {selectedPrescription.medicines.map((med, index) => (
                                        <div key={index}>
                                            <div className="text-sm">
                                                <p className="font-medium">{med.name} <span className="text-muted-foreground">({med.dosage})</span></p>
                                                <p className="text-xs text-muted-foreground">{med.instructions}</p>
                                            </div>
                                            {index < selectedPrescription.medicines.length -1 && <Separator className="my-2"/>}
                                        </div>
                                    ))}
                                </div>
                            )}
                           </>
                        ) : (
                             <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-40 border-2 border-dashed rounded-lg">
                                <FileText className="h-10 w-10 mb-2" />
                                <p className="font-semibold">No prescriptions found.</p>
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
                                    <Button size="sm" onClick={() => handleOrder(pharmacy.name)} disabled={!selectedPrescription}>
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
