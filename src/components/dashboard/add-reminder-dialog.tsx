
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { Calendar as CalendarIcon, PersonStanding, Pill } from "lucide-react";
import { useFirebase, addDocumentNonBlocking } from "@/firebase";
import { collection, serverTimestamp } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "../ui/switch";

type ReminderType = "medicine" | "appointment" | "exercise";

interface AddReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddReminderDialog({
  open,
  onOpenChange,
}: AddReminderDialogProps) {
  const { toast } = useToast();
  const { user, firestore } = useFirebase();
  const [reminderType, setReminderType] =
    useState<ReminderType>("medicine");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!user) {
        toast({
            variant: "destructive",
            title: "Not Authenticated",
            description: "You must be logged in to add a reminder.",
        });
        return;
    }
    
    const formData = new FormData(e.currentTarget);
    const data: Record<string, any> = {
        patientId: user.uid,
        type: reminderType,
        title: formData.get('title'),
        time: formData.get('time'),
        isRecurring: formData.get('isRecurring') === 'on',
        createdAt: serverTimestamp(),
        completedOn: [],
    };

    if (reminderType === 'medicine') {
        data.details = formData.get('dosage');
    } else if (reminderType === 'appointment') {
        data.details = formData.get('doctor');
        data.date = formData.get('date');
    } else if (reminderType === 'exercise') {
        data.details = `${formData.get('duration')} minutes`;
    }

    const remindersCollection = collection(firestore, 'users', user.uid, 'reminders');
    addDocumentNonBlocking(remindersCollection, data);

    toast({
        title: "Reminder Added",
        description: `Your ${reminderType} reminder has been set.`,
    });
    onOpenChange(false);
  }

  const renderFormFields = () => {
    switch (reminderType) {
      case "medicine":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Medicine Name</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., Metformin"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input name="dosage" id="dosage" placeholder="e.g., 500mg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input name="time" id="time" type="time" required />
              </div>
            </div>
            <div className="flex items-center space-x-2">
                <Switch id="isRecurring" name="isRecurring" defaultChecked/>
                <Label htmlFor="isRecurring">Recurring Daily</Label>
            </div>
          </>
        );
      case "appointment":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Appointment Title</Label>
               <Input
                id="title"
                name="title"
                placeholder="e.g., Follow-up"
                required
              />
            </div>
             <div className="space-y-2">
                <Label htmlFor="doctor">Doctor</Label>
                <Input name="doctor" id="doctor" placeholder="e.g., Dr. Evelyn Reed" />
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input name="date" id="date" type="date" required />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="time">Time</Label>
                    <Input name="time" id="time" type="time" required />
                </div>
            </div>
          </>
        );
      case "exercise":
        return (
            <>
                <div className="space-y-2">
                    <Label htmlFor="title">Exercise Type</Label>
                    <Input name="title" id="title" placeholder="e.g., Morning Walk" required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input name="duration" id="duration" type="number" placeholder="30" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="time">Time</Label>
                        <Input name="time" id="time" type="time" required />
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <Switch id="isRecurring" name="isRecurring" defaultChecked/>
                    <Label htmlFor="isRecurring">Recurring Daily</Label>
                </div>
            </>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
            <DialogHeader>
            <DialogTitle className="font-headline">Add a Reminder</DialogTitle>
            <DialogDescription>
                Set a reminder for your health activities.
            </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
            <div className="space-y-2">
                <Label>Reminder Type</Label>
                <div className="grid grid-cols-3 gap-2">
                    <Button type="button" variant={reminderType === 'medicine' ? 'secondary' : 'outline'} onClick={() => setReminderType('medicine')}>
                        <Pill className="mr-2 h-4 w-4" /> Medicine
                    </Button>
                    <Button type="button" variant={reminderType === 'appointment' ? 'secondary' : 'outline'} onClick={() => setReminderType('appointment')}>
                        <CalendarIcon className="mr-2 h-4 w-4" /> Visit
                    </Button>
                    <Button type="button" variant={reminderType === 'exercise' ? 'secondary' : 'outline'} onClick={() => setReminderType('exercise')}>
                        <PersonStanding className="mr-2 h-4 w-4" /> Exercise
                    </Button>
                </div>
            </div>
            {renderFormFields()}
            </div>
            <DialogFooter>
            <Button type="submit" className="w-full">Add Reminder</Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
