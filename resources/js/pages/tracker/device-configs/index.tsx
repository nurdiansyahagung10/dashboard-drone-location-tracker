import { Head } from '@inertiajs/react';
import deviceConfigs from '@/routes/device-configs'

export default function DeviceConfigsIndex({ configs }: { configs: any[] }) {
    return (
        <>
            <Head title="Device Configs" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Device Configurations</h1>
                </div>

                <div className="overflow-auto bg-white rounded mt-4">
                    <table className="min-w-full text-sm">
                        <thead>
                            <tr className="text-left">
                                <th className="px-4 py-3">ID</th>
                                <th className="px-4 py-3">Device</th>
                                <th className="px-4 py-3">Mode</th>
                                <th className="px-4 py-3">State</th>
                                <th className="px-4 py-3">Updated</th>
                            </tr>
                        </thead>
                        <tbody>
                            {configs.map((c) => (
                                <tr key={c.id} className="border-t">
                                    <td className="px-4 py-3">{c.id}</td>
                                    <td className="px-4 py-3">{c.device?.name ?? '—'}</td>
                                    <td className="px-4 py-3">{c.mode}</td>
                                    <td className="px-4 py-3">{c.state}</td>
                                    <td className="px-4 py-3">{new Date(c.updated_at).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

DeviceConfigsIndex.layout = { breadcrumbs: [{ title: 'Configs', href: deviceConfigs.index() }] };
