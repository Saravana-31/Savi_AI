import React from 'react'
import ReportPage from '@/components/report-page'

interface PageProps {
  params: {
    id: string
  }
}

export default function Page({ params }: PageProps) {
  return <ReportPage candidateId={params.id} />
}
