<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'device_uid', 'name', 'model', 'firmware_version', 'is_active',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function configs()
    {
        return $this->hasMany(DeviceConfig::class);
    }

    // Expose the user-specific config as an attribute: $device->user_config
    public function getUserConfigAttribute()
    {
        return $this->configs()->where('user_id', $this->user_id)->first();
    }

    public function telemetry()
    {
        return $this->hasMany(Telemetry::class);
    }

    public function safeZones()
    {
        return $this->belongsToMany(SafeZone::class, 'device_safe_zone')->withPivot('is_active')->withTimestamps();
    }
}
