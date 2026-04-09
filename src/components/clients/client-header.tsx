import { CLIENT_STATUSES } from "@/lib/constants";

type Props = {
  client: {
    id: string;
    nameAr: string;
    nameEn: string | null;
    industry: string | null;
    status: string;
    brandGuide: { primaryColor: string | null; secondaryColor: string | null } | null;
  };
};

export function ClientHeader({ client }: Props) {
  const primary = client.brandGuide?.primaryColor ?? "#0f766e";
  const secondary = client.brandGuide?.secondaryColor ?? "#f59e0b";
  const status = CLIENT_STATUSES.find((s) => s.value === client.status);

  return (
    <div className="card overflow-hidden">
      <div
        className="h-24 w-full"
        style={{
          background: `linear-gradient(135deg, ${primary} 0%, ${secondary} 100%)`,
        }}
      />
      <div className="flex flex-wrap items-start gap-4 p-6">
        <div
          className="-mt-14 flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-card text-2xl font-bold text-white shadow-sm"
          style={{ backgroundColor: primary }}
        >
          {client.nameAr.charAt(0)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{client.nameAr}</h1>
            <span className="badge border-emerald-300 bg-emerald-50 text-emerald-700">
              {status?.labelAr}
            </span>
          </div>
          {client.nameEn && (
            <p className="mt-0.5 text-sm text-muted-foreground">{client.nameEn}</p>
          )}
          {client.industry && (
            <p className="mt-1 text-sm text-muted-foreground">{client.industry}</p>
          )}
        </div>
      </div>
    </div>
  );
}
