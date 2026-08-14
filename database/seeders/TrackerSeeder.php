<?php

namespace Database\Seeders;

use App\Models\Device;
use App\Models\DeviceConfig;
use App\Models\SafeZone;
use App\Models\Telemetry;
use App\Models\User;
use Illuminate\Database\Seeder;

class TrackerSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Tracker Admin',
            'email' => 'admin@tracker.local',
        ]);

        // Generate secure device uid and secret similar to controller
        $uid = bin2hex(random_bytes(16));
        while (Device::where('device_uid', $uid)->exists()) {
            $uid = bin2hex(random_bytes(16));
        }
        $secret = hash('sha256', random_bytes(32));

        $device = Device::create([
            'user_id' => $user->id,
            'name' => 'Tracker-001',
            'model' => 'GPS-X',
            'firmware_version' => '1.0.0',
            'is_active' => true,
            'device_uid' => $uid,
            'device_secret' => $secret,
        ]);

        // create default configuration for seeded device
        DeviceConfig::create([
            'user_id' => $user->id,
            'device_id' => $device->id,
            'mode' => 'manual',
            'state' => 'active',
        ]);

        SafeZone::create([
            'user_id' => $user->id,
            'name' => 'Office',
            'center_lat' => -6.200000,
            'center_lng' => 106.816666,
            'radius_m' => 200,
        ]);

        // sample telemetry
        Telemetry::create([
            'user_id' => $user->id,
            'device_id' => $device->id,
            'latitude' => -6.2001,
            'longitude' => 106.8170,
            'speed' => 12.3,
            'heading' => 180,
            'battery_voltage' => 12.4,
            'battery_percentage' => 78,
            'solar_voltage' => 0,
            'solar_current' => 0,
            'cellular_signal' => 4,
            'raw_payload' => null,
        ]);
    }
}
