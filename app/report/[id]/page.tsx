import { ReportPage } from "@/components/report-page"

export default function Report({ params }: { params: { id: string } }) {
  return <ReportPage candidateId={params.id} />
}
