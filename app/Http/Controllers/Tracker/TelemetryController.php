<?php

namespace App\Http\Controllers\Tracker;

use App\Http\Controllers\Controller;
use App\Models\Telemetry;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class TelemetryController extends Controller
{
    public function index(): Response
    {
        $telemetry = Telemetry::with('device','user')->orderBy('created_at','desc')->limit(200)->get();
        return Inertia::render('tracker/telemetry/index', compact('telemetry'));
    }

    public function show(Telemetry $telemetry): Response
    {
        $telemetry->load('device', 'user');
        return Inertia::render('tracker/telemetry/show', compact('telemetry'));
    }

    public function destroy(Telemetry $telemetry)
    {
        $telemetry->delete();
        return redirect()->route('telemetry.index')->with('success', 'Telemetry data deleted');
    }
}
