import { db } from "@/lib/db";
import "server-only";

const getMember = async (userId: string, workspaceId: string) => {
  return await db.members.findUnique({
    where: {
      userId_workspaceId: {
        userId,
        workspaceId,
      },
    },
  });
};

export async function createMessage({
  body,
  userId,
  workspaceId,
  channelId,
  imageId,
  parentMessageId,
}: {
  userId: string;
  workspaceId: string;
  channelId?: string;
  parentMessageId?: string;
  body: string;
  imageId?: string;
}) {
  if (!userId || !workspaceId) return null;

  const member = await getMember(userId, workspaceId);
  if (!member) return null;

  const message = await db.message.create({
    data: {
      memberId: member.userId,
      body: body,
      imageId,
      channelId: channelId || null,
      workspaceId: workspaceId,
      parentMessageId: parentMessageId || null,
    },
  });

  return message;
}

export async function uploadImage(file: File | null) {
  if (!file) return;
  const formData = new FormData();
  formData.append("file", file); // 'file' is your File object from input
  formData.append("upload_preset", process.env.CLOUDINARY_PRESET_NAME || "");

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const uploadedImage = await response.json();

    const image = await db.images.create({
      data: {
        displayName: uploadedImage.display_name,
        height: uploadedImage.height,
        width: uploadedImage.width,
        publicId: uploadedImage.public_id,
        URL: uploadedImage.url,
        id: uploadedImage.asset_id,
      },
    });
    return image;
  } catch {
    return null;
  }
}
