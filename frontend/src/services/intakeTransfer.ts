export type Readiness = "yes" | "no" | "unknown";
export type CookingIntensity = "none" | "light" | "full";
export type FloorPosition = "basement" | "ground" | "upper" | "mall" | "unknown";
export type LayoutShape = "regular" | "narrow" | "corner" | "irregular" | "unknown";
export type ApprovedUseStatus = "confirmed" | "needs_change_of_use" | "unknown";

export interface AnalysisIntake {
  businessType: string;
  expectedRent: number;
  squareMeters: number;
  leaseTermMonths: number;
  serviceChargeMonthly: number;
  fitoutBudget: number;
  cookingIntensity: CookingIntensity;
  floorPosition: FloorPosition;
  layoutShape: LayoutShape;
  hasWaterSupply: Readiness;
  hasFloorTrap: Readiness;
  hasGreaseTrap: Readiness;
  electricalReadiness: Readiness;
  hasGas: Readiness;
  hasExhaust: Readiness;
  wastewaterReadiness: Readiness;
  approvedUseStatus: ApprovedUseStatus;
  rentFreeMonths?: number;
  depositMonths?: number;
  otherMonthlyCosts?: number;
  utilitiesMonthlyEstimate?: number;
  staffingMonthly?: number;
  marketingMonthly?: number;
  insuranceMonthly?: number;
  licenseFees?: number;
  reinstatementCost?: number;
  annualRentEscalation?: number;
  annualRevenueGrowth?: number;
  turnoverRentRate?: number;
  openingRampMonths?: number;
  discountRateAnnual?: number;
  expectedDailyCustomers?: number;
  averageSpend?: number;
  grossMargin?: number;
  frontageWidthM?: number;
  ceilingHeightM?: number;
  usableAreaRatio?: number;
  storageAreaSqm?: number;
  seatingCapacity?: number;
  loadingAccess?: Readiness;
  toiletAccess?: Readiness;
  signageVisibility?: Readiness;
  exhaustRouteAvailable?: Readiness;
  location: SiteLocation;
  candidateSites?: CandidateSite[];
}

export interface SiteLocation {
  mode: "current" | "address";
  latitude: number;
  longitude: number;
  siteLabel?: string;
}

export interface CandidateSite {
  label: string;
  monthlyRent: number;
  latitude: number;
  longitude: number;
}

export interface PendingAnalysis {
  file: File;
  intake: AnalysisIntake;
}

const PENDING_ANALYSIS_STORE = "pending-analysis";
const PENDING_ANALYSIS_KEY = "active";
const DB_NAME = "frontmatter-intake";
const DB_VERSION = 1;

let pendingAnalysis: PendingAnalysis | null = null;

export async function storePendingAnalysis(analysis: PendingAnalysis): Promise<void> {
  pendingAnalysis = analysis;
  await writePendingAnalysis(analysis);
}

export async function getPendingAnalysis(): Promise<PendingAnalysis | null> {
  if (pendingAnalysis) {
    return pendingAnalysis;
  }

  const restored = await readPendingAnalysis();
  pendingAnalysis = restored;
  return restored;
}

export async function clearPendingAnalysis(): Promise<void> {
  pendingAnalysis = null;
  await deletePendingAnalysis();
}

async function writePendingAnalysis(analysis: PendingAnalysis): Promise<void> {
  const db = await openDatabase();
  if (!db) {
    return;
  }

  await runTransaction(db, "readwrite", (store) =>
    store.put({ file: analysis.file, intake: analysis.intake }, PENDING_ANALYSIS_KEY)
  );
}

async function readPendingAnalysis(): Promise<PendingAnalysis | null> {
  const db = await openDatabase();
  if (!db) {
    return null;
  }

  const record = await readTransaction<PendingAnalysis | undefined>(db, (store) =>
    store.get(PENDING_ANALYSIS_KEY)
  );
  return record ?? null;
}

async function deletePendingAnalysis(): Promise<void> {
  const db = await openDatabase();
  if (!db) {
    return;
  }

  await runTransaction(db, "readwrite", (store) => store.delete(PENDING_ANALYSIS_KEY));
}

function openDatabase(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !("indexedDB" in window)) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(PENDING_ANALYSIS_STORE)) {
        db.createObjectStore(PENDING_ANALYSIS_STORE);
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function runTransaction(
  db: IDBDatabase,
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => IDBRequest
): Promise<void> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PENDING_ANALYSIS_STORE, mode);
    const store = transaction.objectStore(PENDING_ANALYSIS_STORE);
    action(store);

    transaction.oncomplete = () => resolve();
    transaction.onerror = () => reject(transaction.error);
    transaction.onabort = () => reject(transaction.error);
  });
}

function readTransaction<T>(
  db: IDBDatabase,
  action: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(PENDING_ANALYSIS_STORE, "readonly");
    const store = transaction.objectStore(PENDING_ANALYSIS_STORE);
    const request = action(store);

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
    transaction.onabort = () => reject(transaction.error);
  });
}
