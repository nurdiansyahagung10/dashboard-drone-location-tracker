import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Head, usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import devices from '@/routes/devices';
import { Button } from '@/components/ui/button';
import DeleteModal from '@/components/delete-modal';
import FormAlerts from '@/components/form-alerts';
import { useState } from 'react';

export default function DeviceEdit({ device }: { device: any }) {
    const { props } = usePage();
    const errors = (props.errors as any) || {};
    const flash = (props.flash as any) || {};
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showErrors, setShowErrors] = useState(Object.keys(errors).length > 0);

    const handleSubmit = () => {
        setIsSubmitting(true);
    };

    return (
        <>
            <Head title={`Edit ${device.name}`} />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Edit Device</h1>
                </div>

                <div className="mt-4 mx-auto w-full max-w-lg bg-sidebar text-sidebar-foreground rounded-lg p-6">
                    <FormAlerts errors={errors} success={flash.success} onDismiss={() => setShowErrors(false)} />
                    <form method="post" action={devices.update({ device }).url} className="grid gap-4 w-full" onSubmit={handleSubmit}>
                        <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content} />
                        <input type="hidden" name="_method" value="PUT" />
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input id="name" name="name" className="mt-1 block w-full rounded-lg" defaultValue={device.name} required disabled={isSubmitting} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="model">Model</Label>
                            <Input id="model" name="model" className="mt-1 block w-full rounded-lg" defaultValue={device.model} disabled={isSubmitting} />
                        </div>

                        {/* device_uid and device_secret are generated/managed by the backend; removed from edit form */}

                        <div className="grid gap-2">
                            <Label htmlFor="firmware_version">Firmware</Label>
                            <Input id="firmware_version" name="firmware_version" className="mt-1 block w-full rounded-lg" defaultValue={device.firmware_version} disabled={isSubmitting} />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" className="rounded-lg" disabled={isSubmitting}>
                                {isSubmitting ? 'Updating...' : 'Update'}
                            </Button>

                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

DeviceEdit.layout = {
    breadcrumbs: [{ title: 'Devices', href: devices.index() }, { title: 'Edit' }],
};
