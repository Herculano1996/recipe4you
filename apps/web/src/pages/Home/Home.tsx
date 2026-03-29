import { useState } from "react";
import { useNavigate } from "react-router";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { SearchBar } from "../../components/search/SearchBar/SearchBar.js";
import { RecipeGrid } from "../../components/recipe/RecipeGrid/RecipeGrid.js";
import { useRecipes } from "../../hooks/useRecipes.js";
import type { HomeFeature } from "./Home.types.js";
import {
  HeroSection,
  HeroBackground,
  HeroBlob,
  HeroNoise,
  HeroContent,
  HeroBadge,
  HeroHeading,
  HeadingAccent,
  HeroSubheading,
  HeroSearchWrapper,
  HeroTagsRow,
  HeroTag,
  HeroStats,
  StatItem,
  StatNumber,
  StatLabel,
  ScrollIndicator,
  FeaturesSection,
  FeaturesInner,
  FeaturesGrid,
  FeatureCard,
  FeatureIcon,
  FeatureTitle,
  FeatureDesc,
  SectionWrapper,
  SectionInner,
  SectionHeader,
  SectionEyebrow,
  SectionTitle,
  ViewAllButton,
  CategoryStrip,
  CategoryChip,
  CtaBanner,
  CtaContent,
  CtaHeading,
  CtaSubheading,
  CtaActions,
  CtaPrimaryButton,
  CtaSecondaryButton,
} from "./Home.styled.js";

const QUICK_TAGS = [
  "Pasta",
  "30-min meals",
  "Vegetarian",
  "Breakfast",
  "Healthy",
  "Desserts",
];

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

const FEATURES: HomeFeature[] = [
  {
    icon: "🔍",
    title: "Discover Thousands",
    desc: "Browse over 10,000 chef-quality recipes from cuisines around the world, curated and community-loved.",
  },
  {
    icon: "📌",
    title: "Save & Organise",
    desc: "Create personal collections, bookmark favorites, and build your own digital cookbook with ease.",
  },
  {
    icon: "✍️",
    title: "Share Your Craft",
    desc: "Publish your recipes, get feedback from a passionate community, and inspire fellow home cooks.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const { data: featuredData, isLoading: isFeaturedLoading } = useRecipes({
    sort: "newest",
    limit: 4,
  });
  const { data: trendingData, isLoading: isTrendingLoading } = useRecipes({
    sort: "newest",
    limit: 8,
    tag:
      activeCategory === "All"
        ? undefined
        : activeCategory.toLowerCase().replaceAll(" ", "-"),
  });

  const featuredRecipes = featuredData?.pages.flatMap((p) => p.items) ?? [];
  const trendingRecipes = trendingData?.pages.flatMap((p) => p.items) ?? [];

  const handleSearch = (value: string) => {
    if (value.trim()) navigate(`/search?q=${encodeURIComponent(value.trim())}`);
  };

  const handleTagClick = (tag: string) => {
    navigate(`/search?q=${encodeURIComponent(tag)}`);
  };

  return (
    <>
      {/* ─── Hero ───────────────────────────────────── */}
      <HeroSection aria-labelledby="hero-heading">
        <HeroBackground aria-hidden>
          <HeroBlob $which={1} />
          <HeroBlob $which={2} />
          <HeroBlob $which={3} />
          <HeroNoise />
        </HeroBackground>

        <HeroContent>
          <HeroBadge>
            <span className="dot" aria-hidden />
            Now in Beta &mdash; join 10,000+ home cooks
          </HeroBadge>

          <HeroHeading id="hero-heading">
            Cook Something
            <br />
            <HeadingAccent>Extraordinary</HeadingAccent> Today
          </HeroHeading>

          <HeroSubheading>
            Discover chef-quality recipes, save your favorites, and share what
            you love with a community of passionate food enthusiasts.
          </HeroSubheading>

          <HeroSearchWrapper>
            <SearchBar
              value={searchValue}
              onChange={setSearchValue}
              onSearch={handleSearch}
              size="lg"
              placeholder="Search recipes, ingredients, cuisines…"
              variant="dark"
            />
          </HeroSearchWrapper>

          <HeroTagsRow aria-label="Quick search suggestions">
            {QUICK_TAGS.map((tag) => (
              <HeroTag
                key={tag}
                onClick={() => handleTagClick(tag)}
                aria-label={`Search ${tag}`}
              >
                {tag}
              </HeroTag>
            ))}
          </HeroTagsRow>

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

        <ScrollIndicator aria-hidden>
          <KeyboardArrowDownIcon />
          Scroll
        </ScrollIndicator>
      </HeroSection>

      {/* ─── Why recipe4you ─────────────────────────── */}
      <FeaturesSection aria-labelledby="features-heading">
        <FeaturesInner>
          <div style={{ textAlign: "center" }}>
            <SectionEyebrow>Why recipe4you</SectionEyebrow>
            <SectionTitle variant="h2" id="features-heading">
              Everything you need to cook better
            </SectionTitle>
          </div>
          <FeaturesGrid>
            {FEATURES.map((f) => (
              <FeatureCard key={f.title}>
                <FeatureIcon aria-hidden>{f.icon}</FeatureIcon>
                <FeatureTitle>{f.title}</FeatureTitle>
                <FeatureDesc>{f.desc}</FeatureDesc>
              </FeatureCard>
            ))}
          </FeaturesGrid>
        </FeaturesInner>
      </FeaturesSection>

      {/* ─── Featured recipes ───────────────────────── */}
      <SectionWrapper aria-labelledby="featured-heading">
        <SectionInner>
          <SectionHeader>
            <div>
              <SectionEyebrow>Handpicked</SectionEyebrow>
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
            recipes={featuredRecipes}
            loading={isFeaturedLoading}
            skeletonCount={4}
            emptyMessage="Featured recipes coming soon — check back shortly!"
          />
        </SectionInner>
      </SectionWrapper>

      {/* ─── Trending ───────────────────────────────── */}
      <SectionWrapper
        aria-labelledby="trending-heading"
        style={{ background: "#f9f9f7", paddingTop: 56, paddingBottom: 56 }}
      >
        <SectionInner>
          <SectionHeader>
            <div>
              <SectionEyebrow>Explore</SectionEyebrow>
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
              recipes={trendingRecipes}
              loading={isTrendingLoading}
              skeletonCount={8}
              emptyMessage="Trending recipes will appear here once data is available."
            />
          </div>
        </SectionInner>
      </SectionWrapper>

      {/* ─── CTA ────────────────────────────────────── */}
      <CtaBanner aria-labelledby="cta-heading">
        <CtaContent>
          <CtaHeading id="cta-heading">Share your best recipe</CtaHeading>
          <CtaSubheading>
            Join thousands of home cooks. Publish your creations, inspire
            others, and build your culinary legacy.
          </CtaSubheading>
        </CtaContent>
        <CtaActions>
          <CtaPrimaryButton
            size="large"
            onClick={() => navigate("/recipes/new")}
            disableElevation
          >
            Add your recipe
          </CtaPrimaryButton>
          <CtaSecondaryButton
            size="large"
            onClick={() => navigate("/discover")}
            disableElevation
          >
            Browse first
          </CtaSecondaryButton>
        </CtaActions>
      </CtaBanner>
    </>
  );
}
