"use client";

import LegalPage from "@/components/LegalPage";

const sections = [
  { heading: "1. Registration Fee", body: "A one-time registration fee of PKR 1,000 is required to activate your profile. There are no monthly or yearly subscription charges." },
  { heading: "2. Profile Verification", body: "All profiles are subject to admin review before activation. We reserve the right to reject or deactivate profiles that contain false or misleading information." },
  { heading: "3. Acceptable Use", body: "Members agree to use the platform solely for legitimate matrimonial purposes and not to harass, misrepresent, or solicit other members outside the intended use of the service." },
  { heading: "4. Account Suspension", body: "Nikah Manzil may suspend or delete accounts found to be in violation of these terms, including fraudulent registrations or abusive behavior." },
  { heading: "5. Payment Approval", body: "Registration fee payments are manually reviewed. Profiles remain in a 'Pending' state until payment is approved by our admin team." },
  { heading: "6. Limitation of Liability", body: "Nikah Manzil facilitates introductions between families but does not guarantee the outcome of any proposal, engagement, or marriage." },
];

export default function Terms() {
  return <LegalPage title="Terms & Conditions" updated="June 2026" sections={sections} />;
}
