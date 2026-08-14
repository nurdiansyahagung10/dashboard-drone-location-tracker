import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FormAlerts from '@/components/form-alerts';
import devices from '@/routes/devices';
import { useEffect, useState } from 'react';

export default function DeviceCreate() {
    const { props } = usePage();

    const errors = (props.errors as any) || {};
    const flash = (props.flash as any) || {};

    const { data, setData, post, processing } = useForm({
        name: '',
        model: '',
        firmware_version: '',
    });

    const [showErrors, setShowErrors] = useState(
        Object.keys(errors).length > 0
    );

    // Munculkan kembali alert ketika error dari backend berubah
    useEffect(() => {
        setShowErrors(Object.keys(errors).length > 0);
    }, [props.errors]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Reset state alert sebelum submit
        setShowErrors(false);

        post(devices.store().url);
    };

    return (
        <>
            <Head title="Create Device" />

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">
                        Create Device
                    </h1>

                    <Button
                        asChild
                        variant="ghost"
                        size="sm"
                        className="rounded-lg"
                    >
                        <Link href={devices.index()}>
                            Back
                        </Link>
                    </Button>
                </div>

                <div className="mx-auto mt-4 w-full max-w-lg rounded-lg bg-sidebar p-6 text-sidebar-foreground">

                    {/* Form Alerts */}
                    {showErrors || flash.success ? (
                        <FormAlerts
                            errors={showErrors ? errors : {}}
                            success={flash.success}
                            onDismiss={() => setShowErrors(false)}
                        />
                    ) : null}

                    <form
                        onSubmit={handleSubmit}
                        className="grid w-full gap-4"
                    >
                        <div className="grid gap-2">
                            <Label htmlFor="name">
                                Name
                            </Label>

                            <Input
                                id="name"
                                name="name"
                                value={data.name}
                                onChange={(e) =>
                                    setData('name', e.target.value)
                                }
                                className="mt-1 block w-full rounded-lg"
                                required
                                disabled={processing}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="model">
                                Model
                            </Label>

                            <Input
                                id="model"
                                name="model"
                                value={data.model}
                                onChange={(e) =>
                                    setData('model', e.target.value)
                                }
                                className="mt-1 block w-full rounded-lg"
                                disabled={processing}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="firmware_version">
                                Firmware
                            </Label>

                            <Input
                                id="firmware_version"
                                name="firmware_version"
                                value={data.firmware_version}
                                onChange={(e) =>
                                    setData(
                                        'firmware_version',
                                        e.target.value
                                    )
                                }
                                className="mt-1 block w-full rounded-lg"
                                disabled={processing}
                            />
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <Button
                                type="submit"
                                className="rounded-lg"
                                disabled={processing}
                            >
                                {processing
                                    ? 'Saving...'
                                    : 'Save'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

DeviceCreate.layout = {
    breadcrumbs: [
        {
            title: 'Devices',
            href: devices.index(),
        },
        {
            title: 'Create',
        },
    ],
};
