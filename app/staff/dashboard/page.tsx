import { StaffDashboard } from "@/components/staff/staff-dashboard"

export default function StaffDashboardPage({ searchParams, params }: { searchParams: { chatId: string }, params: { id: string }}) {
  const chatId = searchParams.chatId;
  const id = params.id;

  return <StaffDashboard websiteId={id} chatId={chatId}/>
}
