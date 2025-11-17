import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, Video, MapPin, Phone, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function Appointments() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    doctor: '',
    date: '',
    time: '',
    type: 'in-person',
  });

  // TODO: Remove mock data - fetch from API
  const upcomingAppointments = [
    {
      id: 1,
      doctor: 'Dr. Sarah Smith',
      specialty: 'Cardiologist',
      date: 'Nov 20, 2025',
      time: '10:00 AM',
      type: 'virtual',
      avatar: 'SS',
    },
    {
      id: 2,
      doctor: 'Dr. Michael Chen',
      specialty: 'General Practitioner',
      date: 'Nov 25, 2025',
      time: '2:30 PM',
      type: 'in-person',
      location: 'Medical Center, Room 305',
      avatar: 'MC',
    },
  ];

  const pastAppointments = [
    {
      id: 3,
      doctor: 'Dr. Emily Johnson',
      specialty: 'Dermatologist',
      date: 'Nov 10, 2025',
      time: '11:00 AM',
      type: 'in-person',
      avatar: 'EJ',
    },
    {
      id: 4,
      doctor: 'Dr. Sarah Smith',
      specialty: 'Cardiologist',
      date: 'Oct 28, 2025',
      time: '3:00 PM',
      type: 'virtual',
      avatar: 'SS',
    },
  ];

  const handleBookAppointment = () => {
    // TODO: Replace with actual API call
    // await appointmentsAPI.bookAppointment(formData);
    
    toast({
      title: 'Appointment booked',
      description: 'Your appointment has been scheduled successfully',
    });
    setDialogOpen(false);
    setFormData({ doctor: '', date: '', time: '', type: 'in-person' });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl font-bold">Appointments</h1>
          <p className="mt-2 text-muted-foreground">Manage your healthcare appointments</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-book-appointment">
              <Plus className="mr-2 h-4 w-4" />
              Book Appointment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book New Appointment</DialogTitle>
              <DialogDescription>Schedule a visit with your healthcare provider</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="doctor">Doctor</Label>
                <Select
                  value={formData.doctor}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, doctor: value }))}
                >
                  <SelectTrigger data-testid="select-doctor">
                    <SelectValue placeholder="Select a doctor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dr-smith">Dr. Sarah Smith - Cardiologist</SelectItem>
                    <SelectItem value="dr-chen">Dr. Michael Chen - General Practitioner</SelectItem>
                    <SelectItem value="dr-johnson">Dr. Emily Johnson - Dermatologist</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                  data-testid="input-date"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  data-testid="input-time"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="type">Appointment Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger data-testid="select-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="virtual">Virtual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleBookAppointment} data-testid="button-confirm-booking">
              Confirm Booking
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming" data-testid="tab-upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past" data-testid="tab-past">Past</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {upcomingAppointments.map((appointment) => (
            <Card key={appointment.id} data-testid={`appointment-${appointment.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {appointment.avatar}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-lg">{appointment.doctor}</CardTitle>
                      <CardDescription>{appointment.specialty}</CardDescription>
                    </div>
                  </div>
                  <Badge variant={appointment.type === 'virtual' ? 'default' : 'secondary'}>
                    {appointment.type === 'virtual' ? (
                      <>
                        <Video className="mr-1 h-3 w-3" />
                        Virtual
                      </>
                    ) : (
                      <>
                        <MapPin className="mr-1 h-3 w-3" />
                        In-Person
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {appointment.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {appointment.time}
                  </div>
                </div>
                {appointment.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {appointment.location}
                  </div>
                )}
                <div className="flex gap-2">
                  {appointment.type === 'virtual' && (
                    <Button data-testid={`button-join-${appointment.id}`}>
                      <Video className="mr-2 h-4 w-4" />
                      Join Call
                    </Button>
                  )}
                  <Button variant="outline" data-testid={`button-reschedule-${appointment.id}`}>
                    Reschedule
                  </Button>
                  <Button variant="outline" data-testid={`button-cancel-${appointment.id}`}>
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          {pastAppointments.map((appointment) => (
            <Card key={appointment.id} data-testid={`past-appointment-${appointment.id}`}>
              <CardHeader>
                <div className="flex items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-muted text-muted-foreground">
                      {appointment.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{appointment.doctor}</CardTitle>
                    <CardDescription>{appointment.specialty}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {appointment.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {appointment.time}
                  </div>
                  <Badge variant="outline">{appointment.type}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
