import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function SafeZoneShow({ zone }: { zone: any }) {
    return (
        <>
            <Head title={`Safe Zone: ${zone.name}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Safe Zone Details</h1>
                    <Button asChild variant="ghost" size="sm" className="rounded-lg">
                        <Link href="/safe-zones">Back</Link>
                    </Button>
                </div>
                <div className="mt-4 mx-auto w-full max-w-5xl rounded-lg p-0">
                    <div className="flex gap-6">
                        <div className="flex-1 bg-sidebar text-sidebar-foreground rounded-lg p-6">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label>Name</Label>
                                    <Input readOnly value={zone.name ?? ''} className="mt-1 block w-full rounded-lg" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Center Latitude</Label>
                                        <Input readOnly value={zone.center_lat ?? ''} className="mt-1 block w-full rounded-lg" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Center Longitude</Label>
                                        <Input readOnly value={zone.center_lng ?? ''} className="mt-1 block w-full rounded-lg" />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Radius (meters)</Label>
                                    <Input readOnly value={zone.radius_m ? `${zone.radius_m} m` : ''} className="mt-1 block w-full rounded-lg" />
                                </div>

                                <div className="grid gap-2">
                                    <Label>Owner</Label>
                                    <Input readOnly value={zone.user ? zone.user.name : '—'} className="mt-1 block w-full rounded-lg" />
                                </div>

                                <div className="grid gap-2">
                                    <Label>Created At</Label>
                                    <Input readOnly value={new Date(zone.created_at).toLocaleString()} className="mt-1 block w-full rounded-lg" />
                                </div>

                                {zone.devices && zone.devices.length > 0 && (
                                    <div className="pt-4">
                                        <h2 className="text-lg font-medium">Linked Devices</h2>
                                        <div className="overflow-auto mt-2 bg-muted rounded-md p-2">
                                            <table className="w-full text-sm">
                                                <thead>
                                                    <tr className="text-left text-xs text-muted-foreground">
                                                        <th className="px-2 py-1">Device</th>
                                                        <th className="px-2 py-1">Active</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {zone.devices.map((d: any) => (
                                                        <tr key={d.id} className="border-t">
                                                            <td className="px-2 py-2">{d.name}</td>
                                                            <td className="px-2 py-2">{d.pivot?.is_active ? 'Yes' : 'No'}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

SafeZoneShow.layout = {
    breadcrumbs: [{ title: 'Safe Zones', href: '/safe-zones' }, { title: 'Details' }],
};
