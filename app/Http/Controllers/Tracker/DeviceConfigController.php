<?php

namespace App\Http\Controllers\Tracker;

use App\Http\Controllers\Controller;
use App\Models\DeviceConfig;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\Device;

class DeviceConfigController extends Controller
{
    public function index(): Response
    {
        $configs = DeviceConfig::with('device','user')->orderBy('id','desc')->get();
        return Inertia::render('tracker/device-configs/index', compact('configs'));
    }

    public function storeOrUpdate(Request $request, Device $device)
    {
        $data = $request->validate([
            'mode' => 'nullable|in:manual,smart,monitor',
            'state' => 'nullable|in:active,parking,sleep',
            'safe_zone_id' => 'nullable|exists:safe_zones,id',
        ]);

        $payload = [
            'user_id' => $request->user()->id ?? 1,
            'mode' => $data['mode'] ?? 'manual',
            'state' => $data['state'] ?? 'active',
        ];

        // create or update single config record per device
        DeviceConfig::updateOrCreate(
            ['device_id' => $device->id],
            array_merge($payload, ['device_id' => $device->id])
        );

        // Update device's safe_zone_id
        if (isset($data['safe_zone_id'])) {
            $device->update(['safe_zone_id' => $data['safe_zone_id'] ?: null]);
        }

        return redirect()->back()->with('success', 'Configuration saved.');
    }
}
