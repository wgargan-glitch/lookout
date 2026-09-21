import { createFileRoute } from "@tanstack/react-router";
import { type FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { createTicket, listMyTickets, type TicketRow } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/support")({ component: SupportPage });

function SupportPage() {
  const { user, isPending } = useCurrentUserState();
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (!user) return;
    void listMyTickets().then(setTickets);
  }, [user]);

  if (isPending) return <main className="mx-auto max-w-3xl px-4 py-16 text-sm text-muted-foreground">Loading the help desk…</main>;
  if (!user) return <RedirectToSignIn />;

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setPending(true);
    try {
      await createTicket({
        data: {
          topic: String(form.get("topic") ?? "general"),
          subject: String(form.get("subject") ?? ""),
          body: String(form.get("body") ?? ""),
        },
      });
      toast("Ticket opened. The ranger desk has it.");
      e.currentTarget.reset();
      setTickets(await listMyTickets());
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not open a ticket.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm font-medium tracking-wide text-sage uppercase">Help desk</p>
      <h1 className="mt-1 font-display text-4xl">Ask the rangers</h1>
      <p className="mt-2 text-muted-foreground">
        Bookings, listings, pickup pins, protection. We’ll write back on this page.
      </p>

      <Card className="mt-8 p-6">
        <form onSubmit={onSubmit} className="grid gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="topic">Topic</Label>
            <select id="topic" name="topic" className="flex h-11 w-full rounded-md border border-input bg-card px-3 text-sm">
              <option value="booking">A booking</option>
              <option value="hosting">Hosting</option>
              <option value="protection">Protection</option>
              <option value="account">Account</option>
              <option value="general">Something else</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="subject">Subject</Label>
            <Input id="subject" name="subject" required minLength={3} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="body">What you need</Label>
            <Textarea id="body" name="body" rows={5} required minLength={10} />
          </div>
          <Button type="submit" disabled={pending}>
            {pending ? "Sending…" : "Open ticket"}
          </Button>
        </form>
      </Card>

      <section className="mt-10">
        <h2 className="font-display text-2xl">Your tickets</h2>
        {tickets.length === 0 ? (
          <p className="mt-3 text-sm text-muted-foreground">No tickets yet.</p>
        ) : (
          <div className="mt-4 space-y-3">
            {tickets.map((t) => (
              <Card key={t.id} className="p-4">
                <p className="text-xs tracking-wide text-muted-foreground uppercase">
                  {t.status} · {t.topic}
                </p>
                <p className="font-medium">{t.subject}</p>
                <p className="mt-1 text-sm text-muted-foreground">{t.body}</p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
