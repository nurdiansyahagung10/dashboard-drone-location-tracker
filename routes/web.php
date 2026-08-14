<?php

use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Tracker\DeviceConfigController;
use App\Http\Controllers\Tracker\DeviceController;
use App\Http\Controllers\Tracker\SafeZoneController;
use App\Http\Controllers\Tracker\TelemetryController;
use Illuminate\Support\Facades\Route;

Route::inertia('/laravel/home', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    // Main dashboard
    Route::get('/', [DashboardController::class, 'index'])->name('dashboard');

    // Devices, Safe Zones, Configs and Telemetry at root (no `tracker` prefix)
    Route::resource('devices', DeviceController::class);
    Route::resource('safe-zones', SafeZoneController::class)->parameters(['safe-zones' => 'safeZone']);
    Route::get('device-configs', [DeviceConfigController::class, 'index'])->name('device-configs.index');
    Route::post('devices/{device}/config', [DeviceConfigController::class, 'storeOrUpdate'])->name('devices.config.store_or_update');
    Route::resource('telemetry', TelemetryController::class)->only(['index', 'show', 'destroy']);

});

require __DIR__.'/settings.php';
