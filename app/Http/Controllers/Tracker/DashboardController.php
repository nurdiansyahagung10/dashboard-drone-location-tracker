<?php

namespace App\Http\Controllers\Tracker;

use App\Http\Controllers\Controller;
use App\Models\Device;
use App\Models\Telemetry;
use App\Models\SafeZone;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function landing(): Response
    {
        return redirect()->route('dashboard');
    }

    public function index(Request $request): Response
    {
        $devicesCount = Device::count();
        $telemetryCount = Telemetry::count();
        $safeZonesCount = SafeZone::count();

        $recentTelemetry = Telemetry::with('device')->latest()->limit(10)->get();

        return Inertia::render('tracker/dashboard', compact('devicesCount','telemetryCount','safeZonesCount','recentTelemetry'));
    }
}
