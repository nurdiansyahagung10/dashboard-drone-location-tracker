import { AlertCircle, X } from 'lucide-react';

interface FormErrorProps {
    errors?: Record<string, string[]>;
    onDismiss?: () => void;
}

export default function FormError({ errors, onDismiss }: FormErrorProps) {
    if (!errors || Object.keys(errors).length === 0) return null;

    const errorMessages = Object.entries(errors)
        .flatMap(([field, messages]) => messages.map((msg) => `${field}: ${msg}`));

    return (
        <div className="rounded-lg border border-red-500/50 bg-red-50/10 p-4 flex items-start gap-3 mb-4">
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
    );
}
