import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RequestForm } from '@/components/RequestForm';
import { StepIndicator } from '@/components/StepIndicator';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CreateRequestPage = () => {
  const navigate = useNavigate();

  const handleRequestCreated = (request) => {
    // Navigate to request detail page
    navigate(`/request/${request.id}`);
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Button>

      {/* Step Indicator */}
      <StepIndicator currentStep={1} />

      {/* Request Form */}
      <RequestForm onRequestCreated={handleRequestCreated} />
    </div>
  );
};
