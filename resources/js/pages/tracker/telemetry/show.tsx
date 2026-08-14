import { Head, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export default function TelemetryShow({ telemetry }: { telemetry: any }) {
    return (
        <>
            <Head title={`Telemetry #${telemetry.id}`} />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Telemetry Details</h1>
                    <Button asChild variant="ghost" size="sm" className="rounded-lg">
                        <Link href="/telemetry">Back</Link>
                    </Button>
                </div>
                <div className="mt-4 mx-auto w-full max-w-5xl rounded-lg p-0">
                    <div className="flex gap-6">
                        <div className="flex-1 bg-sidebar text-sidebar-foreground rounded-lg p-6">
                            <div className="grid gap-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Device</Label>
                                        <Input readOnly value={telemetry.device ? telemetry.device.name : '—'} className="mt-1 block w-full rounded-lg" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>User</Label>
                                        <Input readOnly value={telemetry.user ? telemetry.user.name : '—'} className="mt-1 block w-full rounded-lg" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Latitude</Label>
                                        <Input readOnly value={telemetry.latitude ?? ''} className="mt-1 block w-full rounded-lg" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Longitude</Label>
                                        <Input readOnly value={telemetry.longitude ?? ''} className="mt-1 block w-full rounded-lg" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Speed</Label>
                                        <Input readOnly value={telemetry.speed ? `${telemetry.speed} km/h` : ''} className="mt-1 block w-full rounded-lg" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Heading</Label>
                                        <Input readOnly value={telemetry.heading ? `${telemetry.heading}°` : ''} className="mt-1 block w-full rounded-lg" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Battery Voltage</Label>
                                        <Input readOnly value={telemetry.battery_voltage ? `${telemetry.battery_voltage} V` : ''} className="mt-1 block w-full rounded-lg" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Battery Percentage</Label>
                                        <Input readOnly value={telemetry.battery_percentage ? `${telemetry.battery_percentage}%` : ''} className="mt-1 block w-full rounded-lg" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Solar Voltage</Label>
                                        <Input readOnly value={telemetry.solar_voltage ? `${telemetry.solar_voltage} V` : ''} className="mt-1 block w-full rounded-lg" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Solar Current</Label>
                                        <Input readOnly value={telemetry.solar_current ? `${telemetry.solar_current} A` : ''} className="mt-1 block w-full rounded-lg" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label>Cellular Signal</Label>
                                        <Input readOnly value={telemetry.cellular_signal ?? ''} className="mt-1 block w-full rounded-lg" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Recorded At</Label>
                                        <Input readOnly value={new Date(telemetry.created_at).toLocaleString()} className="mt-1 block w-full rounded-lg" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

TelemetryShow.layout = {
    breadcrumbs: [{ title: 'Telemetry', href: '/telemetry' }, { title: 'Details' }],
};
