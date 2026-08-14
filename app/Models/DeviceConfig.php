<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeviceConfig extends Model
{
    use HasFactory;

    protected $table = 'device_configs';

    protected $fillable = [
        'user_id', 'device_id', 'state', 'mode',
    ];

    protected $casts = [

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
