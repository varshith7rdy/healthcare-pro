import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Calendar, Clock, Video, MapPin } from 'lucide-react';
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
import { apiRequest, queryClient } from '@/lib/queryClient';
import Loader from '@/components/Loader';

export default function Appointments() {
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    doctor: '',
    date: '',
    time: '',
    type: 'in-person',
  });

  const { data: appointmentsData, isLoading } = useQuery({
    queryKey: ['/api/appointments'],
  });

  const bookMutation = useMutation({
    mutationFn: (data) => apiRequest('POST', '/api/appointments/book', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({
        title: 'Appointment booked',
        description: 'Your appointment has been scheduled successfully',
      });
      setDialogOpen(false);
      setFormData({ doctor: '', date: '', time: '', type: 'in-person' });
    },
    onError: () => {
      toast({
        title: 'Booking failed',
        description: 'Unable to book appointment. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => apiRequest('DELETE', `/api/appointments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/appointments'] });
      toast({
        title: 'Appointment cancelled',
        description: 'The appointment has been cancelled',
      });
    },
    onError: () => {
      toast({
        title: 'Cancellation failed',
        description: 'Unable to cancel appointment. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleBookAppointment = () => {
    bookMutation.mutate(formData);
  };

  if (isLoading) {
    return <Loader />;
  }

  const upcomingAppointments = appointmentsData?.upcoming || [];
  const pastAppointments = appointmentsData?.past || [];

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
              <Calendar className="mr-2 h-4 w-4" />
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
            <Button
              onClick={handleBookAppointment}
              disabled={bookMutation.isPending}
              data-testid="button-confirm-booking"
            >
              {bookMutation.isPending ? 'Booking...' : 'Confirm Booking'}
            </Button>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="upcoming" className="space-y-6">
        <TabsList>
          <TabsTrigger value="upcoming" data-testid="tab-upcoming">
            Upcoming ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="past" data-testid="tab-past">
            Past ({pastAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6">
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <Card key={appointment.id} data-testid={`appointment-${appointment.id}`}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {appointment.doctorInitials || 'DR'}
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
                    <Button
                      variant="outline"
                      onClick={() => cancelMutation.mutate(appointment.id)}
                      disabled={cancelMutation.isPending}
                      data-testid={`button-cancel-${appointment.id}`}
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No upcoming appointments</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-6">
          {pastAppointments.length > 0 ? (
            pastAppointments.map((appointment) => (
              <Card key={appointment.id} data-testid={`past-appointment-${appointment.id}`}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-muted text-muted-foreground">
                        {appointment.doctorInitials || 'DR'}
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
            ))
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No past appointments</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
