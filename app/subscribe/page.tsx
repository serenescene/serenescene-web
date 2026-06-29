import { redirect } from "next/navigation";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function toQuery(params: Record<string, string | string[] | undefined>) {
  const q = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") q.set(key, value);
  }
  const s = q.toString();
  return s ? `?${s}` : "";
}

export default async function SubscribeRedirectPage({ searchParams }: PageProps) {
  const params = await searchParams;
  redirect(`/practice/subscribe${toQuery(params)}`);
}
