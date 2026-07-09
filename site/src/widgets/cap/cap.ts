import { TICK_MS, runScript, type SimSpec } from '../lib/sim';
import type { SimSnapshot } from '../engine/Simulation';

export interface CapParams {
  partitioned: boolean;
  mode: 'CP' | 'AP';
  scenario: 'bank' | 'likes';
}

export interface Replication {
  sentAt: number;
  value: number;
}

export interface CapState {
  now: number;
  valueA: number;
  valueB: number;
  inFlight: Replication[];
  queued: Replication[];   // held while partitioned; drains on heal
  log: string[];
  rejected: number;
}

export const REPLICATION_MS = 480; // 30 ticks
export const WRITE_AMOUNT: Record<CapParams['scenario'], number> = { bank: 100, likes: 1 };
const UNIT: Record<CapParams['scenario'], string> = { bank: '₹', likes: '♥' };

export function writeToA(s: CapState, p: CapParams): CapState {
  const amount = WRITE_AMOUNT[p.scenario];
  if (p.partitioned && p.mode === 'CP') {
    return {
      ...s,
      rejected: s.rejected + 1,
      log: [...s.log, `A: write +${UNIT[p.scenario]}${amount} REJECTED — cannot reach B (chose Consistency over Availability)`],
    };
  }
  const valueA = s.valueA + amount;
  const rep: Replication = { sentAt: s.now, value: valueA };
  if (p.partitioned) {
    return {
      ...s,
      valueA,
      queued: [...s.queued, rep],
      log: [...s.log, `A: write ✓ ${UNIT[p.scenario]}${valueA} — replication QUEUED (partition)`],
    };
  }
  return {
    ...s,
    valueA,
    inFlight: [...s.inFlight, rep],
    log: [...s.log, `A: write ✓ ${UNIT[p.scenario]}${valueA} — replicating to B`],
  };
}

export function readFromB(s: CapState, p: CapParams): CapState {
  if (p.partitioned && p.mode === 'CP') {
    return {
      ...s,
      rejected: s.rejected + 1,
      log: [...s.log, 'B: read REJECTED — cannot confirm it is current (chose Consistency over Availability)'],
    };
  }
  const stale = p.partitioned && s.valueB !== s.valueA;
  const tag = stale ? ` (STALE — A has ${UNIT[p.scenario]}${s.valueA})` : ' ✓';
  return { ...s, log: [...s.log, `B: read → ${UNIT[p.scenario]}${s.valueB}${tag}`] };
}

export const CAP_SPEC: SimSpec<CapState, CapParams> = {
  init: () => ({ now: 0, valueA: 0, valueB: 0, inFlight: [], queued: [], log: [], rejected: 0 }),
  tick(state, p) {
    const now = state.now + TICK_MS;
    let s: CapState = { ...state, now, inFlight: [...state.inFlight], queued: [...state.queued] };
    // heal: queued replications go on the wire
    if (!p.partitioned && s.queued.length > 0) {
      const drained = s.queued.map((r) => ({ ...r, sentAt: now }));
      s = {
        ...s,
        inFlight: [...s.inFlight, ...drained],
        queued: [],
        log: [...s.log, 'partition healed — queued replications on the wire (last write wins)'],
      };
    }
    // arrivals
    const arriving = s.inFlight.filter((r) => now - r.sentAt >= REPLICATION_MS);
    if (arriving.length > 0) {
      const latest = arriving[arriving.length - 1];
      s = {
        ...s,
        valueB: latest.value,
        inFlight: s.inFlight.filter((r) => now - r.sentAt < REPLICATION_MS),
        log: [...s.log, `B: replicated → ${latest.value}`],
      };
    }
    return s;
  },
};

export function capSnapshots(p: CapParams): SimSnapshot<CapState>[] {
  const u = UNIT[p.scenario];
  const ev = [
    { atTick: 0, apply: (s: CapState) => writeToA(s, p) },
    { atTick: 40, apply: (s: CapState) => readFromB(s, p) },
    { atTick: 60, apply: (s: CapState) => writeToA(s, p) },
  ];
  const at = (n: number) => runScript(CAP_SPEC, p, n, ev);
  const s1 = at(10);
  const s2 = at(45);
  const s3 = at(100);
  if (!p.partitioned) {
    return [
      { atTick: 10, events: ev, caption: `Write lands on A (${u}${s1.valueA}); replication is on the wire to B (still ${u}${s1.valueB}).` },
      { atTick: 45, events: ev, caption: `B caught up (${u}${s2.valueB}) and the read returned it. Healthy replication is invisible.` },
      { atTick: 100, events: ev, caption: `Two writes, one read, zero surprises: A ${u}${s3.valueA} · B ${u}${s3.valueB}.` },
    ];
  }
  return [
    { atTick: 10, events: ev, caption: p.mode === 'CP'
      ? `Partitioned, CP: the write was REJECTED (${s1.rejected} so far) — nobody gets a wrong answer, but the system said no.`
      : `Partitioned, AP: A accepted the write (${u}${s1.valueA}) but B still says ${u}${s1.valueB} — the replicas now disagree.` },
    { atTick: 45, events: ev, caption: p.mode === 'CP'
      ? `The read on B was rejected too (${s2.rejected} rejections) — availability is the price of consistency.`
      : `B answered instantly — with a stale ${u}${s2.valueB}. ${p.scenario === 'bank' ? 'For a balance, that is a lie about money.' : 'For a like count, nobody notices.'}` },
    { atTick: 100, events: ev, caption: p.mode === 'CP'
      ? `Final under partition: A ${u}${s3.valueA} · B ${u}${s3.valueB}, ${s3.rejected} rejected ops — consistent, not available.`
      : `Final under partition: A ${u}${s3.valueA} · B ${u}${s3.valueB} — available, not consistent. Heal the link and B will catch up.` },
  ];
}
