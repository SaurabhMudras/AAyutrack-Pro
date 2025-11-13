
'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useFirebase, addDocumentNonBlocking } from '@/firebase';
import { collection, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { Separator } from '../ui/separator';

const medicineSchema = z.object({
  name: z.string().min(1, 'Medicine name is required.'),
  dosage: z.string().min(1, 'Dosage is required.'),
  instructions: z.string().min(1, 'Instructions are required.'),
});

const prescriptionSchema = z.object({
  doctorName: z.string().min(1, "Doctor's name is required."),
  date: z.string().min(1, 'Date is required.'),
  medicines: z.array(medicineSchema).min(1, 'At least one medicine is required.'),
});

type PrescriptionFormValues = z.infer<typeof prescriptionSchema>;

interface AddPrescriptionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddPrescriptionDialog({ open, onOpenChange }: AddPrescriptionDialogProps) {
  const { toast } = useToast();
  const { user, firestore } = useFirebase();

  const form = useForm<PrescriptionFormValues>({
    resolver: zodResolver(prescriptionSchema),
    defaultValues: {
      doctorName: 'Self-Added',
      date: format(new Date(), 'yyyy-MM-dd'),
      medicines: [{ name: '', dosage: '', instructions: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'medicines',
  });

  const onSubmit = (data: PrescriptionFormValues) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Not Authenticated',
        description: 'You must be logged in to add a prescription.',
      });
      return;
    }

    const prescriptionData = {
      ...data,
      patientId: user.uid,
      doctorId: 'self', // For manually added prescriptions
      createdAt: serverTimestamp(),
    };

    const prescriptionsCollection = collection(firestore, 'users', user.uid, 'prescriptions');
    addDocumentNonBlocking(prescriptionsCollection, prescriptionData);

    toast({
      title: 'Prescription Added',
      description: 'Your new prescription has been saved.',
    });
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline">Add New Prescription</DialogTitle>
          <DialogDescription>
            Manually enter the details of a prescription.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="doctorName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Prescribed By</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Dr. Evelyn Reed or Self-Added" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Prescription</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />

            <div>
              <Label className="text-lg font-medium">Medicines</Label>
              {fields.map((field, index) => (
                <div key={field.id} className="mt-4 p-4 border rounded-lg relative space-y-4">
                   {fields.length > 1 && (
                     <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 text-destructive"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                   )}
                  <FormField
                    control={form.control}
                    name={`medicines.${index}.name`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Medicine Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Atorvastatin" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`medicines.${index}.dosage`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dosage</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 40mg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`medicines.${index}.instructions`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instructions</FormLabel>
                        <FormControl>
                          <Textarea placeholder="e.g., Take one tablet daily at bedtime" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-4"
                onClick={() => append({ name: '', dosage: '', instructions: '' })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Another Medicine
              </Button>
            </div>

            <DialogFooter>
              <Button type="submit">Save Prescription</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
