import { createFileRoute, Link } from "@tanstack/react-router";
import { LegalDoc } from "@/components/legal/legal-doc";
import { SERVICE_FEE_RATE } from "@/lib/pricing";

export const Route = createFileRoute("/host-agreement")({ component: HostAgreementPage });

const FEE_PCT = Math.round(SERVICE_FEE_RATE * 100);

function HostAgreementPage() {
  return (
    <LegalDoc kicker="Hosts" title="Host agreement" updated="September 20, 2026">
      <p>
        This is the agreement between you (the car owner, “Host”) and Lookout Parks (“Lookout,”
        lookoutparks.com) for listing a privately owned vehicle on the Lookout marketplace. By
        publishing a listing you agree to these terms. Guest rules live in the{" "}
        <Link to="/terms">Terms of service</Link>.
      </p>

      <h2>Platform service fee</h2>
      <p>
        Lookout keeps a platform service fee of {FEE_PCT}% of the trip price (the Host’s listed
        daily rate × booked days). That fee is the company’s compensation for operating the
        marketplace. It is not taken from trip liability or from guest protection plans. Those
        lines are paid by the guest and fund trip cover, not Host earnings.
      </p>
      <p>
        Example: a $100/day listing booked for three days is a $300 trip. Lookout’s service fee is
        $30. The Host’s earning on that trip is the remaining trip price, before any valid claim,
        penalty, or reimbursement under the protection plan.
      </p>
      <p>
        Guests see a trip total at checkout. The {FEE_PCT}% above is what Lookout Parks keeps from
        the trip price.
      </p>

      <h2>What guests pay</h2>
      <p>
        Guests pay the trip price, trip liability, and a protection plan (Minimum, Standard, or
        Premier). Protection plans cap what the guest may owe if the car is damaged. They are not a
        substitute for the Host’s personal auto policy.
      </p>

      <h2>Off-trip insurance</h2>
      <p>
        You must keep valid auto insurance on the vehicle for periods when it is not on a Lookout
        trip. Personal policies usually exclude commercial and peer-to-peer use. Ordinary Hosts
        cannot opt out of Lookout trip cover. Only a licensed commercial rental operator meeting
        the waiver conditions in the Terms of service may request a waiver of platform cover.
      </p>

      <h2>Listings</h2>
      <p>
        You set the daily rate. Photos must be of the actual car. Six required angles must be on
        file before a listing can go live. Lookout may pause a listing that is unsafe, inaccurate,
        or tied to an open claim.
      </p>

      <h2>Not the Park Service</h2>
      <p>
        Lookout is a private marketplace. It is not affiliated with the National Park Service and
        is not a licensed insurer.
      </p>
    </LegalDoc>
  );
}
