
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, Eye } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

type ImageUploadProps = {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  bucketName: string;
  label: string;
  accept?: string;
};

const ImageUpload = ({ 
  currentImageUrl, 
  onImageUploaded, 
  bucketName, 
  label,
  accept = "image/*"
}: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const { toast } = useToast();

  const uploadImage = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('Você deve selecionar um arquivo para upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      setPreviewUrl(data.publicUrl);
      onImageUploaded(data.publicUrl);
      
      toast({
        title: "Upload realizado com sucesso",
        description: `${label} foi enviada com sucesso.`,
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: error instanceof Error ? error.message : "Não foi possível fazer o upload da imagem.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    if (!currentImageUrl) return;
    
    try {
      // Extract filename from URL
      const urlParts = currentImageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([fileName]);

      if (error) throw error;

      setPreviewUrl(null);
      onImageUploaded('');
      
      toast({
        title: "Imagem removida",
        description: `${label} foi removida com sucesso.`,
      });
    } catch (error) {
      console.error('Erro ao remover imagem:', error);
      toast({
        title: "Erro ao remover",
        description: "Não foi possível remover a imagem.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        {previewUrl ? (
          <div className="flex items-center gap-2">
            <div className="w-16 h-16 rounded-lg overflow-hidden border">
              <img 
                src={previewUrl} 
                alt={label}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    Ver
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{label}</DialogTitle>
                  </DialogHeader>
                  <div className="flex justify-center">
                    <img 
                      src={previewUrl} 
                      alt={label}
                      className="max-w-full max-h-96 object-contain"
                    />
                  </div>
                </DialogContent>
              </Dialog>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={removeImage}
                className="text-red-600 hover:text-red-700"
              >
                <X className="w-4 h-4 mr-1" />
                Remover
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-16 h-16 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <Button 
                variant="outline" 
                disabled={uploading}
                className="relative"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Enviando...' : `Enviar ${label}`}
                <input
                  type="file"
                  accept={accept}
                  onChange={uploadImage}
                  disabled={uploading}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
