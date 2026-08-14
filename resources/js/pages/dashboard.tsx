import { Head } from '@inertiajs/react';
import { dashboard } from '@/routes';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, MapPin, Smartphone, Zap } from 'lucide-react';

export default function Dashboard({
    stats,
    devicesByStatus,
    latestTelemetry,
    telemetryChart,
    speedData,
}: {
    stats: any;
    devicesByStatus: any;
    latestTelemetry: any[];
    telemetryChart: any[];
    speedData: any[];
}) {
    const COLORS = ['#10b981', '#ef4444'];

    return (
        <>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Stats Grid */}
                <div className="grid auto-rows-min gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                <Smartphone className="h-4 w-4 text-blue-500" />
                                Total Devices
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalDevices}</div>
                            <p className="text-xs text-muted-foreground">{stats.activeDevices} Active</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                <MapPin className="h-4 w-4 text-green-500" />
                                Safe Zones
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.totalSafeZones}</div>
                            <p className="text-xs text-muted-foreground">Configured zones</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                <Activity className="h-4 w-4 text-purple-500" />
                                Avg Speed
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.averageSpeed}</div>
                            <p className="text-xs text-muted-foreground">km/h (30 days)</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="flex items-center gap-2 text-sm font-medium">
                                <Zap className="h-4 w-4 text-yellow-500" />
                                Avg Battery
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.avgBattery}%</div>
                            <p className="text-xs text-muted-foreground">Current average</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts */}
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Telemetry Count Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Telemetry Data (Last 7 Days)</CardTitle>
                            <CardDescription>Daily telemetry records</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={telemetryChart}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,100,0.1)" />
                                    <XAxis dataKey="date" stroke="rgba(100,100,100,0.5)" style={{ fontSize: '12px' }} />
                                    <YAxis stroke="rgba(100,100,100,0.5)" style={{ fontSize: '12px' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(0,0,0,0.8)',
                                            border: '1px solid rgba(100,100,100,0.3)',
                                            borderRadius: '8px',
                                            color: '#fff',
                                        }}
                                    />
                                    <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Speed Trend Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Speed Trend (Last 7 Days)</CardTitle>
                            <CardDescription>Average speed per day</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={speedData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,100,100,0.1)" />
                                    <XAxis dataKey="date" stroke="rgba(100,100,100,0.5)" style={{ fontSize: '12px' }} />
                                    <YAxis stroke="rgba(100,100,100,0.5)" style={{ fontSize: '12px' }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(0,0,0,0.8)',
                                            border: '1px solid rgba(100,100,100,0.3)',
                                            borderRadius: '8px',
                                            color: '#fff',
                                        }}
                                    />
                                    <Line type="monotone" dataKey="speed" stroke="#f59e0b" strokeWidth={2} dot={{ fill: '#f59e0b' }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Device Status Pie Chart */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Device Status</CardTitle>
                            <CardDescription>Active vs Inactive devices</CardDescription>
                        </CardHeader>
                        <CardContent className="flex items-center justify-center">
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={Object.entries(devicesByStatus).map(([name, value]) => ({
                                            name,
                                            value,
                                        }))}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, value }) => `${name}: ${value}`}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {Object.entries(devicesByStatus).map((_, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Latest Telemetry Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Latest Telemetry</CardTitle>
                            <CardDescription>10 most recent records</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-auto max-h-80">
                                <table className="w-full text-sm">
                                    <thead className="border-b border-border">
                                        <tr>
                                            <th className="px-2 py-2 text-left font-medium">Device</th>
                                            <th className="px-2 py-2 text-right font-medium">Speed</th>
                                            <th className="px-2 py-2 text-right font-medium">Battery</th>
                                            <th className="px-2 py-2 text-right font-medium">Time</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {latestTelemetry.map((record) => (
                                            <tr key={record.id} className="border-b border-border/50 hover:bg-sidebar/50">
                                                <td className="px-2 py-2">{record.device_name}</td>
                                                <td className="px-2 py-2 text-right">{record.speed ?? '—'} km/h</td>
                                                <td className="px-2 py-2 text-right">
                                                    <span className={`font-medium ${record.battery_percentage > 50 ? 'text-green-500' : record.battery_percentage > 20 ? 'text-yellow-500' : 'text-red-500'}`}>
                                                        {record.battery_percentage ?? '—'}%
                                                    </span>
                                                </td>
                                                <td className="px-2 py-2 text-right text-xs text-muted-foreground">
                                                    {new Date(record.created_at).toLocaleTimeString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
