import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/db";
import { ClientTabs } from "@/components/clients/client-tabs";
import { ClientHeader } from "@/components/clients/client-header";

export default async function ClientLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await prisma.client.findUnique({
    where: { id },
    include: {
      brandGuide: {
        select: { primaryColor: true, secondaryColor: true },
      },
    },
  });
  if (!client) notFound();

  return (
    <div className="space-y-6">
      <Link
        href="/clients"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowRight className="h-4 w-4" />
        العودة للجهات
      </Link>

      <ClientHeader client={client} />
      <ClientTabs clientId={id} />

      <div>{children}</div>
    </div>
  );
}
