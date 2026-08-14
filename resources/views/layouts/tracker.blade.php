<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{{ config('app.name', 'Tracker Service') }}</title>
    @vite(['resources/css/app.css'])
</head>
<body class="antialiased bg-gray-50 dark:bg-gray-900">
    <div class="min-h-screen">
        <header class="max-w-6xl mx-auto p-6 flex items-center justify-between">
            <h1 class="text-2xl font-semibold">{{ config('app.name', 'Tracker Service') }}</h1>
            <nav>
                <a href="/" class="text-sm text-gray-600 hover:underline mr-4">Home</a>
                <a href="{{ route('dashboard') }}" class="text-sm text-gray-600 hover:underline mr-4">Dashboard</a>
            </nav>
        </header>

        <main class="max-w-6xl mx-auto p-6">
            {{ $slot }}
        </main>
    </div>
</body>
</html>
