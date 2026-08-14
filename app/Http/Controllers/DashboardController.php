<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\SafeZone;
use App\Models\Telemetry;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $userId = auth()->id() ?? 1;

        // Summary Stats
        $totalDevices = Device::where('user_id', $userId)->count();
        $activeDevices = Device::where('user_id', $userId)->where('is_active', true)->count();
        $totalSafeZones = SafeZone::where('user_id', $userId)->count();
        $totalTelemetry = Telemetry::where('user_id', $userId)->count();

        // Latest Telemetry Data (last 10)
        $latestTelemetry = Telemetry::where('user_id', $userId)
            ->with('device')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(fn ($t) => [
                'id' => $t->id,
                'device_name' => $t->device?->name ?? 'Unknown',
                'latitude' => $t->latitude,
                'longitude' => $t->longitude,
                'speed' => $t->speed,
                'battery_percentage' => $t->battery_percentage,
                'created_at' => $t->created_at,
            ]);

        // Average Speed (last 30 days)
        $averageSpeed = Telemetry::where('user_id', $userId)
            ->where('created_at', '>=', now()->subDays(30))
            ->avg('speed') ?? 0;

        // Average Battery (last record per device)
        $avgBattery = Telemetry::where('user_id', $userId)
            ->selectRaw('device_id, battery_percentage')
            ->whereIn('id', function ($query) use ($userId) {
                $query->selectRaw('MAX(id)')
                    ->from('telemetry')
                    ->where('user_id', $userId)
                    ->groupBy('device_id');
            })
            ->avg('battery_percentage') ?? 0;

        // Devices by Status
        $devicesByStatus = Device::where('user_id', $userId)
            ->selectRaw('is_active, COUNT(*) as count')
            ->groupBy('is_active')
            ->get()
            ->mapWithKeys(fn ($item) => [
                ($item->is_active ? 'Active' : 'Inactive') => $item->count,
            ]);

        // Telemetry Chart Data (daily count last 7 days)
        $telemetryChart = Telemetry::where('user_id', $userId)
            ->where('created_at', '>=', now()->subDays(7))
            ->selectRaw('DATE(created_at) as date, COUNT(*) as count')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($item) => [
                'date' => $item->date,
                'count' => $item->count,
            ]);

        // Speed Distribution (last 7 days)
        $speedData = Telemetry::where('user_id', $userId)
            ->where('created_at', '>=', now()->subDays(7))
            ->selectRaw('DATE(created_at) as date, AVG(speed) as avg_speed')
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(fn ($item) => [
                'date' => $item->date,
                'speed' => round($item->avg_speed ?? 0, 2),
            ]);

        return Inertia::render('dashboard', [
            'stats' => [
                'totalDevices' => $totalDevices,
                'activeDevices' => $activeDevices,
                'totalSafeZones' => $totalSafeZones,
                'totalTelemetry' => $totalTelemetry,
                'averageSpeed' => round($averageSpeed, 2),
                'avgBattery' => round($avgBattery, 1),
            ],
            'devicesByStatus' => $devicesByStatus,
            'latestTelemetry' => $latestTelemetry,
            'telemetryChart' => $telemetryChart,
            'speedData' => $speedData,
        ]);
    }
}
