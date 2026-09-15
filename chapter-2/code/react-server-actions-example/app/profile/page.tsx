import { db } from "@/lib/db";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const user = await db.user.find("user-1");
  if (!user) return <p>User not found.</p>;
  return <ProfileForm user={user} />;
}
