'use client';

import { Mail, Crown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from '../page';
import { AvatarUpload } from '@/app/(dashboard)/profile/components/AvatarUpload';

interface ProfileInfoProps {
  user: User;
  onUpdated: () => void;
}

export function ProfileInfo({ user, onUpdated }: ProfileInfoProps) {
  const getInitials = (first: string, last: string) => {
    return `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
  };

  return (
    <div className="flex items-center gap-6 p-6 border border-border rounded-xl bg-card">
      {/* ── Left: Avatar ── */}
      <div className="flex flex-col items-center shrink-0">
        <Avatar className="w-20 h-20 mb-3">
          <AvatarImage src={user.avatarUrl || undefined} alt={`${user.firstName} ${user.lastName}`} />
          <AvatarFallback className="text-lg font-semibold bg-muted text-foreground">
            {getInitials(user.firstName, user.lastName)}
          </AvatarFallback>
        </Avatar>
        <AvatarUpload userId={user.id} onUploaded={onUpdated} />
      </div>

      {/* ── Right: User Info ── */}
      <div className="flex flex-col flex-1">
        <h2 className="text-xl font-semibold text-foreground">
          {user.firstName} {user.lastName}
        </h2>
        
        <div className="flex items-center text-sm text-muted-foreground mt-1 mb-3">
          <Mail className="w-3.5 h-3.5 mr-1.5" />
          <span>{user.email}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Badge */}
          <span
            className={`text-xs font-medium px-2 py-0.5 rounded-full border ${
              user.role === 'STUDENT'
                ? 'bg-blue-50 text-blue-700 border-blue-200'
                : user.role === 'TEACHER'
                ? 'bg-purple-50 text-purple-700 border-purple-200'
                : 'bg-red-50 text-red-700 border-red-200'
            }`}
          >
            {user.role}
          </span>

          {/* Membership Badge */}
          <span
            className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${
              user.membershipType === 'PREMIUM'
                ? 'bg-amber-50 border-amber-200 text-amber-700'
                : 'bg-muted border-transparent text-muted-foreground'
            }`}
          >
            {user.membershipType === 'PREMIUM' && <Crown className="w-3 h-3 text-amber-500" />}
            {user.membershipType}
          </span>
        </div>
      </div>
    </div>
  );
}
