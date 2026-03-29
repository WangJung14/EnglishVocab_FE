'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, Check, X, RotateCcw, Home, Brain, ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ExerciseMeta, QuestionData, AttemptResult, mockAttemptStart, getMockAttemptResult } from '@/lib/mockData';

const API_BASE = 'http://localhost:8080/api/v1';

type QuizStatus = 'loading' | 'doing' | 'submitting' | 'finished';

interface Props {
  exerciseId: string;
  exercise: ExerciseMeta;
  questions: QuestionData[];
  token: string;
}

export default function ExerciseClientUI({ exerciseId, exercise, questions, token }: Props) {
  const router = useRouter();

  // --- STATE MANAGEMENT ---
  const [status, setStatus] = useState<QuizStatus>('loading');
  const [attemptId, setAttemptId] = useState<string | null>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({}); // { questionId: optionId }
  
  const [result, setResult] = useState<AttemptResult | null>(null);

  const totalQuestions = questions.length;
  const currentQ = questions[currentIndex];
  const progressPercent = ((currentIndex + 1) / totalQuestions) * 100;

  // --- 1. POST START (Lấy Attempt ID) ---
  useEffect(() => {
    let isMounted = true;
    
    async function startQuiz() {
      try {
        const res = await fetch(`${API_BASE}/exercises/${exerciseId}/start`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        
        if (data.code === 1073741824 || data.code === 1000) {
          if (isMounted) {
            setAttemptId(data.result.attemptId || data.result.id);
            setStatus('doing');
          }
        } else {
          throw new Error('API Báo lỗi Server');
        }
      } catch (err) {
        console.log('-> Bypass Fake POST Start');
        if (isMounted) {
          setAttemptId(mockAttemptStart().attemptId);
          setStatus('doing');
        }
      }
    }
    
    // Ngay khi F5, nạp mới
    if (status === 'loading') {
       startQuiz();
    }
    
    return () => { isMounted = false; };
  }, [exerciseId, token, status]);

  // --- 2. HANDLER NÚT TIẾN/LÙI ---
  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSelectOption = (optionId: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionId
    }));
  };

  // --- 3. SUBMIT & GET RESULT ---
  const handleSubmit = async () => {
    if (!attemptId) return;

    setStatus('submitting');

    // Chuyển format sang JSON Server yêu cầu
    const answersPayload = Object.entries(userAnswers).map(([qId, optId]) => ({
       questionId: qId,
       selectedOptionIds: [optId], // Mảng vì tuân theo Document Multiple Choice
       textAnswer: null
    }));

    try {
      // 1. Gửi Nộp Bài
      const submitRes = await fetch(`${API_BASE}/exercises/${exerciseId}/submit`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ attemptId, answers: answersPayload })
      });
      
      const submitData = await submitRes.json();
      if (submitData.code !== 1073741824 && submitData.code !== 1000) throw new Error();

      // 2. Kéo Kết Quả (Result)
      const resultRes = await fetch(`${API_BASE}/attempts/${attemptId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const resultData = await resultRes.json();
      
      if (resultData.code !== 1073741824 && resultData.code !== 1000) throw new Error();
      
      setResult(resultData.result);
      setStatus('finished');

    } catch (err) {
      console.log('-> Bypass Fake Submit -> Tính Điểm nội bộ');
      // Chấm điểm Fake nhanh để Demo (So sánh isCorrect)
      let score = 0;
      questions.forEach(q => {
         const userOpt = userAnswers[q.id];
         const correctOpt = q.options.find(o => o.isCorrect)?.id;
         if (userOpt === correctOpt) score++;
      });

      setTimeout(() => {
        setResult(getMockAttemptResult(score, totalQuestions));
        setStatus('finished');
      }, 1500); // Tạo overlay delay giả vờ tính điểm
    }
  };


  // =====================================
  // UI RENDERERS
  // =====================================

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
         <div className="w-16 h-16 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin mb-6" />
         <h2 className="text-xl font-black text-foreground">Khởi tạo bài thi...</h2>
         <p className="text-muted-foreground text-sm font-medium">Hệ thống đang tải dữ liệu bảo mật.</p>
      </div>
    );
  }

  if (status === 'submitting') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-slate-50 dark:bg-background">
         <Card className="w-full max-w-sm text-center p-10 border-2 shadow-2xl rounded-[2rem] overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-300 via-sky-500 to-sky-300 animate-pulse" />
            <Brain size={60} className="mx-auto text-sky-500 mb-6 drop-shadow-md animate-bounce" />
            <h2 className="text-2xl font-black text-foreground mb-2">Đang chấm điểm</h2>
            <p className="text-muted-foreground text-sm font-medium mb-6">Evaluating your answers...</p>
            <Progress value={80} className="h-2 [&>div]:bg-sky-500 [&>div]:animate-pulse" />
         </Card>
      </div>
    );
  }

  if (status === 'finished' && result) {
    const isPass = result.isPassed || (result.score / result.maxScore >= 0.5);
    const scoreText = `${result.score} / ${result.maxScore}`;

    return (
      <div className="min-h-screen bg-slate-50 dark:bg-background py-16 px-4">
         <div className="max-w-2xl mx-auto space-y-8">
            {/* Điểm số Thẻ lớn */}
            <Card className={`border-2 overflow-hidden shadow-xl rounded-[2rem] relative ${isPass ? 'border-emerald-500/50 bg-emerald-50 dark:bg-emerald-950/20' : 'border-rose-500/50 bg-rose-50 dark:bg-rose-950/20'}`}>
              <div className={`absolute top-0 left-0 w-full h-1.5 ${isPass ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <CardContent className="p-10 text-center flex flex-col items-center justify-center">
                 <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 shadow-lg ${isPass ? 'bg-emerald-500 shadow-emerald-500/40 text-white' : 'bg-rose-500 shadow-rose-500/40 text-white'}`}>
                    {isPass ? <Check strokeWidth={4} size={48} /> : <X strokeWidth={4} size={48} />}
                 </div>
                 
                 <Badge className={`font-bold uppercase tracking-widest text-[10px] shadow-none mb-3 px-3 py-1 border-0 ${isPass ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'}`}>
                    {isPass ? 'PASS - XUẤT SẮC' : 'FAILED - CỐ LÊN'}
                 </Badge>
                 
                 <h1 className={`text-6xl font-black tracking-tighter mb-4 ${isPass ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                    {scoreText}
                 </h1>
                 
                 <p className="text-muted-foreground font-medium text-lg">
                    Bạn đã trả lời đúng {result.correctAnswers} trên tổng số {result.totalQuestions} câu hỏi.
                 </p>
                 
                 {/* Navigation Actions */}
                 <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full">
                    <Button onClick={() => window.location.reload()} variant="outline" className="flex-1 rounded-2xl h-12 font-bold text-foreground border-border hover:bg-slate-100">
                      <RotateCcw className="mr-2" size={18} /> LÀM LẠI
                    </Button>
                    <Button onClick={() => router.push('/dashboard')} className="flex-1 rounded-2xl h-12 font-bold text-white shadow-md bg-sky-500 hover:bg-sky-400">
                      <Home className="mr-2" size={18} /> VỀ DASHBOARD
                    </Button>
                 </div>
              </CardContent>
            </Card>

            {/* Chi tiết từng câu */}
            <div className="space-y-4">
              <h3 className="text-xl font-black px-2 mt-12 mb-6 text-foreground">Review Chi tiết Đáp Án</h3>
              {questions.map((q, qIndex) => {
                const uAns = userAnswers[q.id];
                const cAns = q.options.find(o => o.isCorrect)?.id;
                const isQCorrect = uAns === cAns;
                
                return (
                  <Card key={q.id} className={`rounded-3xl border-2 transition-colors duration-200 ${isQCorrect ? 'border-emerald-200 bg-emerald-50/30' : 'border-rose-200 bg-rose-50/30'}`}>
                    <CardHeader className="pb-2">
                       <div className="flex gap-4">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold shadow-sm text-sm ${isQCorrect ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                            {qIndex + 1}
                         </div>
                         <h4 className="text-base font-bold text-foreground pt-1">{q.content}</h4>
                       </div>
                    </CardHeader>
                    <CardContent className="pl-14 pt-2">
                       <div className="space-y-2">
                         {q.options.map(opt => {
                           // Đánh dấu logic hiển thị
                           const isSelected = uAns === opt.id;
                           const isCorrectOption = opt.isCorrect;

                           let textClass = "text-muted-foreground";
                           let bgClass = "bg-transparent border-transparent";
                           
                           if (isCorrectOption) {
                             // Câu đúng thì auto làm nổi bật xanh (dù chọn hay ko)
                             bgClass = "bg-emerald-100/50 border-emerald-500 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400";
                             textClass = "font-bold";
                           } else if (isSelected && !isCorrectOption) {
                             // Câu sai mà lại chọn -> Báo đỏ
                             bgClass = "bg-rose-100/50 border-rose-500 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400";
                             textClass = "line-through opacity-70";
                           }

                           return (
                             <div key={opt.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${bgClass}`}>
                                <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center 
                                    ${isCorrectOption ? 'border-emerald-500 bg-emerald-500' : isSelected ? 'border-rose-500 bg-rose-500' : 'border-muted-foreground/30'}`}>
                                  {isCorrectOption && <Check size={10} strokeWidth={4} className="text-white" />}
                                  {(!isCorrectOption && isSelected) && <X size={10} strokeWidth={4} className="text-white" />}
                                </div>
                                <span className={`text-sm ${textClass}`}>{opt.content}</span>
                             </div>
                           );
                         })}
                       </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
         </div>
      </div>
    );
  }

  // =====================================
  // GIAO DIỆN LÀM BÀI 'DOING' MAIN
  // =====================================
  const isAnswered = !!userAnswers[currentQ.id];
  const isLastQuestion = currentIndex === totalQuestions - 1;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-background pb-32 flex flex-col">
      {/* Sticky Top Progress Bar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border shadow-sm">
         <Progress value={progressPercent} className="h-1.5 w-full rounded-none bg-slate-100 dark:bg-slate-900 [&>div]:bg-sky-500 transition-all duration-500" />
         
         <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-full hover:bg-muted">
               <X size={20} strokeWidth={2.5} />
            </Link>
            
            <div className="flex items-center gap-2 font-bold text-sky-600 dark:text-sky-400">
               <Clock size={16} /> 
               <span className="text-sm uppercase tracking-widest">{exercise.title}</span>
            </div>
            <div className="w-8" /> {/* Placeholder cân bằng Center */}
         </div>
      </div>

      {/* Main Quiz Area */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 flex flex-col">
         <Card className="flex-1 border-2 border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-sm flex flex-col pt-4">
            <CardHeader className="text-center pb-8 border-b border-border/40 border-dashed mx-6">
               <Badge variant="outline" className="mx-auto mb-4 border-slate-300 text-slate-500 shadow-none px-3 py-1 font-bold text-[10px] uppercase tracking-widest">
                  Question {currentIndex + 1} of {totalQuestions}
               </Badge>
               <CardTitle className="text-2xl sm:text-3xl font-black text-foreground leading-tight px-2">
                 {currentQ.content}
               </CardTitle>
            </CardHeader>
            
            <CardContent className="p-6 sm:p-10 flex-1 flex flex-col justify-center">
              <RadioGroup 
                value={userAnswers[currentQ.id]} 
                onValueChange={handleSelectOption}
                className="space-y-4"
              >
                {currentQ.options.map((opt, i) => {
                  const letter = String.fromCharCode(65 + i); // Gọi A, B, C, D
                  const selected = userAnswers[currentQ.id] === opt.id;
                  
                  return (
                    <Label 
                      key={opt.id}
                      htmlFor={opt.id}
                      className={`flex items-center group cursor-pointer border-2 rounded-2xl p-4 sm:p-5 transition-all duration-300 transform active:scale-[0.98] ${
                        selected 
                          ? 'border-sky-500 bg-sky-50 dark:bg-sky-500/10 shadow-md shadow-sky-500/10 outline outline-2 outline-sky-100 outline-offset-4' 
                          : 'border-slate-200 hover:border-sky-300 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900'
                      }`}
                    >
                      {/* Ẩn input Radio gốc của shadcn vì mình thiết kế Custom Radio bọc bởi Label */}
                      <RadioGroupItem value={opt.id} id={opt.id} className="sr-only" />
                      
                      {/* Box Chọn ABCD Trái */}
                      <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center font-black transition-colors ${
                        selected ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-sky-100 group-hover:text-sky-600'
                      }`}>
                        {letter}
                      </div>

                      {/* Content Lựa Chọn */}
                      <span className={`ml-4 text-[15px] sm:text-base font-medium transition-colors ${
                        selected ? 'text-sky-900 dark:text-sky-300 font-bold' : 'text-foreground'
                      }`}>
                        {opt.content}
                      </span>
                    </Label>
                  );
                })}
              </RadioGroup>
            </CardContent>
         </Card>

         {/* Nút Điều Khiển Dưới Cùng */}
         <div className="flex items-center justify-between mt-8 gap-4 px-2">
            <Button 
                onClick={handleBack} 
                disabled={currentIndex === 0} 
                variant="outline" 
                className="rounded-2xl h-14 px-6 font-black text-foreground border-2 border-slate-200 hover:bg-slate-100 w-1/3"
            >
               <ArrowLeft size={20} className="mr-2 opacity-50" /> BACK
            </Button>

            {isLastQuestion ? (
               <Button 
                  onClick={handleSubmit} 
                  disabled={!isAnswered}
                  className="rounded-2xl h-14 px-8 font-black text-white bg-amber-500 hover:bg-amber-400 hover:shadow-[0_4px_0_0_#d97706] transition-all transform hover:-translate-y-1 shadow-[0_6px_0_0_#d97706] active:translate-y-1 active:shadow-[0_2px_0_0_#d97706] flex-1 text-lg"
               >
                 FINISH & SUBMIT <Check size={24} className="ml-2" />
               </Button>
            ) : (
               <Button 
                  onClick={handleNext} 
                  disabled={!isAnswered}
                  className="rounded-2xl h-14 px-8 font-black text-white bg-sky-500 hover:bg-sky-400 hover:shadow-[0_4px_0_0_#0284c7] transition-all transform hover:-translate-y-1 shadow-[0_6px_0_0_#0284c7] active:translate-y-1 active:shadow-[0_2px_0_0_#0284c7] flex-1 text-lg"
               >
                 NEXT QUESTION <ArrowRight size={24} className="ml-2" />
               </Button>
            )}
         </div>
      </main>
    </div>
  );
}
