import { useState } from "react";
import { useNavigate } from "react-router";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import type { RecipeSummary } from "@recipe4you/types";
import { SearchBar } from "../components/search/SearchBar/SearchBar.js";
import { RecipeGrid } from "../components/recipe/RecipeGrid/RecipeGrid.js";
import {
  HeroSection,
  HeroBackground,
  HeroBlob,
  HeroContent,
  HeroBadge,
  HeroHeading,
  HeadingAccent,
  HeroSubheading,
  HeroSearchWrapper,
  HeroStats,
  StatItem,
  StatNumber,
  StatLabel,
  SectionWrapper,
  SectionInner,
  SectionHeader,
  SectionLabel,
  SectionTitle,
  ViewAllButton,
  CategoryStrip,
  CategoryChip,
  CtaBanner,
  CtaText,
  CtaHeading,
  CtaSubheading,
  CtaButton,
  CtaDecoration,
} from "./Home.styled.js";

const CATEGORIES = [
  "All",
  "Breakfast",
  "Lunch",
  "Dinner",
  "Snacks",
  "Desserts",
  "Vegetarian",
  "Quick & Easy",
];

// Placeholder data — replaced by real API data once query hooks are wired up
const MOCK_RECIPES: RecipeSummary[] = [];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const handleSearch = (value: string) => {
    if (value.trim()) {
      navigate(`/search?q=${encodeURIComponent(value.trim())}`);
    }
  };

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
      <HeroSection aria-labelledby="hero-heading">
        <HeroBackground aria-hidden>
          <HeroBlob $which={1} />
          <HeroBlob $which={2} />
          <HeroBlob $which={3} />
        </HeroBackground>

        <HeroContent>
          <HeroBadge
            icon={<AutoAwesomeIcon style={{ fontSize: 14 }} />}
            label="10,000+ recipes &amp; counting"
          />

          <HeroHeading variant="h1" id="hero-heading">
            Cook something
            <br />
            <HeadingAccent>extraordinary</HeadingAccent> today
          </HeroHeading>

          <HeroSubheading>
            Discover chef-quality recipes, save your favorites, and share what
            you love with a community of food enthusiasts.
          </HeroSubheading>

          <HeroSearchWrapper>
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              onSearch={handleSearch}
              size="lg"
              placeholder="Search recipes, ingredients, cuisines…"
            />
          </HeroSearchWrapper>

          <HeroStats aria-label="Platform statistics">
            <StatItem>
              <StatNumber aria-label="10 thousand plus recipes">
                10k+
              </StatNumber>
              <StatLabel>Recipes</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber aria-label="5 thousand plus cooks">5k+</StatNumber>
              <StatLabel>Cooks</StatLabel>
            </StatItem>
            <StatItem>
              <StatNumber aria-label="200 plus cuisines">200+</StatNumber>
              <StatLabel>Cuisines</StatLabel>
            </StatItem>
          </HeroStats>
        </HeroContent>
      </HeroSection>

      {/* ── Featured recipes ─────────────────────────────── */}
      <SectionWrapper aria-labelledby="featured-heading">
        <SectionInner>
          <SectionHeader>
            <div>
              <SectionLabel aria-hidden>Handpicked</SectionLabel>
              <SectionTitle variant="h2" id="featured-heading">
                Featured this week
              </SectionTitle>
            </div>
            <ViewAllButton
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/discover")}
              aria-label="View all featured recipes"
            >
              View all
            </ViewAllButton>
          </SectionHeader>

          <RecipeGrid
            recipes={MOCK_RECIPES}
            loading={false}
            skeletonCount={4}
            emptyMessage="Featured recipes coming soon — check back shortly!"
          />
        </SectionInner>
      </SectionWrapper>

      {/* ── Browse by category ───────────────────────────── */}
      <SectionWrapper
        aria-labelledby="trending-heading"
        style={{ background: "#fafafa", paddingTop: 56, paddingBottom: 56 }}
      >
        <SectionInner>
          <SectionHeader>
            <div>
              <SectionLabel aria-hidden>Explore</SectionLabel>
              <SectionTitle variant="h2" id="trending-heading">
                Trending now
              </SectionTitle>
            </div>
            <ViewAllButton
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/discover?sort=trending")}
              aria-label="View all trending recipes"
            >
              View all
            </ViewAllButton>
          </SectionHeader>

          <CategoryStrip role="group" aria-label="Filter by category">
            {CATEGORIES.map((cat) => (
              <CategoryChip
                key={cat}
                label={cat}
                $active={cat === activeCategory}
                onClick={() => setActiveCategory(cat)}
                aria-pressed={cat === activeCategory}
                aria-label={`Filter: ${cat}`}
              />
            ))}
          </CategoryStrip>

          <div style={{ marginTop: 32 }}>
            <RecipeGrid
              recipes={MOCK_RECIPES}
              loading={false}
              skeletonCount={8}
              emptyMessage="Trending recipes will appear here once you have some data."
            />
          </div>
        </SectionInner>
      </SectionWrapper>

      {/* ── CTA banner ───────────────────────────────────── */}
      <CtaBanner aria-label="Create your own recipe">
        <CtaDecoration aria-hidden />
        <CtaText>
          <CtaHeading>Share your best recipe</CtaHeading>
          <CtaSubheading>
            Join thousands of home cooks and publish your creations for the
            world to enjoy.
          </CtaSubheading>
        </CtaText>
        <CtaButton
          size="large"
          onClick={() => navigate("/recipes/new")}
          disableElevation
        >
          Add your recipe
        </CtaButton>
      </CtaBanner>
    </>
  );
}
