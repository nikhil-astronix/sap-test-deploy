import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ObservationSession from '@/components/ObservationSession';

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <ObservationSession />
    </DashboardLayout>
  );
} 