import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteModalProps {
    isOpen: boolean;
    title: string;
    description?: string;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export default function DeleteModal({
    isOpen,
    title,
    description,
    isLoading = false,
    onConfirm,
    onCancel,
}: DeleteModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-lg border border-border bg-sidebar text-sidebar-foreground shadow-lg p-6 animate-in zoom-in-95">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
                        <AlertCircle className="h-6 w-6 text-red-500" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
                        {description && (
                            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                        )}
                    </div>
                    <button
                        onClick={onCancel}
                        disabled={isLoading}
                        className="text-muted-foreground hover:text-foreground disabled:opacity-50"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Divider */}
                <div className="my-4 h-px bg-border" />

                {/* Buttons */}
                <div className="flex gap-3 justify-end">
                    <Button
                        variant="outline"
                        onClick={onCancel}
                        disabled={isLoading}
                        className="rounded-lg"
                    >
                        Batal
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={onConfirm}
                        disabled={isLoading}
                        className="rounded-lg"
                    >
                        {isLoading ? 'Menghapus...' : 'Hapus'}
                    </Button>
                </div>
            </div>
        </div>
    );
}
