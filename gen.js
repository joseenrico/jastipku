const fs = require('fs');
const code = `"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plane, Calendar, MapPin, DollarSign, Package } from "lucide-react";
import { toast } from "sonner";

export function NewTripDialog({ open, onOpenChange, jastiperId, onSuccess }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [destination, setDestination] = useState("");
  const [country, setCountry] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const [fee, setFee] = useState("10");

  const resetForm = () => {
    setDestination(""); setCountry(""); setCategory(""); setDescription("");
    setDepartureDate(""); setReturnDate(""); setMaxWeight(""); setFee("10");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!destination || !country || !category || !description) { toast.error("Fill all fields"); return; }
    if (!departureDate || !returnDate) { toast.error("Select dates"); return; }
    if (!maxWeight || !fee) { toast.error("Fill weight and fee"); return; }
    const dep = new Date(departureDate), ret = new Date(returnDate);
    if (dep >= ret) { toast.error("Return must be after departure"); return; }
    setIsSubmitting(true);
    const trip = { id: "trip"+Date.now(), jastiperId, destination, country, slug: country.toLowerCase()+"-"+Date.now(), departureDate, returnDate, status: "open", category, description, maxWeight: maxWeight+"kg", fee: fee+"%", cities: [] };
    try {
      const trips = JSON.parse(localStorage.getItem("trips")||"[]");
      trips.push(trip);
      localStorage.setItem("trips", JSON.stringify(trips));
      toast.success("Trip created: "+destination);
      resetForm(); onSuccess?.(); onOpenChange(false);
    } catch(err) { toast.error("Failed"); }
    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-black"><Plane className="h-6 w-6 text-primary"/>Start New Trip</DialogTitle>
          <DialogDescription>Create a new shopping trip</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Trip Details</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Destination</Label><Input value={destination} onChange={e=>setDestination(e.target.value)} className="rounded-xl h-11" required/></div>
              <div className="space-y-2"><Label>Country</Label><Input value={country} onChange={e=>setCountry(e.target.value)} className="rounded-xl h-11" required/></div>
            </div>
            <div className="space-y-2"><Label>Category</Label><Input value={category} onChange={e=>setCategory(e.target.value)} className="rounded-xl h-11" required/></div>
            <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={e=>setDescription(e.target.value)} className="rounded-xl min-h-[80px]" required/></div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground"><Calendar className="h-4 w-4 inline mr-1"/>Travel Dates</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Departure</Label><Input type="date" value={departureDate} onChange={e=>setDepartureDate(e.target.value)} className="rounded-xl h-11" required/></div>
              <div className="space-y-2"><Label>Return</Label><Input type="date" value={returnDate} onChange={e=>setReturnDate(e.target.value)} className="rounded-xl h-11" required/></div>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-muted-foreground"><DollarSign className="h-4 w-4 inline mr-1"/>Capacity & Fees</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2"><Label>Max Weight (kg)</Label><Input type="number" value={maxWeight} onChange={e=>setMaxWeight(e.target.value)} className="rounded-xl h-11" min="1" required/></div>
              <div className="space-y-2"><Label>Service Fee (%)</Label><Input type="number" value={fee} onChange={e=>setFee(e.target.value)} className="rounded-xl h-11" min="1" max="50" required/></div>
            </div>
          </div>
          <DialogFooter className="gap-2 pt-4">
            <Button type="button" variant="outline" onClick={()=>onOpenChange(false)} className="rounded-xl h-11 font-bold" disabled={isSubmitting}>Cancel</Button>
            <Button type="submit" className="rounded-xl h-11 font-bold bg-primary text-white" disabled={isSubmitting}>{isSubmitting?"Creating...":"Create Trip"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
`;
fs.writeFileSync('c:/Users/JoseEnricoMarkusNapi/apps/CMP/Alibaba-AI/jastipku/src/components/NewTripDialog.tsx', code);
console.log('Created NewTripDialog.tsx');