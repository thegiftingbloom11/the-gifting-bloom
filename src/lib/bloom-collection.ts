import { categoryNames, occasions, type Product } from "./bloom";
import sunflowerBouquet from "@/assets/collection/sunflower-bouquet.jpg";
import mixedFlowerBouquet from "@/assets/collection/mixed-flower-bouquet.jpg";
import lavenderBouquet from "@/assets/collection/lavender-bouquet.jpg";
import blueLilyBouquet from "@/assets/collection/blue-lily-bouquet.jpg";
import burgundyLilyBouquet from "@/assets/collection/burgundy-lily-bouquet.jpg";
import sunflowerAndDaisyBouquet from "@/assets/collection/sunflower-and-daisy-bouquet.jpg";
import wrappedPinkLily from "@/assets/collection/wrapped-pink-lily.jpg";
import singleSunflower from "@/assets/collection/single-sunflower.jpg";
import wrappedBurgundyLily from "@/assets/collection/wrapped-burgundy-lily.jpg";
import pinkLilyStem from "@/assets/collection/pink-lily-stem.jpg";
import wrappedMagentaLily from "@/assets/collection/wrapped-magenta-lily.jpg";
import cherryKeychain from "@/assets/collection/cherry-keychain.jpg";
import tulipKeychain from "@/assets/collection/tulip-keychain.jpg";
import sunflowerKeychain from "@/assets/collection/sunflower-keychain.jpg";
import lavenderKeychain from "@/assets/collection/lavender-keychain.jpg";
import flowerDiyaHolders from "@/assets/collection/flower-diya-holders.jpg";
import sunflowerDashboardPot from "@/assets/collection/sunflower-dashboard-pot.jpg";
import pinkDaisyDashboardPot from "@/assets/collection/pink-daisy-dashboard-pot.jpg";
import burgundyVaseFlowers from "@/assets/collection/burgundy-vase-flowers.jpg";
import colourfulVaseStems from "@/assets/collection/colourful-vase-stems.jpg";

function studioProduct(
  photo: string,
  slug: string,
  name: string,
  category: keyof typeof categoryNames,
  colors: string[],
  description: string,
  giftOccasions: string[],
): Product {
  return {
    id: "studio:" + slug,
    slug,
    name,
    category,
    categoryName: categoryNames[category],
    colors,
    description,
    image_url: photo,
    image_alt: description,
    is_demo: false,
    occasions: giftOccasions,
    images: [],
    video: "",
    variants: [],
    seo: "",
  };
}

