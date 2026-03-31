import React from 'react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { ChevronLeft, Info, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import ReviewClient from './components/ReviewClient';
import { mockFlashcards } from '@/lib/mockData';
import { Flashcard } from './types';

const API_BASE = 'http://localhost:8080/api/v1';

async function getToken() {
  const cookieStore = await cookies();
  return (await cookieStore).get('accessToken')?.value || '';
}

async function serverFetch(endpoint: string) {
  const token = await getToken();
  
  // For development/mock purposes, if no token, try fallback
  if (!token) {
    console.warn('No token found, falling back to mock data for SRS.');
    return null;
  }

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      console.error(`API Fetch failed with status: ${res.status}`);
      return null;
    }

    const text = await res.text();
    if (!text) return null;

    try {
      const data = JSON.parse(text);
      if (data.code !== 1000) {
        console.error('API Error:', data.message);
        return null;
      }
      return data.result;
    } catch (parseError) {
      console.error('JSON Parse error:', parseError);
      return null;
    }
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
}

export default async function SRSPage() {
  const dueCardsResult = await serverFetch('/srs/due');
  
  // Fallback to mock data if API fails or no cards (for demo)
  const flashcards: Flashcard[] = dueCardsResult && dueCardsResult.length > 0 
    ? dueCardsResult 
    : mockFlashcards;

  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-background flex items-center justify-center p-6">
        <Card className="max-w-md w-full border-2 border-dashed border-slate-200 dark:border-slate-800 shadow-none bg-transparent text-center p-12 rounded-[40px]">
          <div className="w-20 h-20 bg-sky-100 dark:bg-sky-950/40 rounded-full flex items-center justify-center mx-auto mb-6 text-sky-500">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">You're all caught up!</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
            Your memory is sharp! There are no flashcards due for review right now. Come back later.
          </p>
          <Button asChild className="rounded-2xl h-12 bg-sky-500 hover:bg-sky-400 shadow-[0_4px_0_0_#0284c7] active:shadow-none active:translate-y-1 transition-all">
            <Link href="/dashboard">Back to Dashboard</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return <ReviewClient initialCards={flashcards} />;
}
