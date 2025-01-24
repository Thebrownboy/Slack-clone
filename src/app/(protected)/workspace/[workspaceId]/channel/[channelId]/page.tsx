interface ChannelPageProps {
  params: Promise<{
    workspaceId: string;
    channelId: string;
  }>;
}

export default async function ChannelPage({ params }: ChannelPageProps) {
  const { channelId, workspaceId } = await params;

  return (
    <div>
      Channel Id Page {channelId} {workspaceId}
    </div>
  );
}
