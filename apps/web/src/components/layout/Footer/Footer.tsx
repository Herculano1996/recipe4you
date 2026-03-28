import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import XIcon from "@mui/icons-material/X";
import type { FooterProps, FooterSection } from "./Footer.types.js";
import {
  FooterRoot,
  FooterInner,
  FooterTop,
  BrandColumn,
  LogoMark,
  Tagline,
  SocialRow,
  SocialButton,
  LinkSection,
  SectionTitle,
  FooterLink,
  FooterDivider,
  FooterBottom,
  Copyright,
  BottomLinks,
  BottomLink,
} from "./Footer.styled.js";

const sections: FooterSection[] = [
  {
    title: "Explore",
    links: [
      { label: "Discover recipes", href: "/discover" },
      { label: "Search", href: "/search" },
      { label: "Browse by tag", href: "/tags" },
      { label: "Trending", href: "/discover?sort=trending" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign up", href: "/auth/register" },
      { label: "Log in", href: "/auth/login" },
      { label: "My recipes", href: "/profile" },
      { label: "Favorites", href: "/profile/favorites" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

export function Footer({ className }: FooterProps) {
  return (
    <FooterRoot as="footer" className={className}>
      <FooterInner>
        <FooterTop>
          <BrandColumn>
            <LogoMark variant="h2">recipe4you</LogoMark>
            <Tagline>
              A community for people who love cooking. Discover, create, and
              share recipes that inspire.
            </Tagline>
            <SocialRow>
              <SocialButton
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
              >
                <GitHubIcon fontSize="small" />
              </SocialButton>
              <SocialButton
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <InstagramIcon fontSize="small" />
              </SocialButton>
              <SocialButton
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
              >
                <XIcon fontSize="small" />
              </SocialButton>
            </SocialRow>
          </BrandColumn>

          {sections.map((section) => (
            <LinkSection key={section.title}>
              <SectionTitle>{section.title}</SectionTitle>
              {section.links.map((link) => (
                <FooterLink key={link.href} href={link.href}>
                  {link.label}
                </FooterLink>
              ))}
            </LinkSection>
          ))}
        </FooterTop>

        <FooterDivider />

        <FooterBottom>
          <Copyright>
            © {new Date().getFullYear()} recipe4you. All rights reserved.
          </Copyright>
          <BottomLinks>
            <BottomLink href="/privacy">Privacy</BottomLink>
            <BottomLink href="/terms">Terms</BottomLink>
            <BottomLink href="/cookies">Cookies</BottomLink>
          </BottomLinks>
        </FooterBottom>
      </FooterInner>
    </FooterRoot>
  );
}
