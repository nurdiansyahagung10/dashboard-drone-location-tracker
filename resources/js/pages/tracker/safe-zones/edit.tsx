import { Head, useForm, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MapPicker from '@/components/map-picker';
import DeleteModal from '@/components/delete-modal';
import FormAlerts from '@/components/form-alerts';
import safeZones from '@/routes/safe-zones';

export default function SafeZoneEdit({ zone }: { zone: any }) {
    const { props } = usePage();
    const errors = (props.errors as any) || {};
    const flash = (props.flash as any) || {};
    const { data, setData, patch, processing } = useForm({
        name: zone.name,
        center_lat: Number(zone.center_lat),
        center_lng: Number(zone.center_lng),
        radius_m: Number(zone.radius_m),
    });
    const [showErrors, setShowErrors] = useState(Object.keys(errors).length > 0);
    const handleLocationChange = (newLat: number, newLng: number) => {
        setData('center_lat', newLat);
        setData('center_lng', newLng);
    };

    const handleRadiusChange = (newRadius: number) => {
        setData('radius_m', newRadius);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        patch(safeZones.update(zone.id).url);
    };


    return (
        <>
            <Head title={`Edit Safe Zone: ${zone.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Edit Safe Zone</h1>
                    <Button asChild variant="ghost" size="sm" className="rounded-lg">
                        <a href={safeZones.index().url}>Back</a>
                    </Button>
                </div>

                <div className="mt-4 mx-auto w-full max-w-2xl bg-sidebar text-sidebar-foreground rounded-lg p-6">
                    <FormAlerts errors={errors} success={flash.success} onDismiss={() => setShowErrors(false)} />
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <input type="hidden" name="_method" value="PATCH" />
                        <input type="hidden" name="center_lat" value={data.center_lat} />
                        <input type="hidden" name="center_lng" value={data.center_lng} />
                        <input type="hidden" name="radius_m" value={data.radius_m} />

                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full rounded-lg"
                                required
                                disabled={processing}
                            />
                        </div>

                        <div>
                            <Label className="mb-3 block">Map Location & Radius</Label>
                            <MapPicker
                                lat={data.center_lat}
                                lng={data.center_lng}
                                radius={data.radius_m}
                                onChangeLocation={handleLocationChange}
                                onChangeRadius={handleRadiusChange}
                            />
                        </div>

                        <div className="flex gap-2 pt-2">
                            <Button
                                type="submit"
                                className="rounded-lg"
                                disabled={processing}
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

SafeZoneEdit.layout = {
    breadcrumbs: [{ title: 'Devices', href: safeZones.index() }, { title: 'Edit' }],
};
