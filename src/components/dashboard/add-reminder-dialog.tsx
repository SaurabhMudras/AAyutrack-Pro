
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

type ReminderType = "medicine" | "appointment" | "exercise";

interface AddReminderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AddReminderDialog({
  open,
  onOpenChange,
}: AddReminderDialogProps) {
  const [reminderType, setReminderType] =
    useState<ReminderType>("medicine");

  const renderFormFields = () => {
    switch (reminderType) {
      case "medicine":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="medicine-name">Medicine Name</Label>
              <Input
                id="medicine-name"
                placeholder="e.g., Metformin"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosage</Label>
                <Input id="dosage" placeholder="e.g., 500mg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input id="time" type="time" />
              </div>
            </div>
          </>
        );
      case "appointment":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="doctor-name">Doctor</Label>
               <Select>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a doctor" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="dr-reed">Dr. Evelyn Reed</SelectItem>
                        <SelectItem value="dr-carter">Dr. Ben Carter</SelectItem>
                    </SelectContent>
                </Select>
            </div>
             <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="appointment-date">Date</Label>
                    <Input id="appointment-date" type="date" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="appointment-time">Time</Label>
                    <Input id="appointment-time" type="time" />
                </div>
            </div>
            <div className="space-y-2">
                <Label htmlFor="appointment-notes">Notes</Label>
                <Textarea id="appointment-notes" placeholder="e.g., Follow-up for blood pressure check" />
            </div>
          </>
        );
      case "exercise":
        return (
            <>
                <div className="space-y-2">
                    <Label htmlFor="exercise-type">Exercise Type</Label>
                    <Input id="exercise-type" placeholder="e.g., Morning Walk" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input id="duration" type="number" placeholder="30" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="exercise-time">Time</Label>
                        <Input id="exercise-time" type="time" />
                    </div>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="exercise-notes">Notes</Label>
                    <Textarea id="exercise-notes" placeholder="e.g., Walk in the park" />
                </div>
            </>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
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
                <Button variant={reminderType === 'medicine' ? 'secondary' : 'outline'} onClick={() => setReminderType('medicine')}>
                    <Pill className="mr-2 h-4 w-4" /> Medicine
                </Button>
                 <Button variant={reminderType === 'appointment' ? 'secondary' : 'outline'} onClick={() => setReminderType('appointment')}>
                    <CalendarIcon className="mr-2 h-4 w-4" /> Visit
                </Button>
                 <Button variant={reminderType === 'exercise' ? 'secondary' : 'outline'} onClick={() => setReminderType('exercise')}>
                    <PersonStanding className="mr-2 h-4 w-4" /> Exercise
                </Button>
            </div>
          </div>
          {renderFormFields()}
        </div>
        <DialogFooter>
          <Button type="submit" className="w-full">Add Reminder</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
