"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDoctors, mockHospitals } from "@/lib/data";
import { Ambulance, Building, MapPin, Phone, Pill } from "lucide-react";
import Image from "next/image";

export default function EmergencyPage() {
    return (
        <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h1 className="font-headline text-3xl font-bold text-destructive">Emergency Assistance</h1>
            </div>

            <Card className="border-destructive bg-destructive/10">
                <CardHeader>
                    <CardTitle className="font-headline flex items-center gap-2">
                        <Ambulance className="h-6 w-6"/>
                        Immediate Help
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Button size="lg" variant="destructive" className="w-full text-lg font-bold h-14">
                        <Phone className="mr-4 h-6 w-6"/>
                        Call Emergency Services
                    </Button>
                     <p className="text-sm text-center mt-2 text-destructive/80">If you are in a life-threatening situation, call immediately.</p>
                </CardContent>
            </Card>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="font-headline flex items-center gap-2">
                            <Building className="h-5 w-5 text-primary"/>
                            Nearby Hospitals
                        </CardTitle>
                        <CardDescription>Quick access to medical facilities.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {mockHospitals.map(hospital => (
                            <div key={hospital.id} className="p-3 rounded-lg border flex justify-between items-center bg-background">
                                <div>
                                    <p className="font-semibold">{hospital.name}</p>
                                    <p className="text-sm text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3"/>{hospital.address}</p>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                     <p className="text-sm font-medium">{hospital.distance}</p>
                                     <Button variant="outline" size="sm">
                                        <Phone className="mr-2 h-4 w-4"/>
                                        Call
                                     </Button>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                         <CardTitle className="font-headline flex items-center gap-2">
                            <Pill className="h-5 w-5 text-primary"/>
                            Pharmacies & Doctors
                        </CardTitle>
                        <CardDescription>Contact your doctors or find a pharmacy.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {mockDoctors.map(doctor => (
                            <div key={doctor.id} className="p-3 rounded-lg border flex justify-between items-center bg-background">
                                <div className="flex items-center gap-3">
                                    <Image src={doctor.avatarUrl} alt={doctor.name} width={40} height={40} className="rounded-full" />
                                    <div>
                                        <p className="font-semibold">{doctor.name}</p>
                                        <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                                    </div>
                                </div>
                                 <Button variant="outline" size="sm">
                                    <Phone className="mr-2 h-4 w-4"/>
                                    Contact
                                 </Button>
                            </div>
                        ))}
                         <Button variant="secondary" className="w-full">Find a 24/7 Pharmacy</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
