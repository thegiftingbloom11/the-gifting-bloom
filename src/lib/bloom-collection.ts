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
import wrappedRedLily from "@/assets/collection/wrapped-red-lily.jpg";
import lavenderBouquetAngle from "@/assets/collection/lavender-bouquet-angle.jpg";
import redLilyBouquet from "@/assets/collection/red-lily-bouquet.jpg";
import blackWrapBurgundyLily from "@/assets/collection/black-wrap-burgundy-lily.jpg";
import kraftSunflowerDaisyBouquet from "@/assets/collection/kraft-sunflower-daisy-bouquet.jpg";
import peachTulipBouquet from "@/assets/collection/peach-tulip-bouquet.jpg";
import magentaLilyBouquet from "@/assets/collection/magenta-lily-bouquet.jpg";
import sunflowerBouquetAngle from "@/assets/collection/sunflower-bouquet-angle.jpg";
import magentaLimeGoldDiyaHolders from "@/assets/collection/magenta-lime-gold-diya-holders.jpg";
import blackWrapPinkLily from "@/assets/collection/black-wrap-pink-lily.jpg";
import redGreenSingleDiyaHolder from "@/assets/collection/red-green-single-diya-holder.jpg";
import magentaYellowDiyaHolders from "@/assets/collection/magenta-yellow-diya-holders.jpg";
import blueGoldDiyaHolders from "@/assets/collection/blue-gold-diya-holders.jpg";
import layeredPurpleDiyaHolders from "@/assets/collection/layered-purple-diya-holders.jpg";
import flowerDiyaHoldersAssortment from "@/assets/collection/flower-diya-holders-assortment.jpg";
import lavenderPearlDiyaHolders from "@/assets/collection/lavender-pearl-diya-holders.jpg";
import yellowPearlDiyaHolders from "@/assets/collection/yellow-pearl-diya-holders.jpg";
import burgundyPearlDiyaHolders from "@/assets/collection/burgundy-pearl-diya-holders.jpg";
import pearlFlowerKeychain from "@/assets/collection/pearl-flower-keychain.jpg";
import layeredIvoryBurgundyDiyaHolders from "@/assets/collection/layered-ivory-burgundy-diya-holders.jpg";
import pearlFlowerKeychainAngle from "@/assets/collection/pearl-flower-keychain-angle.jpg";
import shubhLabhHangings from "@/assets/collection/shubh-labh-hangings.jpg";
import twinSunflowerDashboardPot from "@/assets/collection/twin-sunflower-dashboard-pot.jpg";
import pinkPearlDiyaHolders from "@/assets/collection/pink-pearl-diya-holders.jpg";
import pinkMagentaDiyaHolders from "@/assets/collection/pink-magenta-diya-holders.jpg";
import ivoryRedPearlDiyaHolders from "@/assets/collection/ivory-red-pearl-diya-holders.jpg";
import lavenderPearlDiyaHoldersAngle from "@/assets/collection/lavender-pearl-diya-holders-angle.jpg";
import redGreenDiyaHolders from "@/assets/collection/red-green-diya-holders.jpg";
import brownIvoryDiyaHolders from "@/assets/collection/brown-ivory-diya-holders.jpg";
import pinkPearlDiyaHoldersAngle from "@/assets/collection/pink-pearl-diya-holders-angle.jpg";
import redYellowDiyaHolders from "@/assets/collection/red-yellow-diya-holders.jpg";
import twoToneBluePearlDiyaHolders from "@/assets/collection/two-tone-blue-pearl-diya-holders.jpg";
import magentaLimePearlDiyaHolders from "@/assets/collection/magenta-lime-pearl-diya-holders.jpg";
import yellowPearlDiyaHoldersAngle from "@/assets/collection/yellow-pearl-diya-holders-angle.jpg";
import lavenderGoldPetalDiyaHolders from "@/assets/collection/lavender-gold-petal-diya-holders.jpg";
import sageRoseGoldPetalDiyaHolders from "@/assets/collection/sage-rose-gold-petal-diya-holders.jpg";
import blueGoldPetalDiyaHolders from "@/assets/collection/blue-gold-petal-diya-holders.jpg";
import roseLavenderGoldPetalDiyaHolders from "@/assets/collection/rose-lavender-gold-petal-diya-holders.jpg";
import shubhLabhHangingsAngle from "@/assets/collection/shubh-labh-hangings-angle.jpg";

