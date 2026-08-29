import { cn } from "@/lib/utils";
import { FacebookIcon } from "@/components/ui/facebook-icon";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { LinkedinIcon } from "@/components/ui/linkedin-icon";
import { NewTwitterIcon } from "@/components/ui/new-twitter-icon";

/**
 * Where Blookd is, off this site.
 *
 * Every URL is https, including the two supplied as http. Both hosts redirect
 * to TLS anyway, so an http link only buys a round trip and one hop of the
 * address in clear.
 */
const SOCIALS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=100073337298480",
    Icon: FacebookIcon,
  },
  { label: "X", href: "https://www.twitter.com/blookdme", Icon: NewTwitterIcon },
  {
    label: "Instagram",
    href: "https://www.instagram.com/blookdme/",
    Icon: InstagramIcon,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/company/blookd",
    Icon: LinkedinIcon,
  },
];

/**
 * The social row.
 *
 * Each icon draws itself on hover, so the anchor is the 44px box and the mark
 * sits at 20px inside it — the animation needs a still frame around it, and a
 * tap target the size of the drawing would be too small to hit anyway.
 *
 * The marks are line art on `currentColor`, which is what lets them sit at
 * ink-62 with the rest of the footer's quiet type and come up to full
 * foreground on hover along with everything else. The icons carry `aria-hidden`
 * and the name lives on the link, so a screen reader hears "Instagram", not a
 * graphic with no name.
 *
 * `target="_blank"` because these leave the site: someone reading the footer is
 * mid-page, and replacing it with a Facebook profile loses their place.
 */
export function SocialLinks({ className }: { className?: string }) {
  return (
    <ul className={cn("flex items-center gap-1", className)}>
      {SOCIALS.map(({ label, href, Icon }) => (
        <li key={label}>
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            // 30px on a phone, half again on the 20 a desktop gets. The size
            // prop lands on the svg as width/height attributes, which is the
            // lowest-precedence way to size an element — so a class overrides
            // it and the mark can be responsive without the component being.
            //
            // The box stays 44px either way: it is the tap target, and it was
            // already the smallest one worth having. What changes is how much
            // of it the drawing fills, which is why the footer's pull-back
            // offset changes with it — 7px of padding to reclaim now, not 12.
            className="inline-flex size-11 items-center justify-center rounded-full text-ink-62 transition-colors hover:text-foreground [&_svg]:size-[30px] md:[&_svg]:size-5"
          >
            <Icon size={20} />
          </a>
        </li>
      ))}
    </ul>
  );
}
