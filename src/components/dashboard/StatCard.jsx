export default function StatCard({ title, value, icon, trend }) {
    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-gray-500 text-sm font-medium">{title}</p>
                    <h3 className="text-2xl font-bold mt-1">{value}</h3>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
                    {icon}
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center">
                    <span
                        className={`text-sm ${
                            trend.isUp ? "text-green-500" : "text-red-500"
                        }`}
                    >
                        {trend.value} {trend.isUp ? "↑" : "↓"}
                    </span>
                    <span className="text-gray-500 text-sm ml-1">vs hier</span>
                </div>
            )}
        </div>
    );
}
