"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { showToast } from "@/components/common/ShowToast";
import {
  approveMembership,
  rejectMembership,
  cancelMembership,
} from "@/actions/members";
import { Member } from "@/types/member";

type Action = "approve" | "reject" | "cancel";

const config: Record<
  Action,
  {
    title: string;
    description: string;
    buttonLabel: string;
    variant: "default" | "destructive";
  }
> = {
  approve: {
    title: "Approve Membership",
    description:
      "Approve this membership application. The member will be marked as active.",
    buttonLabel: "Approve",
    variant: "default",
  },
  reject: {
    title: "Reject Membership",
    description:
      "Reject this membership application. The member status will be set to rejected.",
    buttonLabel: "Reject",
    variant: "destructive",
  },
  cancel: {
    title: "Cancel Membership",
    description: "Cancel this membership. This action cannot be undone.",
    buttonLabel: "Cancel Membership",
    variant: "destructive",
  },
};

interface Props {
  member: Member;
  action: Action;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function ReviewMembershipDialog({
  member,
  action,
  open,
  onOpenChange,
  onSuccess,
}: Props) {
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const cfg = config[action];

  const memberName =
    [member.profile?.first_name, member.profile?.last_name]
      .filter(Boolean)
      .join(" ") || member.member_number;

  const handleConfirm = async () => {
    setLoading(true);
    const fn =
      action === "approve"
        ? approveMembership
        : action === "reject"
          ? rejectMembership
          : cancelMembership;
    const result = await fn(member.id, notes || undefined);
    setLoading(false);

    if (result && "error" in result) {
      showToast({ title: "Error", message: result.error, type: "error" });
    } else {
      showToast({
        title: "Done",
        message: `Membership ${action}d successfully`,
        type: "success",
      });
      setNotes("");
      onSuccess();
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{cfg.title}</AlertDialogTitle>
          <AlertDialogDescription>{cfg.description}</AlertDialogDescription>
        </AlertDialogHeader>

        <div className="text-sm font-medium">
          {memberName} ·{" "}
          <span className="font-mono text-xs text-muted-foreground">
            {member.member_number}
          </span>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="notes" className="text-sm">
            Notes{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any relevant notes..."
            rows={3}
          />
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <Button
            variant={cfg.variant}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? <Spinner /> : cfg.buttonLabel}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
