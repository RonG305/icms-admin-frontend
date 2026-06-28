import { cookies } from "next/headers";
import {
  getMemberDividendAccount,
  getMemberDividendSummary,
  getMemberDividendStatement,
} from "@/data/organization/dividends";
import { decodeToken } from "@/lib/decode-token";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MemberDividendActions from "@/components/Organization/Dividends/MemberDividendActions";
import { BackButton } from "@/components/common/BackButton";
import { formatCurrency, formatDateTime } from "@/lib/format";

type Props = { params: Promise<{ id: string }> };

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5 border-b last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value ?? "—"}</span>
    </div>
  );
}

const txTypeBadge = (
  type: string,
): "success" | "destructive" | "info" | "secondary" => {
  const map: Record<string, "success" | "destructive" | "info"> = {
    credit: "success",
    withdrawal: "destructive",
    reinvestment: "info",
  };
  return map[type] ?? "secondary";
};

export default async function MemberDividendPage({ params }: Props) {
  const { id: memberId } = await params;
  const cookieStore = await cookies();
  const decoded = decodeToken(cookieStore.get("token")?.value ?? "");
  const processedBy = decoded?.sub ?? decoded?.user_id ?? "";

  const [account, summary, statementResult] = await Promise.all([
    getMemberDividendAccount(memberId),
    getMemberDividendSummary(memberId),
    getMemberDividendStatement(memberId, { page: 1, limit: 50 }),
  ]);

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center gap-3">
        <BackButton href="/organization/members" />
        <div>
          <h1 className="text-xl font-semibold">Dividend Account</h1>
          <p className="text-base text-muted-foreground font-mono">
            Member ID: {memberId}
          </p>
        </div>
      </div>

      {!account ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground text-sm">
            No dividend account found for this member.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                  Account Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Row
                  label="Account Number"
                  value={
                    <span className="font-mono">{account.account_number}</span>
                  }
                />
                <Row label="Balance" value={formatCurrency(account.balance)} />
                <Row
                  label="Total Earned"
                  value={formatCurrency(
                    summary?.total_earned ?? account.total_earned ?? "0",
                  )}
                />
                <Row
                  label="Total Withdrawn"
                  value={formatCurrency(
                    summary?.total_withdrawn ?? account.total_withdrawn ?? "0",
                  )}
                />
                <Row
                  label="Total Reinvested"
                  value={formatCurrency(
                    summary?.total_reinvested ??
                      account.total_reinvested ??
                      "0",
                  )}
                />
                {summary?.transaction_count !== undefined && (
                  <Row label="Transactions" value={summary.transaction_count} />
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                  Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <MemberDividendActions
                  memberId={memberId}
                  balance={account.balance}
                  processedBy={processedBy}
                />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
                Statement
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {statementResult.data.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No transactions yet.
                </p>
              ) : (
                <div className="divide-y">
                  {statementResult.data.map((tx) => (
                    <div
                      key={tx.id}
                      className="flex items-center justify-between px-6 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <Badge
                          variant={txTypeBadge(tx.transaction_type)}
                          className="capitalize text-xs"
                        >
                          {tx.transaction_type.replace(/_/g, " ")}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {tx.notes ?? "—"}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {formatCurrency(tx.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDateTime(tx.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
