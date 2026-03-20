export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Overview</h1>
      
      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="p-6 border rounded-lg">
          <div className="text-3xl font-bold">0</div>
          <div className="text-muted-foreground">Total Users</div>
        </div>
        <div className="p-6 border rounded-lg">
          <div className="text-3xl font-bold">0</div>
          <div className="text-muted-foreground">Total Receipts</div>
        </div>
        <div className="p-6 border rounded-lg">
          <div className="text-3xl font-bold">0</div>
          <div className="text-muted-foreground">Active Jobs</div>
        </div>
        <div className="p-6 border rounded-lg">
          <div className="text-3xl font-bold">0</div>
          <div className="text-muted-foreground">Support Tickets</div>
        </div>
      </div>

      <section className="border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p className="text-muted-foreground">No recent activity.</p>
      </section>
    </div>
  );
}
