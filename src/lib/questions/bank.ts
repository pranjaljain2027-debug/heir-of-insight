import { questionSchema, optionKey, type Direction, type Cell, type OptionValue, type Question } from "./schema";
import { seedQuestions } from "./seed";

export const DIRECTIONS: Direction[] = ["up", "right", "down", "left"];
export function rotateClockwise(d: Direction, quarterTurns = 1): Direction {
  const i = DIRECTIONS.indexOf(d);
  return DIRECTIONS[(((i + quarterTurns) % 4) + 4) % 4]!;
}

/** Cells of the missing half, in local coordinates of that half. */
export function mirrorHalf(axis: "vertical" | "horizontal", given: Cell[]): Cell[] {
  return given.map(([r, c]) => (axis === "vertical" ? [r, 1 - c] : [1 - r, c]) as Cell);
}

/** Independently derive the intended answer from the scene and rule. */
export function solve(q: Question): OptionValue | null {
  const { scene, rule } = q;
  if (rule.kind === "quarter_turn_clockwise") {
    if (scene.kind === "arrow") return { type: "direction", direction: rotateClockwise(scene.start) };
    if (scene.kind === "corner") return { type: "direction", direction: rotateClockwise(scene.shortArm) };
  }
  if (rule.kind === "mirror_reflection" && scene.kind === "mirror") return { type: "cells", cells: mirrorHalf(scene.axis, scene.given) };
  if (rule.kind === "add_constant" && (scene.kind === "dots" || scene.kind === "bars")) {
    const t = scene.terms;
    for (let i = 1; i < t.length; i++) if (t[i]! - t[i - 1]! !== rule.amount) return null;
    return { type: "count", count: t[t.length - 1]! + rule.amount };
  }
  return null;
}

export type ValidationResult = { ok: true; question: Question } | { ok: false; reason: string };

export function validateQuestion(raw: unknown): ValidationResult {
  const parsed = questionSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, reason: parsed.error.issues[0]?.message ?? "Invalid question" };
  const q = parsed.data;
  const expected = solve(q);
  if (!expected) return { ok: false, reason: "Rule does not match the scene" };
  const matching = q.options.filter((o) => optionKey(o.value) === optionKey(expected));
  if (matching.length !== 1) return { ok: false, reason: "Exactly one option must match the rule" };
  if (matching[0]!.id !== q.correctOptionId) return { ok: false, reason: "Answer key disagrees with the rule" };
  return { ok: true, question: q };
}

const bank = new Map<string, Question>();
const rejected = new Map<string, string>();
for (const raw of seedQuestions) {
  const r = validateQuestion(raw);
  if (r.ok && r.question.status === "published") bank.set(r.question.id, r.question);
  else rejected.set(raw.id, r.ok ? "Not published" : r.reason);
}

export function getQuestion(id: string): Question | undefined {
  return bank.get(id);
}
export function primaryQuestions(): Question[] {
  return [...bank.values()].filter((q) => q.role === "primary");
}
export function rejectedItems() {
  return rejected;
}

/** Demo-mode evaluation only. Production must evaluate on the server. */
export function evaluate(q: Question, optionId: string): boolean {
  if (!q.options.some((o) => o.id === optionId)) throw new Error("Unknown option");
  return optionId === q.correctOptionId;
}
