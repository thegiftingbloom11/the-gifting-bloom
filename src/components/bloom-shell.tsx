import { Link } from "./bloom-navigation";
import { useLocation } from "react-router";
import { ArrowUpRight, Instagram, Menu, MessageCircle, Search } from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { instagram, whatsapp } from "@/lib/bloom";
import type { StoreData } from "@/lib/bloom-api";
import { BloomLogo } from "./bloom-logo";

const StoreContext = createContext<(StoreData & { refreshStore: () => Promise<void> }) | null>(
  null,
);
export function useBloom() {
  const store = useContext(StoreContext);
  if (!store) throw new Error("Store context is missing");
  return store;
}

const links = [
  ["home", "Home"],
  ["collection", "Gallery"],
  ["customise", "Customise"],
  ["our-story", "Our Story"],
  ["instagram", "Instagram"],
  ["contact", "Contact"],
] as const;
const activeSection = { exact: true, includeHash: true, includeSearch: false };
export function BloomShell({
  store,
  refreshStore,
  children,
}: {
  store: StoreData;
  refreshStore: () => Promise<void>;
  children: ReactNode;
}) {
  const path = useLocation().pathname;
  const [menu, setMenu] = useState(false);
  const brand = store.settings["brand_name"] || "The Gifting Bloom";
  const social = store.settings["instagram"] || instagram;
  const chat = whatsapp(
    store.settings["whatsapp"],
    "Hi " + brand + "! I'd like to ask about a gift.",
  );

  return (
    <StoreContext.Provider value={{ ...store, refreshStore }}>
      <Toaster position="bottom-center" />
      {path !== "/" && !path.startsWith("/admin") && (
        <header className="bloom-nav bloom-nav-solid">
          <div className="nav-inner">
            <Dialog open={menu} onOpenChange={setMenu}>
              <DialogTrigger asChild>
                <button className="icon-button mobile-menu" aria-label="Open menu">
                  <Menu size={22} />
                </button>
              </DialogTrigger>
              <DialogContent className="bloom-dialog mobile-menu-panel">
                <DialogTitle>Explore the site</DialogTitle>
                <nav aria-label="Mobile navigation">
                  {[...links, ["gift-finder", "Gift Finder"]].map(([hash, name]) => (
                    <DialogClose asChild key={hash}>
                      <Link
                        to="/"
                        hash={hash}
                        search={hash === "collection" ? {} : true}
                        activeOptions={activeSection}
                      >
                        {name}
                        <ArrowUpRight size={17} />
                      </Link>
                    </DialogClose>
                  ))}
                </nav>
              </DialogContent>
            </Dialog>
            <Link to="/" className="wordmark" aria-label={brand + " home"}>
              <BloomLogo src={store.settings["logo"]} />
              <span>{brand}</span>
            </Link>
            <nav className="desktop-menu" aria-label="Main navigation">
              {links.map(([hash, name]) => (
                <Link
                  key={hash}
                  to="/"
                  hash={hash}
                  search={hash === "collection" ? {} : true}
                  activeOptions={activeSection}
                >
                  {name}
                </Link>
              ))}
            </nav>
            <div className="nav-actions">
              <Link
                to="/"
                hash="gift-finder"
                aria-label="Find a gift"
                className="icon-button nav-search"
              >
                <Search size={20} />
              </Link>
            </div>
          </div>
        </header>
      )}
      {children}
      {!path.startsWith("/admin") && (
        <>
          <footer className="bloom-footer">
            <div className="wrap footer-grid">
              <div>
                <Link to="/" className="wordmark">
                  <BloomLogo src={store.settings["logo"]} />
                  <span>{brand}</span>
                </Link>
                <p>{store.settings["tagline"] || "Handmade with love. Gifted with feelings."}</p>
                <a className="text-link" href={social} target="_blank" rel="noreferrer">
                  <Instagram size={17} /> Instagram <ArrowUpRight size={14} />
                </a>
              </div>
              <div>
                <h2>Discover</h2>
                <Link to="/" hash="collection" search={{}}>
                  View the gallery
                </Link>
                <Link to="/" hash="collection" search={{ category: "mini-gifts" }}>
                  Mini gifts
                </Link>
                <Link to="/" hash="gift-finder">
                  Gift finder
                </Link>
                <Link to="/" hash="instagram">
                  Bloom Diaries
                </Link>
              </div>
              <div>
                <h2>Get in touch</h2>
                <Link to="/" hash="contact">
                  Contact & FAQs
                </Link>
              </div>
              <div>
                <h2>Information</h2>
                <Link to="/privacy-policy">Privacy</Link>
                <Link to="/terms-conditions">Terms & conditions</Link>
                <Link to="/admin/login">Owner sign-in</Link>
              </div>
            </div>
            <div className="wrap footer-bottom">
              © {new Date().getFullYear()} {brand}
              <span>Made by hand, gifted by heart.</span>
            </div>
          </footer>
          {chat && (
            <a
              className="floating-chat"
              href={chat}
              aria-label="Chat on WhatsApp"
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle size={23} />
            </a>
          )}
        </>
      )}
    </StoreContext.Provider>
  );
}
