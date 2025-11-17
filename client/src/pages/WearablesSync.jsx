import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Watch, Smartphone, Activity, Bluetooth, CheckCircle2, XCircle, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import wearablesImage from '@assets/generated_images/Modern_wearable_health_devices_33453171.png';

export default function WearablesSync() {
  const { toast } = useToast();
  const [syncingDevice, setSyncingDevice] = useState(null);
  const [progress, setProgress] = useState(0);

  // TODO: Remove mock data - fetch from API
  const [devices, setDevices] = useState([
    {
      id: 1,
      name: 'Apple Watch Series 9',
      type: 'Smartwatch',
      icon: Watch,
      connected: true,
      lastSync: '2 hours ago',
      battery: 85,
    },
    {
      id: 2,
      name: 'Fitbit Charge 6',
      type: 'Fitness Tracker',
      icon: Activity,
      connected: false,
      lastSync: '3 days ago',
      battery: null,
    },
    {
      id: 3,
      name: 'iPhone Health',
      type: 'Health App',
      icon: Smartphone,
      connected: true,
      lastSync: '1 hour ago',
      battery: null,
    },
  ]);

  const handleSync = async (deviceId) => {
    setSyncingDevice(deviceId);
    setProgress(0);

    // TODO: Replace with actual API call
    // await healthAPI.syncWearable(deviceId);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setSyncingDevice(null);
          
          // Update last sync time
          setDevices(prev => prev.map(d => 
            d.id === deviceId ? { ...d, lastSync: 'Just now' } : d
          ));
          
          toast({
            title: 'Sync complete',
            description: 'Your health data has been updated',
          });
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleConnect = (deviceId) => {
    // TODO: Replace with actual connection logic
    setDevices(prev => prev.map(d => 
      d.id === deviceId ? { ...d, connected: true } : d
    ));
    toast({
      title: 'Device connected',
      description: 'You can now sync your health data',
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-4xl font-bold">Wearables & Devices</h1>
        <p className="mt-2 text-muted-foreground">Manage your connected health devices</p>
      </div>

      <div className="rounded-lg overflow-hidden">
        <img
          src={wearablesImage}
          alt="Wearable health devices"
          className="h-40 w-full object-cover"
        />
      </div>

      <div className="grid gap-6">
        {devices.map((device) => (
          <Card key={device.id} data-testid={`device-${device.id}`}>
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/10 p-3">
                    <device.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{device.name}</CardTitle>
                    <CardDescription>{device.type}</CardDescription>
                  </div>
                </div>
                <Badge variant={device.connected ? 'default' : 'secondary'} data-testid={`status-${device.id}`}>
                  {device.connected ? (
                    <>
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Connected
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-1 h-3 w-3" />
                      Disconnected
                    </>
                  )}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <RefreshCw className="h-4 w-4" />
                  Last synced: {device.lastSync}
                </div>
                {device.battery && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    Battery: {device.battery}%
                  </div>
                )}
              </div>

              {syncingDevice === device.id && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Syncing data...</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              <div className="flex gap-2">
                {device.connected ? (
                  <Button
                    onClick={() => handleSync(device.id)}
                    disabled={syncingDevice === device.id}
                    data-testid={`button-sync-${device.id}`}
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${syncingDevice === device.id ? 'animate-spin' : ''}`} />
                    {syncingDevice === device.id ? 'Syncing...' : 'Sync Now'}
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleConnect(device.id)}
                    data-testid={`button-connect-${device.id}`}
                  >
                    <Bluetooth className="mr-2 h-4 w-4" />
                    Connect
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Device</CardTitle>
          <CardDescription>Connect more health devices to get comprehensive insights</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" data-testid="button-add-device">
            <Bluetooth className="mr-2 h-4 w-4" />
            Scan for Devices
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
