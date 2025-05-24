import { useCallback } from 'react';
import toast from 'react-hot-toast';


interface ErrorHandlerOptions {
  showToast?: boolean;
  logToConsole?: boolean;
  reportToService?: boolean;
}

export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const {
    showToast = true,
    logToConsole = true,
    reportToService = false
  } = options;

  const handleError = useCallback((
    error: string | Error | unknown,
    context?: string
  ) => {
    let errorMessage: string;
    let errorDetails: any = null;

    if (typeof error === 'string') {
      errorMessage = error;
    } else if (error instanceof Error) {
      errorMessage = error.message;
      errorDetails = {
        name: error.name,
        stack: error.stack,
      };
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorMessage = (error as any).message;
      errorDetails = error;
    } else {
      errorMessage = 'Произошла неизвестная ошибка';
      errorDetails = error;
    }

    if (logToConsole) {
      const logContext = context ? `[${context}]` : '';
      console.error(`${logContext} Error:`, errorMessage, errorDetails);
    }

    if (showToast) {
      toast.error(errorMessage);
    }

    if (reportToService && process.env.NODE_ENV === 'production') {
      try {
        console.log('Error reported to monitoring service:', errorMessage);
      } catch (reportError) {
        console.warn('Failed to report error to monitoring service:', reportError);
      }
    }
  }, [showToast, logToConsole, reportToService]);

  return { handleError };
};