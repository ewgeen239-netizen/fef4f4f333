import { redirect } from "next/navigation";
import { defaultLocale } from "@/lib/i18n/config";

// Fallback if middleware doesn't catch the bare root.
export default function RootIndex() {
  redirect(`/${defaultLocale}`);
}
