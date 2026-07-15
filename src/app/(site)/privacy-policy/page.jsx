"use client";

import LegalPage from "@/components/LegalPage";

const sections = [
  { heading: "1. Information We Collect", body: "We collect personal, education, career and family information you provide during registration and profile setup, along with photos and contact details you choose to share." },
  { heading: "2. How We Use Your Information", body: "Your information is used to create and display your matrimonial profile, match you with suitable proposals, verify your identity, and communicate important account updates." },
  { heading: "3. Hidden Photos & Contact Numbers", body: "Phone numbers and any photos you mark as hidden remain private by default. Access is only granted between two specific users after admin approval, at your request." },
  { heading: "4. Data Sharing", body: "We do not sell or rent your personal information to third parties. Information is only shared with other verified members as necessary for the matchmaking process." },
  { heading: "5. Data Security", body: "We use password encryption, secure sessions, and activity monitoring to protect your account from unauthorized access." },
  { heading: "6. Your Rights", body: "You may edit, hide, or delete your profile information at any time from your dashboard, or contact our support team for assistance." },
];

export default function PrivacyPolicy() {
  return <LegalPage title="Privacy Policy" updated="June 2026" sections={sections} />;
}
