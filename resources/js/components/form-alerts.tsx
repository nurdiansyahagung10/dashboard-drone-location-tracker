import { AlertCircle, CheckCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FormAlertsProps {
    errors?: Record<string, string[]>;
    success?: string;
    onDismiss?: () => void;
}

export default function FormAlerts({ errors, success, onDismiss }: FormAlertsProps) {
    const [showSuccess, setShowSuccess] = useState(!!success);

    // Auto-dismiss success after 3 seconds
    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                setShowSuccess(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [success]);

    const hasErrors = errors && Object.keys(errors).length > 0;

    if (!hasErrors && !showSuccess) return null;

    const errorMessages = hasErrors
        ? Object.entries(errors!).flatMap(([field, messages]) => messages.map((msg) => `${field}: ${msg}`))
        : [];

    return (
        <div className="space-y-3 mb-4">
            {showSuccess && (
                <div className="rounded-lg border border-green-500/50 bg-green-50/10 p-4 flex items-start gap-3 animate-in slide-in-from-top">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-green-600">{success}</p>
                    </div>
                    <button
                        onClick={() => setShowSuccess(false)}
                        className="text-green-500 hover:text-green-600 flex-shrink-0"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}

            {hasErrors && (
                <div className="rounded-lg border border-red-500/50 bg-red-50/10 p-4 flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                        <p className="text-sm font-medium text-red-600 mb-2">Form Validation Error</p>
                        <ul className="text-xs text-red-500/80 space-y-1">
                            {errorMessages.map((msg, idx) => (
                                <li key={idx}>• {msg}</li>
                            ))}
                        </ul>
                    </div>
                    {onDismiss && (
                        <button
                            onClick={onDismiss}
                            className="text-red-500 hover:text-red-600 flex-shrink-0"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
