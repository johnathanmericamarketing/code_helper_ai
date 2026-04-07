import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

const steps = [
  { id: 1, name: 'Request', description: 'Capture input' },
  { id: 2, name: 'Structure', description: 'AI analysis' },
  { id: 3, name: 'Plan', description: 'Execution strategy' },
  { id: 4, name: 'Generate', description: 'Code creation' },
  { id: 5, name: 'Validate', description: 'Safety checks' },
  { id: 6, name: 'Review', description: 'Final approval' },
];

export const StepIndicator = ({ currentStep = 1 }) => {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center relative">
              {/* Step Circle */}
              <div
                className={cn(
                  'w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all',
                  step.id < currentStep
                    ? 'bg-success border-success text-success-foreground'
                    : step.id === currentStep
                    ? 'bg-primary border-primary text-primary-foreground shadow-elegant'
                    : 'bg-muted border-border text-muted-foreground'
                )}
              >
                {step.id < currentStep ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span className="font-bold">{step.id}</span>
                )}
              </div>

              {/* Step Label */}
              <div className="mt-3 text-center">
                <p className={cn(
                  'text-sm font-semibold',
                  step.id <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                )}>
                  {step.name}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{step.description}</p>
              </div>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 mb-12">
                <div
                  className={cn(
                    'h-full transition-all',
                    step.id < currentStep ? 'bg-success' : 'bg-border'
                  )}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
