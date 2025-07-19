import Conversations from "@/components/conversations/conversations";

export default function ConversationsPage({ searchParams, params }: { searchParams: { chatId: string }, params: { id: string }}) {
  const chatId = searchParams.chatId;
  const id = params.id;

  return (
    <Conversations websiteId={id} chatId={chatId}/>
  )
}
