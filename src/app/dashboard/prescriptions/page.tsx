
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useCollection, useFirebase, useMemoFirebase } from '@/firebase';
import type { Prescription } from '@/types';
import { collection } from 'firebase/firestore';
import { ClipboardType, PlusCircle, Stethoscope } from 'lucide-react';
import AddPrescriptionDialog from '@/components/dashboard/add-prescription-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';

export default function PrescriptionsPage() {
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const { user, firestore } = useFirebase();

  const prescriptionsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'users', user.uid, 'prescriptions');
  }, [user, firestore]);

  const { data: prescriptions, isLoading } = useCollection<Prescription>(prescriptionsQuery);

  return (
    <>
      <AddPrescriptionDialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen} />
      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="font-headline text-3xl font-bold">My Prescriptions</h1>
          <Button onClick={() => setAddDialogOpen(true)}>
            <PlusCircle className="mr-2" />
            Add Prescription
          </Button>
        </div>

        {isLoading && (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-6 w-1/2" />
                            <Skeleton className="h-4 w-1/3" />
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-4 w-4/5" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        )}

        {!isLoading && prescriptions && prescriptions.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {prescriptions.sort((a,b) => b.date.localeCompare(a.date)).map((prescription) => (
              <Card key={prescription.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="font-headline flex items-center gap-2">
                        <Stethoscope className="h-5 w-5 text-primary" />
                        {prescription.doctorName}
                      </CardTitle>
                      <CardDescription>
                        Issued on: {new Date(prescription.date).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    {prescription.doctorId === 'self' && (
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">Manually Added</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow space-y-3">
                  <p className="font-semibold text-sm">Medicines:</p>
                  <div className="space-y-3">
                    {prescription.medicines.map((med, index) => (
                      <div key={index}>
                        <div className="font-medium">{med.name} <span className="text-muted-foreground text-xs">({med.dosage})</span></div>
                        <p className="text-sm text-muted-foreground">{med.instructions}</p>
                         {index < prescription.medicines.length - 1 && <Separator className="mt-3" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && (!prescriptions || prescriptions.length === 0) && (
          <div className="flex flex-col items-center justify-center text-center text-muted-foreground h-64 border-2 border-dashed rounded-lg">
            <ClipboardType className="h-12 w-12 mb-4" />
            <p className="font-semibold">No prescriptions found.</p>
            <p className="text-sm">Click "Add Prescription" to add one manually.</p>
          </div>
        )}
      </div>
    </>
  );
}
