
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X, Eye } from 'lucide-react';

interface FileUploadProps {
  surfistId: string;
  currentFileUrl?: string;
  fileType: 'foto' | 'comprovante';
  onUploadSuccess: (url: string) => void;
}

const FileUpload = ({ surfistId, currentFileUrl, fileType, onUploadSuccess }: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const { toast } = useToast();

  const bucketName = fileType === 'foto' ? 'surfistas-fotos' : 'comprovantes-pagamento';
  const acceptTypes = fileType === 'foto' ? 'image/*' : 'image/*,.pdf';

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${surfistId}_${fileType}_${Date.now()}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);

      // Atualizar o campo correspondente na tabela fichas_surfistas
      const updateField = fileType === 'foto' ? 'foto_url' : 'comprovante_url';
      const { error: updateError } = await supabase
        .from('fichas_surfistas')
        .update({ [updateField]: publicUrl })
        .eq('id', surfistId);

      if (updateError) throw updateError;

      onUploadSuccess(publicUrl);
      setFile(null);
      
      toast({
        title: "Upload realizado com sucesso",
        description: `${fileType === 'foto' ? 'Foto' : 'Comprovante'} enviado(a) com sucesso.`,
      });
    } catch (error) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: "Não foi possível enviar o arquivo. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  const handleViewFile = () => {
    if (currentFileUrl) {
      window.open(currentFileUrl, '_blank');
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Input
          type="file"
          accept={acceptTypes}
          onChange={handleFileSelect}
          disabled={uploading}
          className="flex-1"
        />
        {file && (
          <Button 
            onClick={handleUpload} 
            disabled={uploading}
            size="sm"
          >
            <Upload className="h-4 w-4 mr-1" />
            {uploading ? 'Enviando...' : 'Enviar'}
          </Button>
        )}
      </div>
      
      {currentFileUrl && (
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleViewFile}
          >
            <Eye className="h-4 w-4 mr-1" />
            Visualizar {fileType === 'foto' ? 'Foto' : 'Comprovante'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
