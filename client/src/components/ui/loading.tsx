import { Loader2 } from 'lucide-react'
import { Card, CardContent } from './card'
import type { LoadingProps } from '@/interfaces/ui/loading-props.interface';

export const Loading = ({ 
  message = 'Loading...', 
  size = 'md', 
  variant = 'default',
  className = ''
}: LoadingProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  const spinner = (
    <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
  )

  if (variant === 'card') {
    return (
      <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center ${className}`}>
        <Card className="shadow-xl">
          <CardContent className="p-8">
            <div className="text-center space-y-4">
              {spinner}
              <p className="text-muted-foreground">{message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (variant === 'inline') {
    return (
      <div className={`flex items-center justify-center space-x-2 ${className}`}>
        {spinner}
        <span className="text-muted-foreground">{message}</span>
      </div>
    )
  }

  return (
    <div className={`h-[100vh] flex items-center justify-center space-x-2 ${className}`}>
      {spinner}
      <span className="text-muted-foreground">{message}</span>
    </div>
  )
}