'use client';

import { useState, useRef } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AvatarUploadProps {
  userId: string;
  onUploaded: () => void;
}

export function AvatarUpload({ userId, onUploaded }: AvatarUploadProps) {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        toast({
          title: 'Định dạng không hợp lệ',
          description: 'Vui lòng chọn file hình ảnh',
          variant: 'destructive',
        });
        return;
      }
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
    // Clear input value so selecting the same file triggers change again
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleCancel = () => {
    setFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    try {
      setIsUploading(true);
      const token = localStorage.getItem('accessToken');
      
      const formData = new FormData();
      formData.append('file', file);

      // We explicitly bypass apiFetch for FormData because we want the browser to auto-set Content-Type with FormData boundary
      const res = await fetch(`http://localhost:8080/api/v1/users/me/avatar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      const data = await res.json();
      
      if (data.code === 1000) {
        toast({
          title: 'Thành công',
          description: 'Cập nhật ảnh đại diện thành công',
          variant: 'default',
        });
        handleCancel();
        onUploaded();
      } else {
        throw new Error(data.message || 'Lỗi khi upload ảnh');
      }
    } catch (err: any) {
      toast({
        title: 'Lỗi upload',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      {previewUrl ? (
        <div className="flex flex-col items-center gap-2 mt-2">
          <div className="w-12 h-12 rounded-full overflow-hidden border border-border">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          </div>
          <p className="text-xs text-muted-foreground truncate max-w-32">{file?.name}</p>
          
          <div className="flex items-center gap-2 mt-1">
            <Button
              size="sm"
              disabled={isUploading}
              onClick={handleUpload}
            >
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
              Lưu ảnh
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={isUploading}
              onClick={handleCancel}
            >
              Huỷ
            </Button>
          </div>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          className="h-8 shadow-sm"
        >
          <Camera className="w-3.5 h-3.5 mr-1.5" />
          Đổi ảnh
        </Button>
      )}
    </div>
  );
}