export const studioCollection = [
  studioProduct(
    sunflowerBouquet,
    "pocketful-of-sun",
    "Sunflower Bouquet",
    "bouquets",
    ["Gold", "Sage"],
    "Two handmade yellow sunflowers with white accents in printed kraft wrap.",
    [occasions[1], occasions[4], occasions[5], occasions[7]],
  ),
  studioProduct(
    mixedFlowerBouquet,
    "blush-keepsake",
    "Mixed Flower Bouquet",
    "bouquets",
    ["Gold", "Rose", "Blush", "Lavender", "Ivory"],
    "A sunflower, tulips and lilies arranged in pink marble-effect wrapping.",
    [occasions[0], occasions[1], occasions[2], occasions[5], occasions[7]],
  ),
  studioProduct(
    lavenderBouquet,
    "lavender-letter",
    "Lavender Lily Bouquet",
    "bouquets",
    ["Lavender", "Ivory", "Sage"],
    "Lavender lilies and a tulip, wrapped in pale blue and tied with a gold ribbon.",
    [occasions[0], occasions[1], occasions[2], occasions[3], occasions[7]],
  ),
  studioProduct(
    blueLilyBouquet,
    "blue-lily-bouquet",
    "Blue Lily Bouquet",
    "bouquets",
    ["Blue", "Ivory", "Sage"],
    "Blue lilies and a daisy with pearl trim and a cream ribbon.",
    [occasions[1], occasions[2], occasions[3], occasions[5], occasions[7]],
  ),
  studioProduct(
    burgundyLilyBouquet,
    "burgundy-lily-bouquet",
    "Burgundy Lily Bouquet",
    "bouquets",
    ["Plum", "Ivory", "Lavender"],
    "Burgundy and cream flowers in lavender wrapping with a pale blue ribbon.",
    [occasions[0], occasions[1], occasions[2], occasions[7]],
  ),
  studioProduct(
    sunflowerAndDaisyBouquet,
    "sunflower-and-daisy-bouquet",
    "Sunflower and Daisy Bouquet",
    "bouquets",
    ["Gold", "Ivory", "Blue"],
    "A sunflower and white daisies in black and blue wrapping.",
    [occasions[1], occasions[4], occasions[5], occasions[7]],
  ),
  studioProduct(
    wrappedPinkLily,
    "wrapped-pink-lily",
    "Wrapped Pink Lily",
    "single-flowers",
    ["Blush", "Blue", "Gold"],
    "A single pink lily in blue wrapping with a gold bow.",
    [occasions[0], occasions[1], occasions[2], occasions[7]],
  ),
  studioProduct(
    singleSunflower,
    "single-sunflower",
    "Single Sunflower",
    "single-flowers",
    ["Gold", "Sage"],
    "A handmade sunflower in printed kraft wrap with a pale gold bow.",
    [occasions[1], occasions[3], occasions[4], occasions[5], occasions[7]],
  ),
  studioProduct(
    wrappedBurgundyLily,
    "wrapped-burgundy-lily",
    "Wrapped Burgundy Lily",
    "single-flowers",
    ["Plum", "Ivory", "Blue"],
    "A burgundy lily edged in white, with blue wrapping and a gold bow.",
    [occasions[0], occasions[1], occasions[2], occasions[7]],
  ),
  studioProduct(
    pinkLilyStem,
    "pink-lily-stem",
    "Pink Lily Stem",
    "single-flowers",
    ["Blush", "Rose", "Sage"],
    "An unwrapped two-tone pink lily with a long stem and gold bow.",
    [occasions[0], occasions[1], occasions[2], occasions[7]],
  ),
  studioProduct(
    wrappedMagentaLily,
    "wrapped-magenta-lily",
    "Wrapped Magenta Lily",
    "single-flowers",
    ["Rose", "Blush", "Blue"],
    "A pale pink lily edged in magenta and wrapped in blue.",
    [occasions[0], occasions[1], occasions[2], occasions[7]],
  ),
  studioProduct(
    cherryKeychain,
    "cherry-keychain",
    "Cherry Keychain",
    "keychains",
    ["Rose", "Sage"],
    "Two burgundy cherries with green stems on a gold-tone keyring.",
    [occasions[1], occasions[3], occasions[7]],
  ),
  studioProduct(
    tulipKeychain,
    "tulip-keychain",
    "Tulip Keychain",
    "keychains",
    ["Blush", "Gold", "Sage"],
    "Pink and yellow tulip buds on a gold-tone keyring.",
    [occasions[1], occasions[3], occasions[7]],
  ),
  studioProduct(
    sunflowerKeychain,
    "little-bloom-charm",
    "Sunflower Keychain",
    "keychains",
    ["Gold"],
    "A yellow sunflower with a brown centre on a gold-tone keyring.",
    [occasions[1], occasions[3], occasions[5], occasions[7]],
  ),
  studioProduct(
    lavenderKeychain,
    "lavender-keychain",
    "Lavender Keychain",
    "keychains",
    ["Lavender", "Sage"],
    "Two lavender sprigs on a silver-tone keyring.",
    [occasions[1], occasions[3], occasions[7]],
  ),
  studioProduct(
    flowerDiyaHolders,
    "flower-diya-holders",
    "Flower Diya Holders",
    "diya-holders",
    ["Blue", "Rose", "Gold", "Blush", "Lavender"],
    "Five flower-shaped diya holders with pearl trim in assorted colours.",
    [occasions[6], occasions[7]],
  ),
  studioProduct(
    sunflowerDashboardPot,
    "sunflower-dashboard-pot",
    "Sunflower Dashboard Pot",
    "car-dashboard-pots",
    ["Gold", "Sage"],
    "Three miniature sunflowers in a brown pot with white trim.",
    [occasions[1], occasions[3], occasions[5], occasions[7]],
  ),
  studioProduct(
    pinkDaisyDashboardPot,
    "pink-daisy-dashboard-pot",
    "Pink Daisy Dashboard Pot",
    "car-dashboard-pots",
    ["Blush", "Rose", "Sage"],
    "A pink daisy in a miniature brown pot with a gold bow.",
    [occasions[0], occasions[1], occasions[3], occasions[7]],
  ),
  studioProduct(
    burgundyVaseFlowers,
    "burgundy-vase-flowers",
    "Burgundy Vase Flowers",
    "flower-pot-flowers",
    ["Plum", "Blue", "Sage"],
    "Burgundy tulips and a lily arranged in a blue vase.",
    [occasions[0], occasions[1], occasions[2], occasions[6], occasions[7]],
  ),
  studioProduct(
    colourfulVaseStems,
    "colourful-vase-stems",
    "Colourful Vase Stems",
    "flower-pot-flowers",
    ["Rose", "Blush", "Gold", "Sage"],
    "Colourful handmade stems displayed in a yellow painted bottle.",
    [occasions[1], occasions[5], occasions[6], occasions[7]],
  ),
];

export function withStudioCollection(cloudProducts: Product[]) {
  const collection = new Map(studioCollection.map((item) => [item.slug, item]));
  for (const item of cloudProducts) {
    if (!item.is_demo) collection.set(item.slug, item);
  }
  return [...collection.values()];
}
