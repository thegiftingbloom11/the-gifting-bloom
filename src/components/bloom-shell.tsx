import { Link } from "./bloom-navigation";
import { useLocation } from "react-router";
import {
  ArrowUpRight,
  Instagram,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Search,
} from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Toaster } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  bouquetBuilderEnabled,
  businessAddress,
  businessEmail,
  businessWhatsAppNumber,
  instagram,
  whatsapp,
} from "@/lib/bloom";
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
  ...(bouquetBuilderEnabled ? ([["customise", "Customise"]] as const) : []),
  ["our-story", "Our Story"],
  ["instagram", "Instagram"],
  ["contact", "Contact"],
] as const;
const activeSection = { exact: true, includeHash: true, includeSearch: false };

export function WhatsAppIcon() {
  return (
    <span className="whatsapp-mark" aria-hidden="true">
      <MessageCircle size={30} strokeWidth={1.8} />
      <Phone size={13} strokeWidth={2.4} />
    </span>
  );
}

export function BloomShell({
  store,
  refreshStore,
  children,
}: {
  store: StoreData;
  refreshStore: () => Promise<void>;
  children: ReactNode;
}) {
  const path = useLocation().pathname.replace(/\/+$/, "") || "/";
  const [menu, setMenu] = useState(false);
  const brand = store.settings["brand_name"] || "The Gifting Bloom";
  const social = store.settings["instagram"] || instagram;
  const address = store.settings["contact_address"]?.trim() || businessAddress;
  const email = store.settings["contact_email"]?.trim() || businessEmail;
  const chat = whatsapp(businessWhatsAppNumber, "Hi " + brand + "! I'd like to ask about a gift.");

  return (
    <StoreContext.Provider value={{ ...store, refreshStore }}>
      <Toaster position="bottom-center" />
      {path !== "/" && path !== "/privacy-policy" && !path.startsWith("/admin") && (
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
                        to={hash === "contact" ? "/contact" : "/"}
                        hash={hash === "contact" ? undefined : hash}
                        search={hash === "collection" || hash === "contact" ? undefined : true}
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
                  to={hash === "contact" ? "/contact" : "/"}
                  hash={hash === "contact" ? undefined : hash}
                  search={hash === "collection" || hash === "contact" ? undefined : true}
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
              <div className="footer-brand">
                <Link to="/" className="wordmark">
                  <BloomLogo src={store.settings["logo"]} />
                  <span>{brand}</span>
                </Link>
                <p>{store.settings["tagline"] || "Handmade with love. Gifted with feelings."}</p>
                <a className="text-link" href={social} target="_blank" rel="noreferrer">
                  <Instagram size={17} /> Instagram <ArrowUpRight size={14} />
                </a>
              </div>
              <div className="footer-contact">
                <h2>
                  <MapPin size={17} aria-hidden="true" /> Address
                </h2>
                <address className="preserve-lines">{address}</address>
              </div>
              <div className="footer-contact">
                <h2>
                  <Phone size={17} aria-hidden="true" /> Contact number
                </h2>
                <a href={`tel:+${businessWhatsAppNumber}`}>+91 87679 80311</a>
              </div>
              <div className="footer-contact">
                <h2>
                  <Mail size={17} aria-hidden="true" /> Email
                </h2>
                <a href={`mailto:${email}`}>{email}</a>
              </div>
            </div>
            <div className="wrap footer-bottom">
              <p>
                Copyright 2026 <Link to="/">The Gifting Bloom</Link>. All rights reserved.
              </p>
            </div>
          </footer>
          {chat && (
            <a
              className="floating-chat"
              href={chat}
              aria-label="Chat on WhatsApp"
              title="Chat on WhatsApp"
              target="_blank"
              rel="noreferrer"
            >
              <WhatsAppIcon />
            </a>
          )}
        </>
      )}
    </StoreContext.Provider>
  );
}
