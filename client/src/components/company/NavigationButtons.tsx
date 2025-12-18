import { Button } from "@/components/ui/button";
import type { NavigationButtonsProps } from '@/interfaces/ui/navigation-buttons-props.interface';

export const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrevious,
  onNext,
}) => (
  <div className="flex justify-between w-full">
    <Button
      variant="companyOutline"
      onClick={onPrevious}
      className="w-[150px] h-10 border border-[#CCCCF5] rounded-lg text-[#4640DE] hover:bg-[#CCCCF5] text-base font-bold"
    >
      Previous
    </Button>
    <Button
      variant="company"
      onClick={onNext}
      className="w-[150px] h-10 bg-[#4640DE] hover:bg-[#4640DE]/90 text-white text-base font-bold rounded-lg"
    >
      Next Step
    </Button>
  </div>
);