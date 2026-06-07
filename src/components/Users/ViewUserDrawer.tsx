"use client";

import React from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { AuthUser } from "@/types/auth";

interface Props {
  user: AuthUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function initials(u: AuthUser) {
  return (
    `${u.first_name?.[0] ?? ""}${u.last_name?.[0] ?? ""}`.toUpperCase() ||
    u.email[0].toUpperCase()
  );
}

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
    <div className="flex flex-col border p-3 rounded-lg">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
        {title}
      </p>
      <div className="divide-y">{children}</div>
    </div>
  );
}

function formatDate(value?: string | null) {
  if (!value) return undefined;
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(value?: string | null) {
  if (!value) return undefined;
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ViewUserDrawer({ user, open, onOpenChange }: Props) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto thin-scrollbar"
      >
        <SheetHeader className="pb-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 shrink-0">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback className="bg-primary/10 text-primary text-base font-semibold">
                {initials(user)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <SheetTitle className="truncate">
                {user.first_name} {user.last_name}
              </SheetTitle>
              <SheetDescription className="truncate">
                {user.email}
              </SheetDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge
              variant={user.status === "active" ? "success" : "warning"}
              className="capitalize"
            >
              {user.status}
            </Badge>
            <Badge variant={user.is_verified ? "info" : "secondary"}>
              {user.is_verified ? "Verified" : "Unverified"}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {user.account_type}
            </Badge>
          </div>
        </SheetHeader>

        <Separator />

        <div className="flex flex-col gap-6 p-4">
          <Section title="Account">
            <Row
              label="User ID"
              value={<span className="font-mono text-xs">{user.id}</span>}
            />
            <Row label="Username" value={user.username} />
            <Row label="Email" value={user.email} />
            <Row
              label="Account Type"
              value={
                <Badge variant="outline" className="capitalize">
                  {user.account_type}
                </Badge>
              }
            />
            <Row
              label="Status"
              value={
                <Badge
                  variant={user.status === "active" ? "success" : "warning"}
                  className="capitalize"
                >
                  {user.status}
                </Badge>
              }
            />
            <Row
              label="Verified"
              value={
                <Badge variant={user.is_verified ? "info" : "secondary"}>
                  {user.is_verified ? "Verified" : "Unverified"}
                </Badge>
              }
            />
            <Row
              label="2FA Enabled"
              value={user.is_two_factor_enabled ? "Yes" : "No"}
            />
            <Row
              label="Roles"
              value={
                user.roles?.length ? (
                  <div className="flex flex-wrap gap-1 justify-end">
                    {user.roles.map((r) => (
                      <Badge key={r} variant="outline">
                        {r}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <span className="text-muted-foreground font-normal text-xs">
                    No roles assigned
                  </span>
                )
              }
            />
            <Row label="Last Login" value={formatDateTime(user.last_login)} />
            <Row label="Last Login IP" value={(user as any).last_login_ip} />
            <Row label="Joined" value={formatDateTime(user.created_at)} />
          </Section>

          <Separator />

          <Section title="Personal Information">
            <Row label="First Name" value={user.first_name} />
            <Row label="Middle Name" value={user.middle_name} />
            <Row label="Last Name" value={user.last_name} />
            <Row
              label="Gender"
              value={
                user.gender ? (
                  <span className="capitalize">{user.gender}</span>
                ) : undefined
              }
            />
            <Row label="Date of Birth" value={formatDate(user.date_of_birth)} />
            <Row label="Phone" value={user.phone_number} />
            <Row label="Alt. Phone" value={user.alternative_phone} />
            <Row label="Bio" value={user.bio} />
          </Section>

          <Separator />

          <Section title="Identity">
            <Row label="National ID Type" value={user.national_id_type} />
            <Row label="National ID" value={user.national_id} />
          </Section>

          <Separator />

          <Section title="Address">
            <Row label="Street" value={user.street_address} />
            <Row label="City" value={user.city} />
            <Row label="Region" value={user.region} />
            <Row label="Postal Code" value={user.postal_code} />
            <Row label="Country" value={user.country} />
            <Row label="Address Type" value={user.address_type} />
          </Section>

          <Separator />

          <Section title="Security">
            <Row
              label="Failed Login Attempts"
              value={(user as any).failed_login_attempts ?? 0}
            />
            <Row
              label="Account Locked Until"
              value={formatDateTime((user as any).account_locked_until)}
            />
            <Row
              label="Terms Accepted"
              value={user.accept_terms_conditions ? "Yes" : "No"}
            />
          </Section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
