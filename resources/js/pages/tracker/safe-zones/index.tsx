import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/data-table';
import safeZonesRoute from '@/routes/safe-zones';

export default function SafeZonesIndex({ zones = [] }: { zones?: any[] }) {
    const list = Array.isArray(zones) ? zones : [];

    const columns = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
        },
        {
            key: 'center_lat',
            label: 'Coordinates',
            sortable: false,
            render: (value: number, row: any) => `${row.center_lat}, ${row.center_lng}`,
        },
        {
            key: 'radius_m',
            label: 'Radius (m)',
            sortable: true,
            render: (value: number) => value,
        },
    ];

    return (
        <>
            <Head title="Safe Zones" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Safe Zones</h1>
                    <Button asChild className="rounded-lg">
                        <a href={safeZonesRoute.create().url}>New Zone</a>
                    </Button>
                </div>

                <DataTable
                    data={list}
                    columns={columns}
                    itemsPerPage={10}
                    onView={(item) => {
                        window.location.href = safeZonesRoute.show(item.id).url;
                    }}
                    onEdit={(item) => {
                        window.location.href = safeZonesRoute.edit(item.id).url;
                    }}
                    onDelete={async (item) => {
                        await fetch(safeZonesRoute.destroy(item.id).url, {
                            method: 'DELETE',
                            headers: {
                                'X-CSRF-TOKEN': (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content || '',
                            },
                        });
                    }}
                />
            </div>
        </>
    );
}

SafeZonesIndex.layout = {
    breadcrumbs: [
        { title: 'Safe Zones', href: safeZonesRoute.index().url },
    ],
};
