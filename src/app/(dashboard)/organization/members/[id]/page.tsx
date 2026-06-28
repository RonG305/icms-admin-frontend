import { notFound } from "next/navigation";
import Link from "next/link";
import { getMemberById } from "@/data/organization/members";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BackButton } from "@/components/common/BackButton";
import { formatDate, formatCurrency } from "@/lib/format";
import { MemberActions } from "@/components/Organization/Members/MemberActions";
import { Card } from "@/components/ui/card";
import { Icon } from "@iconify/react";

function getInitials(first?: string, last?: string) {
  return [first?.[0], last?.[0]].filter(Boolean).join("").toUpperCase() || "?";
}

const statusVariant = (s: string) => {
  if (s === "active") return "success" as const;
  if (s === "suspended") return "destructive" as const;
  if (s === "rejected" || s === "cancelled") return "destructive" as const;
  return "warning" as const;
};

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <span className="text-sm text-right font-medium break-all">
        {value ?? <span className="text-muted-foreground font-normal">—</span>}
      </span>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col border rounded-lg p-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
        {title}
      </p>
      <div className="divide-y">{children}</div>
    </div>
  );
}

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const member = await getMemberById(id);

  if (!member) notFound();

  const p = member.profile;
  const name =
    [p?.first_name, p?.last_name].filter(Boolean).join(" ") || "Unknown";

  return (
    <div className="flex flex-col gap-6 ">
      <BackButton href="/organization/members" />

      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <Avatar className="size-16 shrink-0">
            <AvatarImage src={p?.avatar_url || undefined} />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {getInitials(p?.first_name, p?.last_name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl font-semibold">{name}</h1>
            <p className="text-sm font-mono text-muted-foreground">
              {member.member_number}
            </p>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <Badge
                variant={statusVariant(member.membership_status)}
                className="capitalize"
              >
                {member.membership_status?.replace(/_/g, " ")}
              </Badge>
              <Badge variant="outline" className="capitalize">
                {member.category?.replace(/_/g, " ")}
              </Badge>
            </div>
          </div>
        </div>

        <MemberActions member={member} />
      </div>

      <Separator />
      <Card>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <Section title="Membership">
            <Row
              label="Member Number"
              value={
                <span className="font-mono text-xs">
                  {member.member_number}
                </span>
              }
            />
            <Row
              label="Category"
              value={
                <span className="capitalize">
                  {member.category?.replace(/_/g, " ")}
                </span>
              }
            />
            <Row
              label="Status"
              value={
                <Badge
                  variant={statusVariant(member.membership_status)}
                  className="capitalize"
                >
                  {member.membership_status?.replace(/_/g, " ")}
                </Badge>
              }
            />
            <Row label="ID Number" value={member.id_number} />
            <Row label="KRA PIN" value={member.kra_pin} />
            <Row label="Joined" value={formatDate(member.joined_date)} />
          </Section>

          <Section title="Profile">
            <Row label="Full Name" value={name} />
            <Row label="Email" value={p?.user?.email} />
            <Row label="Phone" value={p?.phone_number} />
            <Row label="Alt. Phone" value={p?.alternative_phone} />
            <Row
              label="Gender"
              value={
                p?.gender ? (
                  <span className="capitalize">{p.gender}</span>
                ) : undefined
              }
            />
            <Row label="Date of Birth" value={formatDate(p?.date_of_birth)} />
          </Section>

          <Section title="Address">
            <Row label="Street" value={p?.street_address} />
            <Row label="City" value={p?.city} />
            <Row label="Region" value={p?.region} />
            <Row label="Postal Code" value={p?.postal_code} />
            <Row label="Country" value={p?.country} />
          </Section>

          <Section title="Identity">
            <Row label="National ID" value={p?.national_id} />
            <Row
              label="ID Type"
              value={
                p?.national_id_type ? (
                  <span className="capitalize">
                    {p.national_id_type.replace(/_/g, " ")}
                  </span>
                ) : undefined
              }
            />
            <Row label="Verified" value={p?.is_verified ? "Yes" : "No"} />
            <Row
              label="Account Type"
              value={
                p?.user?.account_type ? (
                  <span className="capitalize">{p.user.account_type}</span>
                ) : undefined
              }
            />
          </Section>

          <Section title="Share Account">
            <Row
              label="Account Number"
              value={
                <span className="font-mono text-xs">
                  {member.share_account?.account_number}
                </span>
              }
            />
            <Row
              label="Total Shares"
              value={member.share_account?.total_shares ?? 0}
            />
            <Row
              label="Total Value"
              value={formatCurrency(member.share_account?.total_value ?? "0")}
            />
            <Row
              label=""
              value={
                <Link
                  href={`/organization/members/${member.id}/shares`}
                  className="text-sm text-primary flex items-center gap-x-4 hover:underline"
                >
                  View Share Statement <Icon icon={"solar:arrow-right-linear"} fontSize={18} />
                </Link>
              }
            />
          </Section>

          <Section title="Dividend Account">
            <Row
              label="Account Number"
              value={
                <span className="font-mono text-xs">
                  {member.dividend_account?.account_number}
                </span>
              }
            />
            <Row
              label="Balance"
              value={formatCurrency(member.dividend_account?.balance ?? "0")}
            />
            <Row
              label=""
              value={
                <Link
                  href={`/organization/members/${member.id}/dividends`}
                  className="text-sm text-primary flex items-center gap-x-4 hover:underline"
                >
                   View Dividend Statement <Icon icon={"solar:arrow-right-linear"} fontSize={18} />
                </Link>
              }
            />
          </Section>
        </div>
      </Card>
    </div>
  );
}
