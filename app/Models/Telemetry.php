<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Telemetry extends Model
{
    use HasFactory;

    protected $table = 'telemetry';

    protected $fillable = [
        'user_id', 'device_id', 'latitude', 'longitude', 'speed', 'heading',
        'battery_voltage', 'battery_percentage', 'solar_voltage', 'solar_current', 'cellular_signal', 'raw_payload',
    ];

    protected $casts = [
        'raw_payload' => 'array',
    ];

    public function device()
    {
        return $this->belongsTo(Device::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
