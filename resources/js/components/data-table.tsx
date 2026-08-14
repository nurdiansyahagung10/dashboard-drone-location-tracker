import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DeleteModal from '@/components/delete-modal';
import { router } from '@inertiajs/react';

interface Column<T> {
    key: string;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    itemsPerPage?: number;
    onView?: (item: T) => void;
    onEdit?: (item: T) => void;
    onDelete?: (item: T) => void;
}

export default function DataTable<T extends { id: number }>({
    data,
    columns,
    itemsPerPage = 10,
    onView,
    onEdit,
    onDelete,
}: DataTableProps<T>) {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; item: T | null; isLoading: boolean }>({
        isOpen: false,
        item: null,
        isLoading: false,
    });

    const sortedData = useMemo(() => {
        if (!sortKey) return data;
        return [...data].sort((a: any, b: any) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }, [data, sortKey, sortDir]);

    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const paginatedData = sortedData.slice(startIdx, startIdx + itemsPerPage);

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDir('asc');
        }
        setCurrentPage(1);
    };

    const handlePrevPage = () => {
        setCurrentPage((p) => Math.max(1, p - 1));
    };

    const handleNextPage = () => {
        setCurrentPage((p) => Math.min(totalPages, p + 1));
    };

    const handleDeleteClick = (item: T) => {
        setDeleteModal({ isOpen: true, item, isLoading: false });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.item || !onDelete) return;
        setDeleteModal((prev) => ({ ...prev, isLoading: true }));
        await onDelete(deleteModal.item);
        // Reload current page to refresh data
        await router.reload();
        setDeleteModal((prev) => ({ ...prev, isOpen: false }));

    };

    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, item: null, isLoading: false });
    };

    return (
        <div className="flex flex-col gap-4">
            <DeleteModal
                isOpen={deleteModal.isOpen}
                title="Hapus Item?"
                description="Tindakan ini tidak dapat dibatalkan. Data akan dihapus secara permanen."
                isLoading={deleteModal.isLoading}
                onConfirm={handleDeleteConfirm}
                onCancel={handleDeleteCancel}
            />
            <div className="overflow-auto bg-sidebar text-sidebar-foreground rounded-lg border border-border">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className=" border-b border-border">
                            {columns.map((col) => (
                                <th
                                    key={col.key}
                                    className="px-4 py-3 font-medium cursor-pointer   transition-colors"
                                    onClick={() => col.sortable !== false && handleSort(col.key)}
                                >
                                    <div className="flex items-center gap-2 justify-center">
                                        {col.label}
                                        {col.sortable !== false && sortKey === col.key && (
                                            <span className="text-xs">
                                                {sortDir === 'asc' ? '↑' : '↓'}
                                            </span>
                                        )}
                                    </div>
                                </th>
                            ))}
                            {(onView || onEdit || onDelete) && (
                                <th className="px-4 py-3 font-medium text-center">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row) => (
                            <tr
                                key={row.id}
                                className="border-t text-center border-border  transition-colors"
                            >
                                {columns.map((col) => (
                                    <td key={col.key} className="px-4 py-3">
                                        {col.render
                                            ? col.render((row as any)[col.key], row)
                                            : (row as any)[col.key]}
                                    </td>
                                ))}
                                {(onView || onEdit || onDelete) && (
                                    <td className="px-4 py-3 flex gap-2 justify-center items-center">
                                        <div className="flex gap-2">
                                            {onView && (
                                                <Button
                                                    onClick={() => onView(row)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-md cursor-pointer"
                                                >
                                                    View
                                                </Button>
                                            )}
                                            {onEdit && (
                                                <Button
                                                    onClick={() => onEdit(row)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-md cursor-pointer"
                                                >
                                                    Edit
                                                </Button>
                                            )}
                                            {onDelete && (
                                                <Button
                                                    onClick={() => handleDeleteClick(row)}
                                                    variant="outline"
                                                    size="sm"
                                                    className="rounded-md cursor-pointer text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Footer */}
            <div className="flex items-center justify-between px-4 py-3 bg-sidebar text-sidebar-foreground rounded-lg border border-border">
                <div className="text-sm text-muted-foreground">
                    Showing {paginatedData.length === 0 ? 0 : startIdx + 1} to{' '}
                    {Math.min(startIdx + itemsPerPage, sortedData.length)} of{' '}
                    {sortedData.length} items
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className="rounded-md"
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                    </Button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                            let page: number;
                            if (totalPages <= 5) {
                                page = i + 1;
                            } else if (currentPage <= 3) {
                                page = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                page = totalPages - 4 + i;
                            } else {
                                page = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={page}
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-2 py-1 rounded text-sm font-medium transition-colors ${currentPage === page
                                        ? 'bg-white text-black'
                                        : 'hover:bg-sidebar-accent'
                                        }`}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="rounded-md"
                    >
                        Next
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
