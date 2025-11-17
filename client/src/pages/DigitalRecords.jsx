import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Download, Trash2, Eye, FileImage, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function DigitalRecords() {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  // TODO: Remove mock data - fetch from API
  const records = [
    {
      id: 1,
      name: 'Blood Test Results - Oct 2025',
      type: 'Lab Report',
      date: 'Oct 28, 2025',
      size: '2.4 MB',
      format: 'PDF',
      icon: FileText,
      category: 'lab',
    },
    {
      id: 2,
      name: 'X-Ray - Chest',
      type: 'Imaging',
      date: 'Oct 15, 2025',
      size: '5.1 MB',
      format: 'JPEG',
      icon: FileImage,
      category: 'imaging',
    },
    {
      id: 3,
      name: 'Prescription - Dr. Smith',
      type: 'Prescription',
      date: 'Oct 10, 2025',
      size: '156 KB',
      format: 'PDF',
      icon: FileText,
      category: 'prescription',
    },
    {
      id: 4,
      name: 'Annual Checkup Summary',
      type: 'Medical Report',
      date: 'Sep 20, 2025',
      size: '890 KB',
      format: 'PDF',
      icon: FileText,
      category: 'report',
    },
  ];

  const handleUpload = () => {
    setUploading(true);
    
    // TODO: Replace with actual file upload
    // const formData = new FormData();
    // formData.append('file', file);
    // await recordsAPI.uploadRecord(formData);
    
    setTimeout(() => {
      setUploading(false);
      toast({
        title: 'File uploaded',
        description: 'Your medical record has been uploaded successfully',
      });
    }, 2000);
  };

  const handleDelete = (id) => {
    // TODO: Replace with actual API call
    // await recordsAPI.deleteRecord(id);
    
    toast({
      title: 'Record deleted',
      description: 'The medical record has been removed',
    });
  };

  const categories = [
    { id: 'all', label: 'All Records', count: records.length },
    { id: 'lab', label: 'Lab Reports', count: records.filter(r => r.category === 'lab').length },
    { id: 'imaging', label: 'Imaging', count: records.filter(r => r.category === 'imaging').length },
    { id: 'prescription', label: 'Prescriptions', count: records.filter(r => r.category === 'prescription').length },
    { id: 'report', label: 'Medical Reports', count: records.filter(r => r.category === 'report').length },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl font-bold">Digital Records</h1>
          <p className="mt-2 text-muted-foreground">Store and manage your medical documents</p>
        </div>
        <Button onClick={handleUpload} disabled={uploading} data-testid="button-upload">
          <Upload className="mr-2 h-4 w-4" />
          {uploading ? 'Uploading...' : 'Upload Record'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload New Record</CardTitle>
          <CardDescription>Drag and drop files or click to browse</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card hover-elevate"
            data-testid="upload-zone"
          >
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground">PDF, JPEG, PNG up to 10MB</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          {categories.map(cat => (
            <TabsTrigger key={cat.id} value={cat.id} data-testid={`tab-${cat.id}`}>
              {cat.label} ({cat.count})
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(cat => (
          <TabsContent key={cat.id} value={cat.id} className="space-y-4">
            {records
              .filter(r => cat.id === 'all' || r.category === cat.id)
              .map((record) => (
                <Card key={record.id} data-testid={`record-${record.id}`}>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="rounded-lg bg-primary/10 p-3">
                          <record.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{record.name}</CardTitle>
                          <CardDescription>{record.type}</CardDescription>
                          <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{record.date}</span>
                            <span>{record.size}</span>
                            <Badge variant="outline">{record.format}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" data-testid={`button-view-${record.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                      <Button variant="outline" size="sm" data-testid={`button-download-${record.id}`}>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(record.id)}
                        data-testid={`button-delete-${record.id}`}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
