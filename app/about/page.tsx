export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">About HealthGuard</h1>
      
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8 space-y-4">
        <p className="text-slate-700">
          HealthGuard is a simple, modern patient management system built to demonstrate the capabilities of Next.js App Router.
        </p>
        
        <h2 className="text-xl font-semibold text-slate-900 mt-6 mb-2">Technical Features</h2>
        <ul className="list-disc list-inside space-y-2 text-slate-700">
          <li><strong>Next.js App Router:</strong> Leverages nested layouts, dynamic routes, and server components.</li>
          <li><strong>Tailwind CSS:</strong> Fully responsive, utility-first styling with a clean light theme.</li>
          <li><strong>Server Actions:</strong> Form submissions and UI mutations handled securely on the server without client-side JavaScript.</li>
          <li><strong>Route Handlers:</strong> Built-in API routes for standard RESTful operations (GET, POST, PUT, DELETE).</li>
          <li><strong>Full CRUD:</strong> Complete implementation of Create, Read, Update, and Delete operations.</li>
        </ul>
      </div>
    </div>
  );
}
