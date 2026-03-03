import React from 'react'
import ReportPage from '@/components/report-page'

interface PageProps {
  params: Promise<{
    id: string
  }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params
  return <ReportPage candidateId={id} />
}
