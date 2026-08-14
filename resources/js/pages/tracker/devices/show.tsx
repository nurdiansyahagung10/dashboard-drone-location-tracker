import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import devices from '@/routes/devices';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectTrigger,
    SelectContent,
    SelectItem,
    SelectValue,
} from '@/components/ui/select';
import { Eye, EyeOff, Copy, Check, AlertCircle, CheckCircle } from 'lucide-react';

export default function DeviceShow({ device, safeZones = [] }: { device: any; safeZones?: any[] }) {
    const { props } = usePage();
    const flash = props.flash as any;

    const [copiedUid, setCopiedUid] = useState(false);
    const [showSecret, setShowSecret] = useState(false);
    const [copiedSecret, setCopiedSecret] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNotification, setShowNotification] = useState(flash?.success || flash?.error ? true : false);
    const [notification, setNotification] = useState({
        type: flash?.error ? 'error' : 'success',
        message: flash?.error || flash?.success || '',
    });

    const mask = (s: string | undefined) => (s ? '•'.repeat(s.length) : '');

    const copyToClipboard = async (text: string | undefined, setCopied: (v: boolean) => void) => {
        if (!text) return;
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch (e) {
            // ignore copy errors
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        setIsSubmitting(true);
        // Form will submit naturally and page will reload
    };

    return (
        <>
            <Head title={`Device ${device.name}`} />

            {/* Notification */}
            {showNotification && (
                <div className={`fixed top-4 right-4 rounded-lg border p-4 flex items-start gap-3 z-50 max-w-md animate-in slide-in-from-top ${
                    notification.type === 'error'
                        ? 'bg-red-50/10 border-red-500/50'
                        : 'bg-green-50/10 border-green-500/50'
                }`}>
                    {notification.type === 'error' ? (
                        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    ) : (
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                        <p className={`text-sm font-medium ${
                            notification.type === 'error' ? 'text-red-600' : 'text-green-600'
                        }`}>
                            {notification.message}
                        </p>
                    </div>
                    <button
                        onClick={() => setShowNotification(false)}
                        className={`text-${notification.type === 'error' ? 'red' : 'green'}-500 hover:text-${notification.type === 'error' ? 'red' : 'green'}-600 flex-shrink-0`}
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-semibold">Device Details</h1>
                    <Button asChild variant="ghost" size="sm" className="rounded-lg">
                        <Link href={devices.index().url}>Back</Link>
                    </Button>
                </div>
                <div className="mt-4 mx-auto w-full max-w-5xl rounded-lg p-0">
                    <div className="flex gap-6">
                        <div className="flex-1 bg-sidebar text-sidebar-foreground rounded-lg p-6">
                            <div className="grid gap-4">
                                <div className="grid gap-2">
                                    <Label>Name</Label>
                                    <Input readOnly value={device.name ?? ''} className="mt-1 block w-full rounded-lg" />
                                </div>

                                <div className="grid gap-2">
                                    <Label>Model</Label>
                                    <Input readOnly value={device.model ?? ''} className="mt-1 block w-full rounded-lg" />
                                </div>

                                <div className="grid gap-2">
                                    <Label>Device UID</Label>
                                    <div className="flex items-center gap-2">
                                        <Input readOnly value={device.device_uid ?? ''} className="mt-1 block w-full rounded-lg font-mono" />
                                        <Button type="button" variant="ghost" size="sm" className="ml-1" onClick={() => copyToClipboard(device.device_uid, setCopiedUid)} aria-label="Copy UID">
                                            {copiedUid ? <Check className="size-4" /> : <Copy className="size-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Device Secret</Label>
                                    <div className="flex items-center gap-2">
                                        <Input readOnly value={showSecret ? device.device_secret ?? '' : mask(device.device_secret)} className="mt-1 block w-full rounded-lg font-mono" />
                                        <Button type="button" variant="outline" size="sm" className="ml-1" onClick={() => setShowSecret(v => !v)} aria-label={showSecret ? 'Hide secret' : 'Show secret'}>
                                            {showSecret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </Button>
                                        <Button type="button" variant="ghost" size="sm" className="ml-1" onClick={() => copyToClipboard(device.device_secret, setCopiedSecret)} aria-label="Copy secret">
                                            {copiedSecret ? <Check className="size-4" /> : <Copy className="size-4" />}
                                        </Button>
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label>Firmware</Label>
                                    <Input readOnly value={device.firmware_version ?? ''} className="mt-1 block w-full rounded-lg" />
                                </div>
                            </div>
                        </div>

                        <aside className="w-80">
                            <div className="bg-sidebar text-sidebar-foreground rounded-lg p-4">
                                <h2 className="text-lg font-medium">Edit Configuration</h2>
                                <form method="post" action={`/devices/${device.id}/config`} className="grid gap-3 mt-3" onSubmit={handleSubmit}>
                                    <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content} />

                                    <div className="grid gap-1">
                                        <Label htmlFor="mode">Mode</Label>
                                        <Select name="mode" defaultValue={(device.configs && device.configs[0]) ? device.configs[0].mode : 'manual'} disabled={isSubmitting}>
                                            <SelectTrigger className="mt-1 block w-full rounded-lg [&>svg]:hidden">
                                                <SelectValue placeholder="Select mode" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="manual">Manual</SelectItem>
                                                <SelectItem value="smart">Smart</SelectItem>
                                                <SelectItem value="monitor">Monitor</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-1">
                                        <Label htmlFor="state">State</Label>
                                        <Select name="state" defaultValue={(device.configs && device.configs[0]) ? device.configs[0].state : 'active'} disabled={isSubmitting}>
                                            <SelectTrigger className="mt-1 block w-full rounded-lg [&>svg]:hidden">
                                                <SelectValue placeholder="Select state" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="parking">Parking</SelectItem>
                                                <SelectItem value="sleep">Sleep</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="grid gap-1">
                                        <Label htmlFor="safe_zone_id">Safe Zone</Label>
                                        <Select name="safe_zone_id" defaultValue={device.safe_zone_id?.toString() || ''} disabled={isSubmitting}>
                                            <SelectTrigger className="mt-1 block w-full rounded-lg [&>svg]:hidden">
                                                <SelectValue placeholder="Select safe zone" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="">None</SelectItem>
                                                {safeZones.map((zone) => (
                                                    <SelectItem key={zone.id} value={zone.id.toString()}>
                                                        {zone.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <span className="py-2 text-xs text-muted-foreground truncate ">Updated: {device.user_config ? new Date(device.user_config.updated_at).toLocaleString() : ''}</span>

                                    <div className="flex justify-end pt-2">
                                        <Button type="submit" className="rounded-lg" disabled={isSubmitting}>
                                            {isSubmitting ? 'Updating...' : 'Update'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}

DeviceShow.layout = {
    breadcrumbs: [{ title: 'Devices', href: devices.index() }, { title: 'Details' }],
};
