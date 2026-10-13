import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
export const childSchema = z.object({ display_name: z.string().trim().min(1, 'Please enter a display name.').max(60), age: z.coerce.number().int().min(5).max(13), consent: z.literal(true), preferences: z.object({ grade: z.string().max(30), experience: z.string().max(100), goals: z.array(z.string().max(50)).max(12), interests: z.array(z.string().max(30)).max(4), frequency: z.string().max(50), minutes: z.string().max(30), testDate: z.string().max(30), structure: z.string().max(30), context: z.string().max(1000) }) });
export const getLearningData = createServerFn({ method: 'GET' }).middleware([requireSupabaseAuth]).handler(async ({ context }) => {
 const children = await context.supabase.from('children').select('*').order('created_at');
 const events = await context.supabase.from('learning_events').select('*').order('created_at', { ascending: false }).limit(500);
 const profile = await context.supabase.from('profiles').select('*').eq('id', context.userId).maybeSingle();
 if (children.error || events.error || profile.error) throw new Error('Your learning history could not be loaded. Please try again.');
 return { children: children.data ?? [], events: events.data ?? [], profile: profile.data };
});
export const saveChild = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((data: unknown) => childSchema.parse(data)).handler(async ({ data, context }) => {
 const result = await context.supabase.from('children').insert({ parent_id: context.userId, display_name: data.display_name, age: data.age, preferences: data.preferences, guardian_consent_at: new Date().toISOString() }).select().single();
 if (result.error) throw new Error('The profile could not be saved. Please try again.');
 return result.data;
});
export const recordLearning = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((data: unknown) => z.object({ child_id: z.string().uuid(), activity_id: z.enum(['patterns', 'shapes', 'numbers', 'words', 'sample']), concept: z.enum(['Sequence', 'Rotation', 'Number relationships', 'Analogy']), event_type: z.enum(['answer','hint','explanation','manipulation','transfer','discovery']), correct: z.boolean().optional() }).parse(data)).handler(async ({ data, context }) => {
 const result = await context.supabase.from('learning_events').insert({ child_id: data.child_id, activity_id: data.activity_id, concept: data.concept, event_type: data.event_type, correct: data.correct ?? null, parent_id: context.userId });
 if (result.error) throw new Error('This observation could not be saved.');
 return { saved: true };
});
export const updateParent = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((data: unknown) => z.object({ display_name: z.string().trim().max(100) }).parse(data)).handler(async ({ data, context }) => {
 const result = await context.supabase.from('profiles').update(data).eq('id', context.userId);
 if (result.error) throw new Error('Changes could not be saved.');
 return { saved: true };
});
export const deleteChild = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((data: unknown) => z.object({ id: z.string().uuid() }).parse(data)).handler(async ({ data, context }) => {
 const result = await context.supabase.from('children').delete().eq('id', data.id).eq('parent_id', context.userId);
 if (result.error) throw new Error('The child profile could not be deleted.');
 return { deleted: true };
});
export const sendSupport = createServerFn({ method: 'POST' }).middleware([requireSupabaseAuth]).inputValidator((data: unknown) => z.object({ subject: z.string().trim().min(1).max(150), message: z.string().trim().min(1).max(2000) }).parse(data)).handler(async ({ data, context }) => {
 const result = await context.supabase.from('support_requests').insert({ subject: data.subject, message: data.message, parent_id: context.userId });
 if (result.error) throw new Error('Your request could not be saved.');
 return { saved: true };
});
