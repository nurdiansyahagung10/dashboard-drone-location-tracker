<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('telemetry', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('device_id')->constrained()->cascadeOnDelete();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('longitude', 10, 7)->nullable();
            $table->float('speed')->nullable();
            $table->float('heading')->nullable();
            $table->float('battery_voltage')->nullable();
            $table->unsignedTinyInteger('battery_percentage')->nullable();
            $table->float('solar_voltage')->nullable();
            $table->float('solar_current')->nullable();
            $table->smallInteger('cellular_signal')->nullable();
            $table->json('raw_payload')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('telemetry');
    }
};
