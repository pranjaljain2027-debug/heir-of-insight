import { useEffect, useMemo, useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useQuery } from '@tanstack/react-query';
import { useServerFn } from '@tanstack/react-start';
import { supabase } from '@/integrations/supabase/client';
import { getLearningData } from '@/lib/learning.functions';
import { Button } from '@/components/ui/button';
import { PageShell, Intro } from './shared';

const eventLabels: Record<string, string> = { answer: 'Answered', hint: 'Used a hint', explanation: 'Read an explanation', manipulation: 'Explored the model', transfer: 'Applied the idea', discovery: 'Made a discovery' };
const activityLabels: Record<string, string> = { patterns: 'Patterns', shapes: 'Shapes', numbers: 'Numbers', words: 'Words', sample: 'Sample activity' };

function useSignedIn() {
  const [state, setState] = useState<{ ready: boolean; signedIn: boolean }>({ ready: false, signedIn: false });
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setState({ ready: true, signedIn: !!data.session }));
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') setState({ ready: true, signedIn: !!session });
    });
    return () => data.subscription.unsubscribe();
  }, []);
  return state;
}

export default function LearningHistory({ view }: { view: 'parent' | 'discoveries' }) {
  const auth = useSignedIn();
  const fetchData = useServerFn(getLearningData);
  const query = useQuery({ queryKey: ['learning-data'], queryFn: () => fetchData(), enabled: auth.signedIn });
  const [childId, setChildId] = useState<string | null>(null);
  const children = query.data?.children ?? [];
  const active = children.find((c) => c.id === childId) ?? children[0];
  const events = useMemo(() => (query.data?.events ?? []).filter((e) => e.child_id === active?.id), [query.data, active?.id]);

  const concepts = useMemo(() => {
    const map = new Map<string, { total: number; answers: number; correct: number; discoveries: number }>();
    for (const e of events) {
      const c = map.get(e.concept) ?? { total: 0, answers: 0, correct: 0, discoveries: 0 };
      c.total++;
      if (e.event_type === 'answer') { c.answers++; if (e.correct) c.correct++; }
      if (e.event_type === 'discovery' || e.event_type === 'transfer') c.discoveries++;
      map.set(e.concept, c);
    }
    return [...map.entries()].sort((a, b) => b[1].total - a[1].total);
  }, [events]);

  const activities = useMemo(() => {
    const map = new Map<string, { count: number; last: string; completed: boolean }>();
    for (const e of events) {
      const a = map.get(e.activity_id) ?? { count: 0, last: e.created_at, completed: false };
      a.count++;
      if (e.created_at > a.last) a.last = e.created_at;
      if (e.event_type === 'answer' && e.correct) a.completed = true;
      map.set(e.activity_id, a);
    }
    return [...map.entries()];
  }, [events]);

  const title = view === 'parent' ? 'Parent dashboard' : 'Discoveries';
  const intro = view === 'parent' ? 'A calm view of what each child has explored. Observations only: no scores, rankings, or comparisons.' : 'The moments where an idea clicked, and the reasoning concepts behind them.';

  let body;
  if (!auth.ready || (auth.signedIn && query.isPending)) body = <p className="notice">Loading learning history…</p>;
  else if (!auth.signedIn) body = <div className="empty-state"><p>Sign in to see your children's learning history.</p><Button asChild><Link to="/login">Sign in</Link></Button></div>;
  else if (query.isError) body = <div className="empty-state"><p>{query.error.message}</p><Button onClick={() => query.refetch()}>Try again</Button></div>;
  else if (!active) body = <div className="empty-state"><p>No child profiles yet.</p><Button asChild><Link to="/onboarding">Add a child</Link></Button></div>;
  else body = (
    <div className="space-y-8">
      {children.length > 1 && <div className="action-row" role="tablist" aria-label="Choose a child">{children.map((c) => <Button key={c.id} role="tab" aria-selected={c.id === active.id} variant={c.id === active.id ? 'default' : 'outline'} onClick={() => setChildId(c.id)}>{c.display_name}</Button>)}</div>}
      <section className="grid gap-4 sm:grid-cols-3">
        <Stat label="Recorded moments" value={events.length} />
        <Stat label="Activities explored" value={activities.length} />
        <Stat label="Discoveries" value={events.filter((e) => e.event_type === 'discovery' || e.event_type === 'transfer').length} />
      </section>
      {events.length === 0 ? <div className="empty-state"><p>{active.display_name} hasn't started an activity yet.</p><Button asChild><Link to="/learn/$activityId" params={{ activityId: 'sample' }}>Try the sample activity</Link></Button></div> : <>
        <section><h2 className="mb-3 text-xl font-semibold">Progress by reasoning concept</h2>
          <ul className="space-y-3">{concepts.map(([name, c]) => { const pct = c.answers ? Math.round((c.correct / c.answers) * 100) : 0; return <li key={name} className="rounded-lg border border-border bg-card p-4"><div className="flex justify-between text-sm"><strong>{name}</strong><span className="text-muted-foreground">{c.total} moments · {c.answers ? `${c.correct}/${c.answers} answers reasoned through` : 'no answers yet'}</span></div><div className="mt-2 h-2 rounded-full bg-muted" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label={`${name} progress`}><div className="h-2 rounded-full bg-primary" style={{ width: `${pct}%` }} /></div></li>; })}</ul>
        </section>
        {view === 'parent' && <section><h2 className="mb-3 text-xl font-semibold">Activities</h2>
          <ul className="grid gap-3 sm:grid-cols-2">{activities.map(([id, a]) => <li key={id} className="rounded-lg border border-border bg-card p-4"><strong>{activityLabels[id] ?? id}</strong><p className="text-sm text-muted-foreground">{a.completed ? 'Completed' : 'In progress'} · {a.count} moments · last {new Date(a.last).toLocaleDateString()}</p></li>)}</ul>
        </section>}
        <section><h2 className="mb-3 text-xl font-semibold">{view === 'parent' ? 'Learning history' : 'Discovery moments'}</h2>
          <ol className="space-y-2">{(view === 'parent' ? events : events.filter((e) => e.event_type === 'discovery' || e.event_type === 'transfer' || (e.event_type === 'answer' && e.correct))).slice(0, 50).map((e) => <li key={e.id} className="flex justify-between gap-4 rounded-md border border-border p-3 text-sm"><span>{eventLabels[e.event_type] ?? e.event_type} · {e.concept} in {activityLabels[e.activity_id] ?? e.activity_id}</span><time className="text-muted-foreground" dateTime={e.created_at}>{new Date(e.created_at).toLocaleString()}</time></li>)}</ol>
        </section>
      </>}
    </div>
  );

  return <PageShell><Intro eyebrow={view === 'parent' ? 'FOR PARENTS' : 'WHAT CLICKED'} title={title}>{intro}</Intro><div className="mx-auto max-w-4xl px-4 pb-16">{body}</div></PageShell>;
}

function Stat({ label, value }: { label: string; value: number }) {
  return <div className="rounded-lg border border-border bg-card p-4"><div className="text-3xl font-semibold">{value}</div><div className="text-sm text-muted-foreground">{label}</div></div>;
}