function studioProduct(
  photo: string,
  slug: string,
  name: string,
  category: keyof typeof categoryNames,
  colors: string[],
  description: string,
  giftOccasions: string[],
  additionalPhotos: string[] = [],
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
    images: additionalPhotos,
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
    [sunflowerBouquetAngle],
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
    [lavenderBouquetAngle],
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
    [flowerDiyaHoldersAssortment],
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
  studioProduct(
    wrappedRedLily,
    "wrapped-red-lily",
    "Wrapped Red Lily",
    "single-flowers",
    ["Rose", "Gold", "Blue"],
    "A red lily with a golden centre, black paper and pearl-trimmed blue wrapping.",
    [occasions[0], occasions[1], occasions[2], occasions[7]],
  ),
  studioProduct(
    blackWrapBurgundyLily,
    "black-wrap-burgundy-lily",
    "Burgundy Lily in Black Wrap",
    "single-flowers",
    ["Plum", "Gold"],
    "A single burgundy lily in a black cone with a pale gold bow.",
    [occasions[0], occasions[1], occasions[2], occasions[7]],
  ),
  studioProduct(
    blackWrapPinkLily,
    "black-wrap-pink-lily",
    "Pink Lily in Black Wrap",
    "single-flowers",
    ["Blush", "Gold"],
    "A pale pink lily in black and gold wrapping, finished with a pearl bow.",
    [occasions[0], occasions[1], occasions[2], occasions[7]],
  ),
  studioProduct(
    redLilyBouquet,
    "red-lily-bouquet",
    "Red Lily Bouquet",
    "bouquets",
    ["Rose", "Ivory", "Blue"],
    "Red lilies and a tulip bud with white accents, wrapped in blue and tied with a gold ribbon.",
    [occasions[0], occasions[1], occasions[2], occasions[7]],
  ),
  studioProduct(
    kraftSunflowerDaisyBouquet,
    "kraft-sunflower-daisy-bouquet",
    "Kraft Sunflower and Daisy Bouquet",
    "bouquets",
    ["Gold", "Ivory", "Blue"],
    "A sunflower and white daisies backed with printed kraft paper and tied in blue wrapping.",
    [occasions[0], occasions[1], occasions[2], occasions[7]],
  ),
  studioProduct(
    peachTulipBouquet,
    "peach-tulip-bouquet",
    "Peach Tulip Bouquet",
    "bouquets",
    ["Blush", "Ivory", "Sage"],
    "Five peach tulips with deep green leaves and pale wrapping.",
    [occasions[0], occasions[1], occasions[2], occasions[7]],
  ),
  studioProduct(
    magentaLilyBouquet,
    "magenta-lily-bouquet",
    "Magenta Lily and Daisy Bouquet",
    "bouquets",
    ["Rose", "Blush", "Ivory"],
    "Magenta lilies and a daisy in pleated wrapping with a cream bow.",
    [occasions[0], occasions[1], occasions[2], occasions[7]],
  ),
  studioProduct(
    pearlFlowerKeychain,
    "pearl-flower-keychain",
    "Pearl Flower Keychain",
    "keychains",
    ["Rose", "Sage", "Ivory"],
    "A bright pink flower and pearl loop on a silver-tone keyring.",
    [occasions[1], occasions[3], occasions[7]],
    [pearlFlowerKeychainAngle],
  ),
  studioProduct(
    twinSunflowerDashboardPot,
    "twin-sunflower-dashboard-pot",
    "Twin Sunflower Dashboard Pot",
    "car-dashboard-pots",
    ["Gold", "Sage"],
    "Two miniature sunflowers on a compact green base.",
    [occasions[1], occasions[3], occasions[7]],
  ),
  studioProduct(
    shubhLabhHangings,
    "shubh-labh-hangings",
    "Shubh Labh Hangings",
    "festive-decor",
    ["Rose", "Sage", "Gold", "Ivory"],
    "A pair of red and green wall hangings with gold Shubh Labh lettering and pearl tassels.",
    [occasions[6], occasions[7]],
    [shubhLabhHangingsAngle],
  ),
  studioProduct(
    magentaLimeGoldDiyaHolders,
    "magenta-lime-gold-diya-holders",
    "Magenta and Lime Gold-Trim Diya Holders",
    "diya-holders",
    ["Rose", "Sage", "Gold"],
    "Magenta and lime petals around a gold-trimmed floral centre.",
    [occasions[6], occasions[7]],
  ),
  studioProduct(
    redGreenSingleDiyaHolder,
    "red-green-single-diya-holder",
    "Red and Green Diya Holder",
    "diya-holders",
    ["Rose", "Sage", "Gold"],
    "A single red and green flower-shaped holder with a pearl-trimmed centre.",
    [occasions[6], occasions[7]],
  ),
  studioProduct(
    magentaYellowDiyaHolders,
    "magenta-yellow-diya-holders",
    "Magenta and Yellow Diya Holders",
    "diya-holders",
    ["Rose", "Gold"],
    "Layered magenta and yellow flower-shaped holders.",
    [occasions[6], occasions[7]],
  ),
  studioProduct(
    blueGoldDiyaHolders,
    "blue-gold-diya-holders",
    "Blue Diya Holders with Gold Trim",
    "diya-holders",
    ["Blue", "Gold"],
    "Light and deep blue petals with a gold-edged floral centre.",
    [occasions[6], occasions[7]],
  ),
  studioProduct(
    layeredPurpleDiyaHolders,
    "layered-purple-diya-holders",
    "Layered Purple Diya Holders",
    "diya-holders",
    ["Lavender", "Plum", "Ivory"],
    "Purple petals in two tones with pale trim around the centre.",
    [occasions[6], occasions[7]],
  ),
  studioProduct(
    lavenderPearlDiyaHolders,
    "lavender-pearl-diya-holders",
    "Lavender Pearl Diya Holders",
    "diya-holders",
    ["Lavender", "Sage", "Ivory"],
    "Lavender petals and green leaves with pearl trim around each centre.",
    [occasions[6], occasions[7]],
    [lavenderPearlDiyaHoldersAngle],
  ),
  studioProduct(
    yellowPearlDiyaHolders,
    "yellow-pearl-diya-holders",
    "Yellow Pearl Diya Holders",
    "diya-holders",
    ["Gold", "Sage", "Ivory"],
    "Yellow petals with dark green leaves and a ring of pearls.",
    [occasions[6], occasions[7]],
    [yellowPearlDiyaHoldersAngle],
  ),
  studioProduct(
    burgundyPearlDiyaHolders,
    "burgundy-pearl-diya-holders",
    "Burgundy Pearl Diya Holders",
    "diya-holders",
    ["Plum", "Sage", "Ivory"],
    "Deep burgundy flowers with dark green leaves and pearl accents.",
    [occasions[6], occasions[7]],
  ),
  studioProduct(
    layeredIvoryBurgundyDiyaHolders,
    "layered-ivory-burgundy-diya-holders",
    "Layered Ivory and Burgundy Diya Holders",
    "diya-holders",
    ["Ivory", "Plum", "Gold"],
    "Ivory petals layered over burgundy petals around gold-tone cups.",
    [occasions[6], occasions[7]],
  ),
  studioProduct(
    pinkPearlDiyaHolders,
    "pink-pearl-diya-holders",
    "Pink Pearl Diya Holders",
    "diya-holders",
    ["Blush", "Sage", "Ivory"],
    "Soft pink petals with deep green leaves and pearl rings.",
    [occasions[6], occasions[7]],
    [pinkPearlDiyaHoldersAngle],
  ),
  studioProduct(
    pinkMagentaDiyaHolders,
    "pink-magenta-diya-holders",
    "Pink and Magenta Diya Holders",
    "diya-holders",
    ["Blush", "Rose", "Ivory"],
    "Pale pink and magenta petals layered around pearl-trimmed centres.",
    [occasions[6], occasions[7]],
  ),
  studioProduct(
    ivoryRedPearlDiyaHolders,
    "ivory-red-pearl-diya-holders",
    "Ivory and Red Pearl Diya Holders",
    "diya-holders",
    ["Ivory", "Rose", "Gold"],
    "Ivory petals layered over red with a row of pearls around each cup.",
    [occasions[6], occasions[7]],
  ),
  studioProduct(
    redGreenDiyaHolders,
    "red-green-diya-holders",
    "Red and Green Diya Holder Pair",
    "diya-holders",
    ["Rose", "Sage", "Ivory"],
    "Red flowers with green leaves and pearl detail around each centre.",
    [occasions[6], occasions[7]],
  ),
  studioProduct(
    brownIvoryDiyaHolders,
    "brown-ivory-diya-holders",
    "Brown and Ivory Diya Holders",
    "diya-holders",
    ["Brown", "Ivory", "Gold"],
    "Chocolate-brown petals layered with ivory and pearl accents.",
    [occasions[6], occasions[7]],
  ),
  studioProduct(
    redYellowDiyaHolders,
    "red-yellow-diya-holders",
    "Red and Yellow Diya Holders",
    "diya-holders",
    ["Rose", "Gold", "Ivory"],
    "Red and yellow flower-shaped holders with pearl-trimmed centres.",
    [occasions[6], occasions[7]],
  ),
  studioProduct(
    twoToneBluePearlDiyaHolders,
    "two-tone-blue-pearl-diya-holders",
    "Two-Tone Blue Pearl Diya Holders",
    "diya-holders",
    ["Blue", "Ivory"],
    "Sky-blue petals layered over deep blue with pearl accents.",
    [occasions[6], occasions[7]],
  ),
  studioProduct(
    magentaLimePearlDiyaHolders,
    "magenta-lime-pearl-diya-holders",
    "Magenta and Lime Pearl Diya Holders",
    "diya-holders",
    ["Rose", "Sage", "Ivory"],
    "Deep magenta petals with lime leaves and pearl trim.",
    [occasions[6], occasions[7]],
  ),
  studioProduct(
    lavenderGoldPetalDiyaHolders,
    "lavender-gold-petal-diya-holders",
    "Lavender Gold-Edged Petal Diya Holders",
    "diya-holders",
    ["Lavender", "Gold", "Ivory"],
    "Translucent lavender petals outlined in gold with pearl detail.",
    [occasions[6], occasions[7]],
  ),
  studioProduct(
    sageRoseGoldPetalDiyaHolders,
    "sage-rose-gold-petal-diya-holders",
    "Sage and Rose Gold-Edged Petal Diya Holders",
    "diya-holders",
    ["Sage", "Rose", "Gold"],
    "Sage-green outer petals and rose-pink inner petals with gold edging.",
    [occasions[6], occasions[7]],
  ),
  studioProduct(
    blueGoldPetalDiyaHolders,
    "blue-gold-petal-diya-holders",
    "Blue Gold-Edged Petal Diya Holders",
    "diya-holders",
    ["Blue", "Gold", "Ivory"],
    "Two shades of blue with translucent gold-edged petals.",
    [occasions[6], occasions[7]],
  ),
  studioProduct(
    roseLavenderGoldPetalDiyaHolders,
    "rose-lavender-gold-petal-diya-holders",
    "Rose and Lavender Gold-Edged Petal Diya Holders",
    "diya-holders",
    ["Rose", "Lavender", "Gold"],
    "Rose and lavender petals outlined in gold with pearl accents.",
    [occasions[6], occasions[7]],
  ),
];

export function withStudioCollection(cloudProducts: Product[]) {
  const collection = new Map(studioCollection.map((item) => [item.slug, item]));
  for (const item of cloudProducts) {
    if (item.is_demo) continue;
    const studioPhotos = collection.get(item.slug)?.images;
    collection.set(
      item.slug,
      item.images.length || !studioPhotos?.length ? item : { ...item, images: studioPhotos },
    );
  }
  return [...collection.values()];
}
