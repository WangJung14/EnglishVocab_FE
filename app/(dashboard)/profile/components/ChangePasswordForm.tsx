'use client';

import { useState, FormEvent } from 'react';
import { Eye, EyeOff, Info, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export function ChangePasswordForm() {
  const { toast } = useToast();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const getPasswordStrength = (password: string) => {
    if (password.length < 8) return 0;
    let score = 1;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    if (hasUpperCase && hasNumber) score = 2;
    if (hasUpperCase && hasNumber && hasSpecialChar) score = 3;
    return score;
  };

  const passwordStrength = getPasswordStrength(newPassword);

  const renderPasswordStrength = () => {
    let bars = [];
    let text = 'Yếu';
    let textColor = 'text-red-400';

    if (passwordStrength === 0) {
      if (newPassword.length === 0) {
        bars = ['bg-muted', 'bg-muted', 'bg-muted', 'bg-muted'];
        text = '';
      } else {
        bars = ['bg-red-400', 'bg-muted', 'bg-muted', 'bg-muted'];
        text = 'Yếu';
        textColor = 'text-red-400';
      }
    } else if (passwordStrength === 1) {
      bars = ['bg-orange-400', 'bg-orange-400', 'bg-muted', 'bg-muted'];
      text = 'Trung bình';
      textColor = 'text-orange-400';
    } else if (passwordStrength === 2) {
      bars = ['bg-yellow-400', 'bg-yellow-400', 'bg-yellow-400', 'bg-muted'];
      text = 'Khá';
      textColor = 'text-yellow-400';
    } else {
      bars = ['bg-green-500', 'bg-green-500', 'bg-green-500', 'bg-green-500'];
      text = 'Mạnh';
      textColor = 'text-green-500';
    }

    return (
      <div className="mt-2 flex items-center justify-between">
        <div className="flex gap-1 flex-1 mr-4">
          {bars.map((bgClasses, idx) => (
            <div key={idx} className={`h-1 flex-1 rounded-full transition-colors duration-300 ${bgClasses}`} />
          ))}
        </div>
        {text && <div className={`text-xs font-medium ${textColor}`}>{text}</div>}
      </div>
    );
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    let newErrors: typeof errors = {};

    if (!currentPassword) newErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    
    if (!newPassword) {
      newErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Mật khẩu phải từ 8 ký tự trở lên';
    } else if (!/[A-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      newErrors.newPassword = 'Mật khẩu phải chứa cả chữ hoa và chữ số';
    }

    if (confirmPassword !== newPassword) {
      newErrors.confirmPassword = 'Xác nhận mật khẩu không khớp';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const res = await fetch(`http://localhost:8080/api/v1/users/me/password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();

      if (data.code === 1000) {
        toast({
          title: 'Đổi mật khẩu thành công',
          description: 'Mật khẩu của bạn đã được cập nhật',
        });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setShowCurrent(false);
        setShowNew(false);
        setShowConfirm(false);
      } else if (data.code === 4001) {
        setErrors({ currentPassword: 'Mật khẩu hiện tại không đúng' });
      } else {
        throw new Error(data.message || 'Không thể đổi mật khẩu');
      }
    } catch (err: any) {
      toast({
        title: 'Lỗi',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 border border-border rounded-xl bg-card">
      <h3 className="text-base font-medium text-foreground">Đổi mật khẩu</h3>
      <Separator className="my-4" />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        
        {/* Current Password */}
        <div>
          <Label htmlFor="currentPassword">Mật khẩu hiện tại</Label>
          <div className="relative mt-1">
            <Input
              id="currentPassword"
              type={showCurrent ? 'text' : 'password'}
              className="pr-10"
              value={currentPassword}
              disabled={isLoading}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                if (errors.currentPassword) setErrors((p) => ({ ...p, currentPassword: undefined }));
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent"
              onClick={() => setShowCurrent((v) => !v)}
              tabIndex={-1}
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
          {errors.currentPassword && <p className="text-xs text-destructive mt-1">{errors.currentPassword}</p>}
        </div>

        {/* New Password */}
        <div>
          <Label htmlFor="newPassword">Mật khẩu mới</Label>
          <div className="relative mt-1">
            <Input
              id="newPassword"
              type={showNew ? 'text' : 'password'}
              className="pr-10"
              value={newPassword}
              disabled={isLoading}
              onChange={(e) => {
                setNewPassword(e.target.value);
                if (errors.newPassword) setErrors((p) => ({ ...p, newPassword: undefined }));
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent"
              onClick={() => setShowNew((v) => !v)}
              tabIndex={-1}
            >
              {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
          
          {renderPasswordStrength()}
          
          {errors.newPassword && <p className="text-xs text-destructive mt-1">{errors.newPassword}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <Label htmlFor="confirmPassword">Xác nhận mật khẩu mới</Label>
          <div className="relative mt-1">
            <Input
              id="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              className="pr-10"
              value={confirmPassword}
              disabled={isLoading}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (errors.confirmPassword) setErrors((p) => ({ ...p, confirmPassword: undefined }));
              }}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:bg-transparent"
              onClick={() => setShowConfirm((v) => !v)}
              tabIndex={-1}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </Button>
          </div>
          {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}
        </div>

        {/* Info Box */}
        <div className="bg-muted rounded-lg p-3 flex items-start gap-2 text-xs text-muted-foreground mt-2">
          <Info size={14} className="mt-0.5 shrink-0" />
          <p>Mật khẩu mới phải có ít nhất 8 ký tự, 1 chữ hoa và 1 chữ số</p>
        </div>

        {/* Submit */}
        <Button
          type="submit"
          variant="default"
          className="w-full mt-2"
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isLoading ? 'Đang cập nhật...' : 'Đổi mật khẩu'}
        </Button>
      </form>
    </div>
  );
}
