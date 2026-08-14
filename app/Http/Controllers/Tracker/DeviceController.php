<?php

namespace App\Http\Controllers\Tracker;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\SafeZone;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Str;

class DeviceController extends Controller
{
    public function index(): Response
    {
        $devices = Device::with('user')->orderBy('id','desc')->get();
        return Inertia::render('tracker/devices/index', compact('devices'));
    }

    public function create(): Response
    {
        return Inertia::render('tracker/devices/create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'device_uid' => 'nullable|string|max:255',
            'device_secret' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
            'firmware_version' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
        ]);

        $data['user_id'] = $request->user()->id ?? 1;

        // Ensure device_uid and device_secret are generated securely when not provided
        if (empty($data['device_uid'])) {
            do {
                $uid = bin2hex(random_bytes(16));
            } while (Device::where('device_uid', $uid)->exists());
            $data['device_uid'] = $uid;
        }

        if (empty($data['device_secret'])) {
            // 32 bytes -> 64 hex chars via sha256 of random bytes
            $data['device_secret'] = hash('sha256', random_bytes(32));
        }

        Device::create($data);

        return redirect()->route('devices.index')->with('success','Device created');
    }

    public function edit(Device $device): Response
    {
        return Inertia::render('tracker/devices/edit', compact('device'));
    }

    public function show(Device $device): Response
    {
        $device->load('user', 'configs');
        // Append computed attribute so it's serialized to the frontend
        $device->setAppends(['user_config']);
        $safeZones = SafeZone::where('user_id', $device->user_id)->get(['id', 'name']);
        return Inertia::render('tracker/devices/show', compact('device', 'safeZones'));
    }

    public function update(Request $request, Device $device)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'device_uid' => 'nullable|string|max:255',
            'device_secret' => 'nullable|string|max:255',
            'model' => 'nullable|string|max:255',
            'firmware_version' => 'nullable|string|max:255',
            'is_active' => 'sometimes|boolean',
        ]);

        $device->update($data);

        return redirect()->route('devices.index')->with('success','Device updated');
    }

    public function destroy(Device $device)
    {
        $device->delete();
        return redirect()->route('devices.index')->with('success','Device deleted');
    }
}
