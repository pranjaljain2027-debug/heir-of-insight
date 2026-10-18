import { z } from "zod";

/**
 * Versioned question schema. Scenes are typed primitives only — never HTML,
 * SVG strings or code. Every item is validated before it can be rendered.
 */
export const directionSchema = z.enum(["up", "right", "down", "left"]);
export type Direction = z.infer<typeof directionSchema>;

const cellSchema = z.tuple([z.number().int().min(0).max(3), z.number().int().min(0).max(3)]);
export type Cell = z.infer<typeof cellSchema>;

export const sceneSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("arrow"), start: directionSchema }),
  z.object({ kind: z.literal("corner"), shortArm: directionSchema, longArm: directionSchema }),
  z.object({
    kind: z.literal("mirror"),
    axis: z.enum(["vertical", "horizontal"]),
    mark: z.enum(["square", "circle"]),
    given: z.array(cellSchema).min(1).max(8),
  }),
  z.object({ kind: z.literal("dots"), terms: z.array(z.number().int().min(1).max(12)).min(3).max(5) }),
  z.object({ kind: z.literal("bars"), terms: z.array(z.number().int().min(1).max(12)).min(3).max(5) }),
]);
export type Scene = z.infer<typeof sceneSchema>;

export const optionValueSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("direction"), direction: directionSchema }),
  z.object({ type: z.literal("cells"), cells: z.array(cellSchema) }),
  z.object({ type: z.literal("count"), count: z.number().int().min(1).max(14) }),
]);
export type OptionValue = z.infer<typeof optionValueSchema>;

export const sceneStateSchema = z.object({
  turns: z.number().min(0).max(4).optional(),
  ghost: z.boolean().optional(),
  reveal: z.number().int().min(0).max(8).optional(),
  highlight: z.number().int().min(0).max(5).optional(),
  showNext: z.boolean().optional(),
});
export type SceneState = z.infer<typeof sceneStateSchema>;

export const ruleSchema = z.discriminatedUnion("kind", [
  z.object({ kind: z.literal("quarter_turn_clockwise"), description: z.string().min(1) }),
  z.object({ kind: z.literal("mirror_reflection"), description: z.string().min(1) }),
  z.object({ kind: z.literal("add_constant"), amount: z.number().int().min(1).max(5), description: z.string().min(1) }),
]);

export const questionSchema = z
  .object({
    id: z.string().regex(/^[a-z]+-[a-z]+-\d{2}$/),
    version: z.number().int().min(1),
    status: z.enum(["published", "draft", "retired"]),
    sourceType: z.literal("curated_manual"),
    role: z.enum(["primary", "transfer"]),
    topic: z.enum(["patterns", "shapes", "numbers", "words"]),
    capability: z.string().min(1),
    concept: z.string().min(1),
    conceptLabel: z.string().min(1),
    ageBand: z.string().min(1),
    difficulty: z.number().int().min(1).max(3),
    title: z.string().min(1),
    prompt: z.string().min(1),
    scene: sceneSchema,
    options: z
      .array(z.object({ id: z.string().min(1), label: z.string().min(1), value: optionValueSchema }))
      .min(2)
      .max(6),
    /** Demo only: in production this lives on the server and is never sent to the browser. */
    correctOptionId: z.string().min(1),
    rule: ruleSchema,
    hintSteps: z.array(z.string().min(1)).min(1).max(3),
    explanationSteps: z.array(z.object({ text: z.string().min(1), state: sceneStateSchema })).min(2).max(4),
    manipulation: z.object({ kind: z.enum(["rotate", "fold", "step"]), instructions: z.string().min(1) }),
    transferQuestionId: z.string().nullable(),
    distractorRationale: z.record(z.string(), z.string()),
    altText: z.string().min(1),
    reviewStatus: z.enum(["reviewed_in_code", "needs_review"]),
  })
  .superRefine((q, ctx) => {
    const ids = q.options.map((o) => o.id);
    const labels = q.options.map((o) => o.label);
    if (new Set(ids).size !== ids.length) ctx.addIssue({ code: "custom", message: "Option ids must be unique" });
    if (new Set(labels).size !== labels.length) ctx.addIssue({ code: "custom", message: "Option labels must be unique" });
    const keys = q.options.map((o) => optionKey(o.value));
    if (new Set(keys).size !== keys.length) ctx.addIssue({ code: "custom", message: "Option values must be distinct" });
    if (!ids.includes(q.correctOptionId)) ctx.addIssue({ code: "custom", message: "Correct option must exist" });
    if (q.role === "primary" && !q.transferQuestionId) ctx.addIssue({ code: "custom", message: "Primary items need a transfer item" });
    if (q.transferQuestionId === q.id) ctx.addIssue({ code: "custom", message: "Transfer must be a different item" });
    for (const id of ids) {
      if (id !== q.correctOptionId && !q.distractorRationale[id]) ctx.addIssue({ code: "custom", message: `Missing distractor rationale for ${id}` });
    }
  });

export type Question = z.infer<typeof questionSchema>;

export function optionKey(v: OptionValue): string {
  if (v.type === "direction") return `d:${v.direction}`;
  if (v.type === "count") return `n:${v.count}`;
  return `c:${[...v.cells].map(([r, c]) => `${r}${c}`).sort().join(",")}`;
}
