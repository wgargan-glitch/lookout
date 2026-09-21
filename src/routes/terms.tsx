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
        Trip totals at checkout show the host's daily rate, trip liability, and a guest protection
        plan (Minimum, Standard, or Premier). A booking holds the car for those dates. Host
        reimbursement for a covered incident is funded from the protection the guest picks. What
        Lookout Parks charges hosts is set out in the{" "}
        <Link to="/host-agreement">Host agreement</Link>.
      </p>

      <h2>Trip cover</h2>
      <p>
        Every booked trip includes trip liability for other people and their cars while you drive.
        Minimum, Standard, and Premier cap what you may owe if the host’s car is damaged or stolen
        during the trip. They are not a substitute for a personal auto policy. Hosts keep insurance
        for when the car is not on a trip.
      </p>
      <p>
        If you want to use your own policy instead of a Lookout damage plan, checkout is where you
        ask. Trip liability stays on the booking either way. Read{" "}
        <Link to="/protection">Protection</Link> before you book. File incidents from{" "}
        <Link to="/claims">Claims</Link>.
      </p>
      <p>
        Claims do not cover interior damage, mechanical wear, late return, lost keys, the pickup
        window before check-in is complete, closed park roads, racing, DUI, or commercial use,
        unless a plan says otherwise.
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
