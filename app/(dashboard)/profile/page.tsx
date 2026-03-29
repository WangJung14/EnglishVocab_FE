'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { apiFetch } from '@/lib/api';

import { ProfileInfo } from '@/app/(dashboard)/profile/components/ProfileInfo';
import { EditProfileForm } from '@/app/(dashboard)/profile/components/EditProfileForm';
import { ChangePasswordForm } from '@/app/(dashboard)/profile/components/ChangePasswordForm';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  membershipType: 'FREE' | 'PREMIUM';
}

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUser = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await apiFetch('/users/me');
      setUser(data);
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin hồ sơ.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Hồ sơ cá nhân</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quản lý thông tin tài khoản của bạn
        </p>
      </div>

      <Separator className="mt-6 mb-6" />

      {loading ? (
        <div className="space-y-6">
          <div className="flex items-center gap-6 p-6 border border-border rounded-xl">
            <div className="w-20 h-20 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="space-y-3 w-full">
              <div className="w-48 h-4 bg-muted animate-pulse rounded" />
              <div className="w-32 h-4 bg-muted animate-pulse rounded" />
              <div className="w-24 h-3 bg-muted animate-pulse rounded" />
            </div>
          </div>
        </div>
      ) : error ? (
        <div className="p-4 text-center text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
          {error}
        </div>
      ) : user ? (
        <Tabs defaultValue="profile">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Thông tin cá nhân</TabsTrigger>
            <TabsTrigger value="security">Bảo mật</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <ProfileInfo user={user} onUpdated={fetchUser} />
            <EditProfileForm user={user} onUpdated={fetchUser} />
          </TabsContent>

          <TabsContent value="security">
            <ChangePasswordForm />
          </TabsContent>
        </Tabs>
      ) : null}
    </div>
  );
}
