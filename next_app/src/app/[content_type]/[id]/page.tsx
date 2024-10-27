import { ContentViewer } from "@/components/content-viewer"

export default function ContentPage({ params }: { params: { id: string } }) {
  return <ContentViewer contentId={params.id} />
}
