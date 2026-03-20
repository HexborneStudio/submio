import { redirect } from "next/navigation";

export default function AuthCallbackPage() {
  // The actual logic is in the API route — this just catches any direct access
  redirect("/dashboard");
}
