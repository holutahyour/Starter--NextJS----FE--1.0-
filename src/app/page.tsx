export default function Home() {
  return (
    <div className="space-y-6 mx-6">
      <div className="border-b pb-5">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Welcome back! Heres an overview of whats happening with your CRM today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Quick Stats */}
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 ring-1 ring-gray-200">
          <dt className="truncate text-sm font-medium text-gray-500">Active Contacts</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-blue-600">1,234</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 ring-1 ring-gray-200">
          <dt className="truncate text-sm font-medium text-gray-500">Open Opportunities</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">42</dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6 ring-1 ring-gray-200">
          <dt className="truncate text-sm font-medium text-gray-500">Pending Tasks</dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-orange-600">12</dd>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
        <h3 className="text-sm font-semibold text-gray-900">No recent activity</h3>
        <p className="mt-1 text-sm text-gray-500">Tasks and updates from your team will appear here.</p>
      </div>
    </div>
  );
}
