import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalDoc } from "@/components/legal/legal-doc";

export const Route = createFileRoute("/terms")({ component: TermsPage });

function TermsPage() {
  return (
    <LegalDoc kicker="Legal" title="Terms of service" updated="September 18, 2026">
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
        Trip totals show four renter-paid lines: the host's daily rate, a 10% Lookout service fee,
        trip liability, and a guest protection plan (Minimum, Standard, or Premier). Card charges
        are not collected yet — a booking confirms the reservation, the liability line, and the
        waiver only. When payments go live, the same split applies and refunds follow the host's
        cancellation window. The 10% fee is the platform cut. Host reimbursement for a covered
        incident is funded from the renter-paid protection line, not by taking a larger share of
        host earnings.
      </p>

      <h2>Trip cover</h2>
      <p>
        Every booked trip includes trip liability, meant to be a motor liability policy issued to
        Lookout that meets the trip state's financial-responsibility and P2P car-sharing rules. A
        licensed carrier is not bound yet. In states that require it (including New York and
        Maryland), that cover is primary during the sharing period. If a host or renter policy
        lapses or excludes P2P use, platform cover is intended to respond from the first dollar
        where the statute requires that.
      </p>
      <p>
        Minimum, Standard, and Premier are contractual damage waivers that cap what the renter owes
        for physical damage and theft of the host vehicle. They are not insurance policies. Do not
        treat a plan as “fully insured.” Hosts keep personal or commercial auto insurance for
        periods when the car is not on a trip; personal policies usually exclude car-sharing. Ordinary
        hosts cannot opt out of trip cover. Only a licensed commercial rental operator with a
        commercial rental policy that covers guest use, meets minimum limits, and names Lookout as
        additional insured may request a waiver of platform cover.
      </p>
      <p>
        A renter may take a cheaper physical-damage plan or decline it only after live carrier
        verification (Axle or equivalent) confirms the policy is active through trip end, names the
        driver, meets state minimums, and actually extends to peer-to-peer rentals. Photos of
        insurance cards, declarations pages, and credit-card rental benefits are not proof. Trip
        liability stays on the booking either way. Read{" "}
        <Link to="/protection">Protection</Link> before you book. File incidents from{" "}
        <Link to="/claims">Claims</Link>.
      </p>
      <p>
        Claims gaps include interior damage, mechanical wear, late return, lost keys, the pickup
        window before check-in is complete, closed park roads, racing, DUI, and commercial use,
        unless a plan rider says otherwise.
      </p>

      <h2>Your responsibilities</h2>
      <p>
        Drive legally. Return the car on time, reasonably fueled or charged. Do not take closed
        roads, race, or use the car commercially. Hosts keep the listing accurate and the car
        registered, insured for off-trip use, and safe. Guests complete phone check-in before they
        drive.
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
        mechanical failure, or unavailability of a car. Trip liability and the waiver terms on{" "}
        <Link to="/protection">Protection</Link> control for incidents during a booked trip after
        check-in.
      </p>
    </LegalDoc>
  );
}
