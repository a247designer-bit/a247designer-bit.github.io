import type { FaqItem } from "@/components/site/faq";

/**
 * The FAQ copy for the four product pages, kept out of the pages themselves.
 *
 * Each set answers the questions that page's own reader arrives with, and only
 * those: a client booking an appointment and a host listing a chair have
 * almost nothing in common, so the four lists deliberately share no entries.
 *
 * Nothing here states a commercial term the site does not already state
 * elsewhere. The one price quoted — the flat 5% on the professionals list — is
 * the one already published on the home page's pricing band; everything else
 * points at the terms shown in the app rather than restating them, because a
 * cancellation window or a payout schedule invented here is a promise made on
 * a marketing page.
 */

/** Services — people finding and booking a professional. */
export const SERVICES_FAQ: FaqItem[] = [
  {
    id: 1,
    question: "What is Blookd?",
    answer:
      "Blookd is where you find independent beauty and wellness professionals near you, look at their work, compare what they offer and book directly with them.",
    icon: "💇",
    iconPosition: "right",
  },
  {
    id: 2,
    question: "How do I book an appointment?",
    answer:
      "Search by service, style or location, open a profile to see the work, the prices and what is free, then pick a time and confirm. The booking goes straight to the professional.",
  },
  {
    id: 3,
    question: "Do I need an account to book?",
    answer:
      "Yes. Creating one takes a moment in the Blookd app, and it is what keeps your appointments, your favourites and the professionals you have been to before in one place.",
  },
  {
    id: 4,
    question: "Can I reschedule or cancel?",
    answer:
      "Yes, from the app. How late you can do it depends on the cancellation policy the professional has set, which is shown on the booking before you confirm it.",
  },
  {
    id: 5,
    question: "What payment methods are accepted?",
    answer:
      "Credit and debit cards, with additional options available depending on the professional you are booking with.",
  },
  {
    id: 6,
    question: "Will I be charged if I cancel?",
    answer:
      "That depends on the professional. Each one sets their own cancellation policy, so check the one attached to your booking — it is shown before you confirm.",
  },
  {
    id: 7,
    question: "How do I leave a review?",
    answer:
      "Once the appointment is done, open it in your bookings and use the review section there. You can edit or delete a review afterwards from your review history.",
    icon: "⭐",
    iconPosition: "left",
  },
  {
    id: 8,
    question: "How do gift cards work?",
    answer:
      "Buy one in the gift card section of the app, choose the amount, and share it by email or social with whoever it is for.",
  },
  {
    id: 9,
    question: "Something went wrong. Who do I talk to?",
    answer:
      "Use the support option in the app, or email help@blookd.com and a person will pick it up.",
  },
];

/** Professionals — independents building a practice on Blookd. */
export const PROFESSIONALS_FAQ: FaqItem[] = [
  {
    id: 1,
    question: "Which app do I need?",
    answer:
      "Both, and they do different jobs. Blookd Biz is where clients discover you and where your bookings and schedule live. Blookd Rental is where you find a chair, room or studio to work from.",
  },
  {
    id: 2,
    question: "What does it cost?",
    answer:
      "No monthly fee. A flat 5%, and only when a client pays you. Every feature is included, there are no setup fees and no long-term contract — full terms are shown before you publish.",
    icon: "💸",
    iconPosition: "right",
  },
  {
    id: 3,
    question: "How do clients find me?",
    answer:
      "People search by service, style and location. Your profile — your work, your services, your prices and your open times — is what they are searching through.",
  },
  {
    id: 4,
    question: "Do I keep my own clients?",
    answer:
      "Yes. The relationships you build are yours. Blookd is where people find you and book you, not who they belong to afterwards.",
  },
  {
    id: 5,
    question: "Can I set my own prices and hours?",
    answer:
      "Yes. You decide what you offer, what it costs and when you are available, and you can change any of it whenever your work changes.",
  },
  {
    id: 6,
    question: "Do I need my own salon to join?",
    answer:
      "No. Blookd Rental exists for exactly that: book a workspace for the days you need one, without signing a lease or committing to a chair full time.",
  },
  {
    id: 7,
    question: "How do I get paid?",
    answer:
      "Clients pay through the app and the money is paid out to the account you set up in your profile. The schedule and any applicable fees are shown in your payment settings.",
  },
  {
    id: 8,
    question: "How do I get help?",
    answer:
      "Through support in the app, or by emailing help@blookd.com.",
  },
];

