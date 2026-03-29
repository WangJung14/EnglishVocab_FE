'use client';

import Link from 'next/link';
import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { saveTokens, isLoggedIn } from '@/lib/auth';

/* ── Types ── */
interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  phoneNumber?: string;
}

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  /* Guard: redirect if already logged in */
  useEffect(() => {
    if (isLoggedIn()) router.replace('/dashboard');
  }, [router]);

  /* ── Validation ── */
  const validateField = (name: keyof FormState, value: string): string | undefined => {
    switch (name) {
      case 'firstName':
        return value.trim() === '' ? 'Vui lòng nhập họ' : undefined;
      case 'lastName':
        return value.trim() === '' ? 'Vui lòng nhập tên' : undefined;
      case 'email':
        if (value.trim() === '') return 'Vui lòng nhập email';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email không hợp lệ';
        return undefined;
      case 'password':
        return value.length < 8 ? 'Mật khẩu tối thiểu 8 ký tự' : undefined;
      case 'phoneNumber':
        if (value.trim() === '') return 'Vui lòng nhập số điện thoại';
        if (!/^\d{10,11}$/.test(value)) return 'Số điện thoại không hợp lệ (10-11 số)';
        return undefined;
      default:
        return undefined;
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const errorMsg = validateField(name as keyof FormState, value);
    setErrors((prev) => ({
      ...prev,
      [name]: errorMsg,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error while typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    setApiError('');
  };

  /* ── Password Strength ── */
  const getPasswordStrength = (password: string) => {
    if (password.length < 8) return 0; // Yếu
    let score = 1; // Trung bình
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[^A-Za-z0-9]/.test(password);

    if (hasUpperCase && hasNumber) score = 2; // Khá
    if (hasUpperCase && hasNumber && hasSpecialChar) score = 3; // Mạnh
    return score;
  };

  const passwordStrength = getPasswordStrength(form.password);

  const renderPasswordStrength = () => {
    let bars = [];
    let text = "Yếu";
    let textColor = "text-red-400";

    if (passwordStrength === 0) {
      if (form.password.length === 0) {
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
  }

  /* ── Submit ── */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setApiError('');

    const newErrors: FormErrors = {};
    let hasError = false;

    Object.keys(form).forEach((key) => {
      const errorMsg = validateField(key as keyof FormState, form[key as keyof FormState]);
      if (errorMsg) {
        newErrors[key as keyof FormErrors] = errorMsg;
        hasError = true;
      }
    });

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:8080/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (data.code === 1000 && data.result) {
        saveTokens(data.result.accessToken, data.result.refreshToken);
        router.push('/login');
      } else if (data.code === 4009) {
        setErrors((prev) => ({ ...prev, email: 'Email này đã được sử dụng' }));
      } else {
        console.error("Lỗi API Register:", data);
        setApiError(data.message || 'Đã có lỗi xảy ra định dạng, thử lại sau');
      }
    } catch {
      setApiError('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <Card className="w-full max-w-md shadow-sm">
        {/* ── Header ── */}
        <CardHeader className="items-center text-center pb-4">
          <div className="w-9 h-9 rounded-lg bg-foreground flex items-center justify-center mb-1">
            <span className="text-background font-semibold text-sm select-none">EH</span>
          </div>
          <CardTitle className="text-xl font-semibold mt-3">Tạo tài khoản</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Bắt đầu hành trình học của bạn
          </CardDescription>
        </CardHeader>

        {/* ── Content ── */}
        <CardContent>
          <form onSubmit={handleSubmit} noValidate className="space-y-4">

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="firstName">Họ</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="family-name"
                  className="mt-1"
                  value={form.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                />
                {errors.firstName && (
                  <p className="text-xs text-destructive mt-1">{errors.firstName}</p>
                )}
              </div>
              <div>
                <Label htmlFor="lastName">Tên</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="given-name"
                  className="mt-1"
                  value={form.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                />
                {errors.lastName && (
                  <p className="text-xs text-destructive mt-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                className="mt-1"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Mật khẩu</Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  className="pr-10"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 text-muted-foreground hover:text-foreground hover:bg-transparent"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              </div>

              {renderPasswordStrength()}

              {errors.password && (
                <p className="text-xs text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phoneNumber">Số điện thoại</Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="tel"
                autoComplete="tel"
                className="mt-1"
                value={form.phoneNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={isLoading}
              />
              {errors.phoneNumber && (
                <p className="text-xs text-destructive mt-1">{errors.phoneNumber}</p>
              )}
            </div>

            {/* API error box */}
            {apiError && (
              <div
                className="flex items-center gap-2 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-sm text-destructive"
                role="alert"
              >
                <AlertCircle size={16} className="shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Đang tạo tài khoản...
                </>
              ) : (
                'Tạo tài khoản'
              )}
            </Button>
          </form>
        </CardContent>

        {/* ── Footer ── */}
        <CardFooter className="flex flex-col gap-4 pt-0">
          <p className="text-sm text-center">
            <span className="text-muted-foreground">Đã có tài khoản? </span>
            <Link
              href="/login"
              className="font-medium text-foreground hover:underline"
            >
              Đăng nhập
            </Link>
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Bằng cách đăng ký, bạn đồng ý với Điều khoản và Chính sách bảo mật
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
