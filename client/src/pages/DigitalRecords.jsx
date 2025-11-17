import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Upload, Download, Trash2, Eye, FileImage, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import Loader from '@/components/Loader';

export default function DigitalRecords() {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);

  const { data: records, isLoading } = useQuery({
    queryKey: ['/api/records'],
  });

  const uploadMutation = useMutation({
    mutationFn: (formData) => apiRequest('POST', '/api/records/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/records'] });
      toast({
        title: 'File uploaded',
        description: 'Your medical record has been uploaded successfully',
      });
    },
    onError: () => {
      toast({
        title: 'Upload failed',
        description: 'Unable to upload file. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => apiRequest('DELETE', `/api/records/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/records'] });
      toast({
        title: 'Record deleted',
        description: 'The medical record has been removed',
      });
    },
    onError: () => {
      toast({
        title: 'Delete failed',
        description: 'Unable to delete record. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      await uploadMutation.mutateAsync(formData);
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const handleDelete = (id) => {
    deleteMutation.mutate(id);
  };

  const getFileIcon = (format) => {
    if (format === 'JPEG' || format === 'PNG' || format === 'JPG') {
      return FileImage;
    }
    return FileText;
  };

  const categories = [
    { id: 'all', label: 'All Records', filter: () => true },
    { id: 'lab', label: 'Lab Reports', filter: (r) => r.category === 'lab' },
    { id: 'imaging', label: 'Imaging', filter: (r) => r.category === 'imaging' },
    { id: 'prescription', label: 'Prescriptions', filter: (r) => r.category === 'prescription' },
    { id: 'report', label: 'Medical Reports', filter: (r) => r.category === 'report' },
  ];

  if (isLoading) {
    return <Loader />;
  }

  const allRecords = records || [];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl font-bold">Digital Records</h1>
          <p className="mt-2 text-muted-foreground">Store and manage your medical documents</p>
        </div>
        <div>
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileSelect}
            accept=".pdf,.jpg,.jpeg,.png"
          />
          <Button
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={uploading}
            data-testid="button-upload"
          >
            <Upload className="mr-2 h-4 w-4" />
            {uploading ? 'Uploading...' : 'Upload Record'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Upload New Record</CardTitle>
          <CardDescription>Drag and drop files or click to browse</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card hover-elevate"
            onClick={() => document.getElementById('file-upload')?.click()}
            data-testid="upload-zone"
          >
            <Upload className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-1">Click to upload or drag and drop</p>
            <p className="text-xs text-muted-foreground">PDF, JPEG, PNG up to 10MB</p>
          </div>
        </CardContent>
      </Card>

      {allRecords.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No records uploaded yet. Upload your first medical document above.</p>
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            {categories.map(cat => {
              const count = allRecords.filter(cat.filter).length;
              return (
                <TabsTrigger key={cat.id} value={cat.id} data-testid={`tab-${cat.id}`}>
                  {cat.label} ({count})
                </TabsTrigger>
              );
            })}
          </TabsList>

          {categories.map(cat => (
            <TabsContent key={cat.id} value={cat.id} className="space-y-4">
              {allRecords.filter(cat.filter).length > 0 ? (
                allRecords.filter(cat.filter).map((record) => {
                  const IconComponent = getFileIcon(record.format);
                  return (
                    <Card key={record.id} data-testid={`record-${record.id}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="rounded-lg bg-primary/10 p-3">
                              <IconComponent className="h-6 w-6 text-primary" />
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
                            disabled={deleteMutation.isPending}
                            data-testid={`button-delete-${record.id}`}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-muted-foreground">No {cat.label.toLowerCase()} available</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
}