/**
 * Workspaces — professionals renting space through Blookd Rental. Follows the
 * published Blookd Rental FAQ.
 */
export const WORKSPACES_FAQ: FaqItem[] = [
  {
    id: 1,
    question: "What is Blookd Rental?",
    answer:
      "Blookd Rental is the platform where you book workspaces for beauty and wellness services from the hosts who run them — a chair, a room or a whole studio.",
  },
  {
    id: 2,
    question: "How do I create an account?",
    answer:
      "Download the Blookd Rental app and follow the sign-up. That account is what you book, message hosts and manage your rentals from.",
  },
  {
    id: 3,
    question: "How do I book a workspace?",
    answer:
      "Search for the workspace you want, pick a time that works for you, and confirm. Photos, amenities, location and pricing are all on the listing before you commit.",
    icon: "🪑",
    iconPosition: "right",
  },
  {
    id: 4,
    question: "Can I reschedule or cancel a booking?",
    answer:
      "Yes, directly in the app — usually up to a certain point before the booking starts, depending on the host's cancellation policy.",
  },
  {
    id: 5,
    question: "What payment methods are accepted?",
    answer:
      "Credit and debit cards, with further options depending on the host.",
  },
  {
    id: 6,
    question: "Will I be charged for cancelling?",
    answer:
      "Cancellation policies are set by each host, so check the one on the listing when you book.",
  },
  {
    id: 7,
    question: "How do I review a host?",
    answer:
      "Once the booking is finished, open its details in the app and use the review section. You can edit or delete a review later from your review history.",
  },
  {
    id: 8,
    question: "Can I use a gift card?",
    answer:
      "Yes. Gift cards are bought in the gift card section of the app, and can be shared by email or social once purchased.",
  },
  {
    id: 9,
    question: "I cannot log in. What should I do?",
    answer:
      "Check the email and password you are using, and if the password has gone, use the recovery option on the sign-in screen.",
  },
  {
    id: 10,
    question: "How do I report a technical problem?",
    answer:
      "Through the support option in the app, or by emailing help@blookd.com.",
  },
];

/** Hosts — owners with space to put to work. */
export const HOSTS_FAQ: FaqItem[] = [
  {
    id: 1,
    question: "What can I list?",
    answer:
      "Anything a beauty or wellness professional can work from: a single chair, a station, a treatment room or a whole studio. One listing per space, with photos, amenities and pricing.",
    icon: "🔑",
    iconPosition: "right",
  },
  {
    id: 2,
    question: "Do I have to open all my hours?",
    answer:
      "No. You open only the hours you want bookable and keep the rest for your own business. Most hosts start with the time that was already sitting empty.",
  },
  {
    id: 3,
    question: "Who books my space?",
    answer:
      "Independent beauty professionals using Blookd Rental to find somewhere to work — people already searching for a space like yours, in your area, on the days you have opened.",
  },
  {
    id: 4,
    question: "Who sets the price?",
    answer:
      "You do, per day or per session, and you can change it whenever you like. What you set is what professionals see on the listing.",
  },
  {
    id: 5,
    question: "Can I set house rules?",
    answer:
      "Yes. Rules, amenities and anything a professional needs to know before booking go on the listing, so they are agreed before anyone arrives rather than explained on the day.",
  },
  {
    id: 6,
    question: "How do I get paid?",
    answer:
      "Bookings are paid through the app and paid out to the account on your host profile. The schedule and any applicable fees are shown in your payment settings.",
  },
  {
    id: 7,
    question: "What if someone cancels?",
    answer:
      "You choose the cancellation policy your listing runs on, and it applies to every booking made against it.",
  },
  {
    id: 8,
    question: "How do I get help?",
    answer:
      "Through support in the app, or by emailing help@blookd.com.",
  },
];
