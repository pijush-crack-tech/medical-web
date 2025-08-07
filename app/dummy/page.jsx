'use client';
import { useExamStore } from '@/store/ExamStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Dummy() {
    const examData = useExamStore((state) => state.examData);
    
    return (
        <div className='mt-20 text-black'>
            Dummy - Question ID: {examData?.id}
        </div>
    );
}