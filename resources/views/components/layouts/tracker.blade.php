<!-- tracker layout component -->
@props([])
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Tracker Service') }}</title>
    @vite(['resources/css/app.css'])
    <script src="https://unpkg.com/alpinejs@3.x.x/dist/cdn.min.js" defer></script>
</head>
<body class="antialiased bg-gray-50 dark:bg-gray-900">
    <div class="min-h-screen">
        <header class="max-w-6xl mx-auto p-6 flex items-center justify-between">
            <h1 class="text-2xl font-semibold">{{ config('app.name', 'Tracker Service') }}</h1>
            <nav class="hidden md:flex gap-4 items-center">
                <a href="/" class="text-sm text-gray-600 hover:underline">Home</a>
                <a href="{{ route('dashboard') }}" class="text-sm text-gray-600 hover:underline">Dashboard</a>
                <a href="{{ route('devices.index') }}" class="text-sm text-gray-600 hover:underline">Devices</a>
                <a href="{{ route('device-configs.index') }}" class="text-sm text-gray-600 hover:underline">Configs</a>
                <a href="{{ route('telemetry.index') }}" class="text-sm text-gray-600 hover:underline">Telemetry</a>
                <a href="{{ route('safe-zones.index') }}" class="text-sm text-gray-600 hover:underline">Safe Zones</a>
            </nav>
            <div class="md:hidden">
                <button x-data="{open:false}" @click="$dispatch('toggle-mobile')" class="px-3 py-2 bg-gray-200 rounded">Menu</button>
            </div>
        </header>

        <main class="max-w-6xl mx-auto p-6">
            {{ $slot }}
        </main>
    </div>
</body>
</html>
