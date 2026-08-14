<?php

namespace App\Http\Controllers\Tracker;

use App\Http\Controllers\Controller;
use App\Models\SafeZone;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class SafeZoneController extends Controller
{
    public function index(): Response
    {
        $zones = SafeZone::with('user')->orderBy('id','desc')->get();
        return Inertia::render('tracker/safe-zones/index', compact('zones'));
    }

    public function create(): Response
    {
        return Inertia::render('tracker/safe-zones/create');
    }

    public function store(Request $request)
    {
        $userId = $request->user()->id ?? 1;
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:safe_zones,name,NULL,id,user_id,' . $userId,
            'center_lat' => 'required|numeric',
            'center_lng' => 'required|numeric',
            'radius_m' => 'required|integer',
        ]);

        $data['user_id'] = $request->user()->id ?? 1;

        SafeZone::create($data);

        return redirect()->route('safe-zones.index')->with('success','Safe zone created');
    }

    public function edit(SafeZone $safeZone): Response
    {
        return Inertia::render('tracker/safe-zones/edit', ['zone' => $safeZone]);
    }

    public function show(SafeZone $safeZone): Response
    {
        $safeZone->load('user', 'devices');
        return Inertia::render('tracker/safe-zones/show', ['zone' => $safeZone]);
    }

    public function update(Request $request, SafeZone $safeZone)
    {
        $userId = $request->user()->id ?? 1;
        $data = $request->validate([
            'name' => 'required|string|max:255|unique:safe_zones,name,' . $safeZone->id . ',id,user_id,' . $userId,
            'center_lat' => 'required|numeric',
            'center_lng' => 'required|numeric',
            'radius_m' => 'required|integer',
        ]);

        $safeZone->update($data);

        return redirect()->route('safe-zones.index')->with('success','Safe zone updated');
    }

    public function destroy(SafeZone $safeZone)
    {
        $safeZone->delete();
        return redirect()->route('safe-zones.index')->with('success','Safe zone deleted');
    }
}
