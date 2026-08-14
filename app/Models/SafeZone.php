<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SafeZone extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'name', 'center_lat', 'center_lng', 'radius_m',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function devices()
    {
        return $this->belongsToMany(Device::class, 'device_safe_zone')->withPivot('is_active')->withTimestamps();
    }
}
