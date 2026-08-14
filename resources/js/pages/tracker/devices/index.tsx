import { Head } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import DataTable from '@/components/data-table';
import devices_route from '@/routes/devices';

export default function DevicesIndex({ devices = [] }: { devices?: any[] }) {
    const deviceList = Array.isArray(devices) ? devices : [];

    const columns = [
        {
            key: 'name',
            label: 'Name',
            sortable: true,
        },
        {
            key: 'model',
            label: 'Model',
            sortable: true,
            render: (value: string) => value ?? 'Unknown',
        },
        {
            key: 'device_uid',
            label: 'UID',
            sortable: false,
            render: (value: string) => value ? value.substring(0, 8) + '...' : '—',
        },
        {
            key: 'is_active',
            label: 'Status',
            sortable: true,
            render: (value: boolean) => (
                <div className="inline-flex items-center gap-2">
                    <span className={`inline-block h-2 w-2 rounded-full ${value ? 'bg-green-500' : 'bg-gray-400'}`} />
                    <span className={value ? 'text-green-600 font-medium text-sm' : 'text-gray-500 text-sm'}>
                        {value ? 'Active' : 'Disabled'}
                    </span>
                </div>
            ),
        },
    ];

    return (
        <>
            <Head title="Devices" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Devices</h1>
                    <Button asChild className="rounded-lg">
                        <a href={devices_route.create().url}>New Device</a>
                    </Button>
                </div>

                <DataTable
                    data={deviceList}
                    columns={columns}
                    itemsPerPage={10}
                    onView={(item) => {
                        window.location.href = devices_route.show(item.id).url;
                    }}
                    onEdit={(item) => {
                        window.location.href = devices_route.edit(item.id).url;
                    }}
                    onDelete={async (item) => {
                        await fetch(devices_route.destroy(item.id).url, {
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

DevicesIndex.layout = {
    breadcrumbs: [
        { title: 'Devices', href: devices_route.index() },
    ],
};
