export interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSubmit?: () => void;
  isLastStep?: boolean;
  isFirstStep?: boolean;
}
