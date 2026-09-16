import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalDoc } from "@/components/legal/legal-doc";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  return (
    <LegalDoc kicker="Legal" title="Privacy policy" updated="September 16, 2026">
      <p>
        Lookout is a peer-to-peer car marketplace for trips to U.S. national parks. This policy
        describes what we collect, why, and how to delete it. Lookout is not affiliated with the
        National Park Service.
      </p>

      <h2>What we collect</h2>
      <p>
        When you create an account we store the name and email from Google, X, or the address you
        type, plus a Lookout user id. You may add a trail name, phone, hometown, and bio. We store
        listings, bookings, support tickets, and claims you submit, including dates, car details,
        and the protection plan you pick.
      </p>
      <p>
        We do not collect precise GPS, contacts, photos from your camera roll, or payment card
        numbers. Card charges are not live on Lookout yet. We do not sell personal information.
      </p>

      <h2>How we use it</h2>
      <p>
        Account data runs the marketplace: showing your trips, matching a guest to a host, staffing
        the ranger desk, and sending you back to the same profile on the website, iPhone app, and
        Android app. Hosts see the guest name on a confirmed trip. Admins see tickets and claims so
        they can help.
      </p>

      <h2>Sign-in providers</h2>
      <p>
        Google and X sign-in is federated through the Grok auth broker. Email and password is stored
        only in Lookout's own account database (hashed). The iPhone store app uses email and
        password only, so we do not need Sign in with Apple.
      </p>

      <h2>Retention and deletion</h2>
      <p>
        We keep account and trip records while the account is open. You can delete your Lookout from{" "}
        <Link to="/account">Account</Link> — type DELETE to confirm. That cancels open trips, removes
        your listings, tickets, claims, and profile, and signs you out. Some cancelled-trip records
        may remain in anonymized form if another guest or host still needs the calendar history.
      </p>

      <h2>Children</h2>
      <p>
        Lookout is for adults who can legally drive. It is not directed at children under 13, and we
        do not knowingly collect their data.
      </p>

      <h2>Contact</h2>
      <p>
        Privacy questions go through the in-app help desk. There is no separate mailing address
        published until Lookout is a registered business entity.
      </p>
    </LegalDoc>
  );
}
