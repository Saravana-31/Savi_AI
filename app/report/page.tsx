// app/report/page.tsx

import Link from 'next/link'

export default function ReportListingPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg p-8 text-center">
        <h1 className="text-4xl font-bold mb-4">Reports Overview</h1>
        <p className="mb-6">Select an interview report to view detailed analysis.</p>
        {/* Example links: replace with actual fetched report links */}
        <ul className="space-y-3 text-blue-600 underline">
          <li><Link href="/report/123">Report #123</Link></li>
          <li><Link href="/report/456">Report #456</Link></li>
          <li><Link href="/report/789">Report #789</Link></li>
        </ul>
      </div>
    </div>
  )
}
