import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalDoc } from "@/components/legal/legal-doc";

export const Route = createFileRoute("/terms")({ component: TermsPage });

function TermsPage() {
  return (
    <LegalDoc kicker="Legal" title="Terms of service" updated="September 16, 2026">
      <p>
        These terms cover use of Lookout on the web, iPhone, and Android. By creating an account or
        booking a trip you agree to them. Lookout is a private marketplace. It is not the National
        Park Service and is not a licensed insurer.
      </p>

      <h2>The marketplace</h2>
      <p>
        Hosts list privately owned cars in a park gateway town. Guests book dates and meet the host
        for pickup. Lookout does not own the cars, does not employ the hosts, and does not operate
        park roads. You still need a valid driver's license, a park pass where required, and
        you follow park closures.
      </p>

      <h2>Accounts</h2>
      <p>
        You must be 18 or older to book or host. Keep your login to yourself. You may delete the
        account at any time from <Link to="/account">Account</Link>. We may pause a listing or an
        account that breaks these terms or puts guests, hosts, or parks at risk.
      </p>

      <h2>Money</h2>
      <p>
        Trip totals show the host's daily rate, a 10% Lookout service fee, and the protection
        plan you choose. Card charges are not collected yet — a booking confirms the reservation
        and the waiver only. When payments go live, the same split applies and refunds follow the
        host's cancellation window.
      </p>

      <h2>Lookout Protection</h2>
      <p>
        Trail, Ridge, and Summit are contractual damage waivers administered by Lookout. They are
        not insurance policies issued by a licensed carrier. Hosts must carry their own valid auto
        insurance where the car is registered, and they attest to that when they list. Read{" "}
        <Link to="/protection">Protection</Link> before you book. File incidents from{" "}
        <Link to="/claims">Claims</Link>.
      </p>

      <h2>Your responsibilities</h2>
      <p>
        Drive legally. Return the car on time, reasonably fueled or charged. Do not take closed
        roads, race, or use the car commercially. Hosts keep the listing accurate and the car
        registered, insured, and safe.
      </p>

      <h2>Content</h2>
      <p>
        Listings, profiles, tickets, and claims are your content. You give Lookout a license to
        show them on the site and in the apps so the marketplace can function. Do not post anyone
        else's personal data, illegal content, or photos you do not have rights to.
      </p>

      <h2>Limitation</h2>
      <p>
        Lookout is provided as-is. We are not liable for park conditions, host or guest conduct,
        mechanical failure, or unavailability of a car. The waiver terms on Protection control for
        physical damage during a booked trip.
      </p>
    </LegalDoc>
  );
}
