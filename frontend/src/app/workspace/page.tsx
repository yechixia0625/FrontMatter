"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { WorkspaceLayout } from "@/components/workspace/WorkspaceLayout";
import { HackerLoading } from "@/components/workspace/HackerLoading";
import { useSSEStream } from "@/hooks/useSSEStream";
import { AnalysisService } from "@/services/AnalysisService";
import {
  getPendingAnalysis,
  type AnalysisIntake,
} from "@/services/intakeTransfer";

export default function WorkspacePage() {
  const router = useRouter();
  const [intake, setIntake] = useState<AnalysisIntake | null>(null);
  const { status, agentLogs, finalReport, error, connect } = useSSEStream();

  useEffect(() => {
    const pending = getPendingAnalysis();
    if (!pending) {
      router.replace("/");
      return;
    }
    setIntake(pending.intake);
    connect(AnalysisService.createFormData(pending.file, pending.intake));
  }, [connect, router]);

  if (!intake) {
    return <HackerLoading />;
  }

  return (
    <WorkspaceLayout
      intake={intake}
      report={finalReport}
      agentLogs={agentLogs}
      status={status}
      error={error}
    />
  );
}
