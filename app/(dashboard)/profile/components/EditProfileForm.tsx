'use client';

import { useState, FormEvent, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { User } from '../page';
import { apiFetch } from '@/lib/api';

interface EditProfileFormProps {
  user: User;
  onUpdated: () => void;
}

export function EditProfileForm({ user, onUpdated }: EditProfileFormProps) {
  const { toast } = useToast();

  const [firstName, setFirstName] = useState(user.firstName);
  const [lastName, setLastName] = useState(user.lastName);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ firstName?: string; lastName?: string }>({});

  // Reset form when user changes
  useEffect(() => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
  }, [user]);

  const hasChanges = firstName !== user.firstName || lastName !== user.lastName;

  const validateOnBlur = (field: 'firstName' | 'lastName') => {
    if (field === 'firstName' && !firstName.trim()) {
      setErrors((p) => ({ ...p, firstName: 'Vui lòng nhập họ' }));
    } else if (field === 'lastName' && !lastName.trim()) {
      setErrors((p) => ({ ...p, lastName: 'Vui lòng nhập tên' }));
    }
  };

  const handleInputChange = (field: 'firstName' | 'lastName', value: string) => {
    if (field === 'firstName') {
      setFirstName(value);
      if (errors.firstName) setErrors((p) => ({ ...p, firstName: undefined }));
    } else {
      setLastName(value);
      if (errors.lastName) setErrors((p) => ({ ...p, lastName: undefined }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let newErrors: typeof errors = {};
    if (!firstName.trim()) newErrors.firstName = 'Vui lòng nhập họ';
    if (!lastName.trim()) newErrors.lastName = 'Vui lòng nhập tên';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsLoading(true);
      await apiFetch('/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName }),
      });

      toast({
        title: 'Thành công',
        description: 'Cập nhật thông tin thành công',
      });
      onUpdated();
    } catch (err: any) {
      toast({
        title: 'Lỗi',
        description: err.message || 'Lỗi khi cập nhật thông tin',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 border border-border rounded-xl bg-card mt-4">
      <h3 className="text-base font-medium text-foreground">Chỉnh sửa thông tin</h3>
      <Separator className="my-4" />

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="edit-firstName">Họ</Label>
            <Input
              id="edit-firstName"
              className="mt-1"
              value={firstName}
              onChange={(e) => handleInputChange('firstName', e.target.value)}
              onBlur={() => validateOnBlur('firstName')}
              disabled={isLoading}
            />
            {errors.firstName && <p className="text-xs text-destructive mt-1">{errors.firstName}</p>}
          </div>

          <div>
            <Label htmlFor="edit-lastName">Tên</Label>
            <Input
              id="edit-lastName"
              className="mt-1"
              value={lastName}
              onChange={(e) => handleInputChange('lastName', e.target.value)}
              onBlur={() => validateOnBlur('lastName')}
              disabled={isLoading}
            />
            {errors.lastName && <p className="text-xs text-destructive mt-1">{errors.lastName}</p>}
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button
            type="submit"
            variant="default"
            disabled={isLoading || !hasChanges}
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </div>
  );
}
