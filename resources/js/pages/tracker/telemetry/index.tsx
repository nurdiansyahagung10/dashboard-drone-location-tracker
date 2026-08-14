import { Head } from '@inertiajs/react';
import DataTable from '@/components/data-table';
import { index as telemetryIndex, show as telemetryShow, destroy as telemetryDestroy } from '@/routes/telemetry';

export default function TelemetryIndex({ telemetry = [] }: { telemetry?: any[] }) {
    const list = Array.isArray(telemetry) ? telemetry : [];

    const columns = [
        {
            key: 'created_at',
            label: 'Time',
            sortable: true,
            render: (value: string) => new Date(value).toLocaleString(),
        },
        {
            key: 'device_name',
            label: 'Device',
            sortable: true,
            render: (value: string, row: any) => row.device?.name ?? '—',
        },
        {
            key: 'latitude',
            label: 'Coordinates',
            sortable: false,
            render: (value: number, row: any) => `${row.latitude}, ${row.longitude}`,
        },
        {
            key: 'speed',
            label: 'Speed',
            sortable: true,
            render: (value: number) => `${value ?? '—'} km/h`,
        },
        {
            key: 'battery_percentage',
            label: 'Battery %',
            sortable: true,
            render: (value: number) => `${value ?? '—'}%`,
        },
    ];

    return (
        <>
            <Head title="Telemetry" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Telemetry</h1>
                </div>

                <DataTable
                    data={list}
                    columns={columns}
                    itemsPerPage={10}
                    onView={(item) => {
                        window.location.href = telemetryShow(item.id).url;
                    }}
                    onDelete={async (item) => {
                        await fetch(telemetryDestroy(item.id).url, {
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

TelemetryIndex.layout = { breadcrumbs: [{ title: 'Telemetry', href: telemetryIndex().url }] };
