import { Link } from "./bloom-navigation";
import { ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import { colours, describeCustom, occasions, whatsapp, type Custom } from "@/lib/bloom";
import { sendEnquiry } from "@/lib/bloom-api";
import { trackBloomEvent } from "@/lib/bloom-analytics";
import { useBloom } from "./bloom-shell";
import { PageHeading, ProductImage, Swatches } from "./bloom-products";
import { ChenilleFlower } from "./bloom-story";

const initial: Custom = {
  flower: "rose",
  count: 5,
  colours: ["Blush", "Ivory"],
  size: "classic",
  wrap: "Ivory",
  ribbon: "Rose",
  occasion: "",
  message: "",
  packaging: false,
};
const titleCase = (name: string) => name.charAt(0).toUpperCase() + name.slice(1);
export function Customise({ embedded = false }: { embedded?: boolean } = {}) {
  const { settings } = useBloom();
  const [custom, setCustom] = useState(initial);
  const [step, setStep] = useState(0);
  const [pending, setPending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [enquire, setEnquire] = useState(false);
  const set = <K extends keyof Custom>(key: K, value: Custom[K]) =>
    setCustom((current) => ({ ...current, [key]: value }));

  const chat = whatsapp(
    settings["whatsapp"],
    "Hi! I would like to ask about this bouquet design. " + describeCustom(custom) + ".",
  );
  async function saveEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = new FormData(event.currentTarget);
    setError("");
    setPending(true);
    try {
      await sendEnquiry({
        data: {
          subject: "Custom bouquet design",
          message: describeCustom(custom),
          customer_name: String(form.get("name")),
          email: String(form.get("email")),
          phone: String(form.get("phone")),
        },
      });
      setSent(true);
      trackBloomEvent("generate_lead", { lead_type: "bouquet_design" });
    } catch {
      setError("We couldn’t save your request. Check your contact details and try again.");
    } finally {
      setPending(false);
    }
  }
  const Container = embedded ? "section" : "main";
  return (
    <Container
      id={embedded ? "customise" : undefined}
      className={embedded ? "wrap home-section" : "wrap inner-page"}
    >
      <PageHeading as={embedded ? "h2" : "h1"} label="Bespoke gifts" title="Create your own bloom.">
        Try different stems, colours and wrapping to preview a bouquet idea.
      </PageHeading>
      <div className="split-page builder-layout">
        <div className="panel">
          <p className="eyebrow">Step {step + 1} of 3</p>
          <progress value={step + 1} max={3} aria-label="Bouquet builder progress" />
          <h2>{["Choose the flowers", "Wrap it with care", "Make it personal"][step]}</h2>
          {step === 0 && (
            <div className="form-stack">
              <label>
                Flower type
                <select
                  value={custom.flower}
                  onChange={(event) => set("flower", event.target.value as Custom["flower"])}
                >
                  {(["rose", "daisy", "sunflower"] as const).map((value) => (
                    <option key={value} value={value}>
                      {titleCase(value)}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Number of stems <strong>{custom.count}</strong>
                <input
                  type="range"
                  min={1}
                  max={24}
                  value={custom.count}
                  onChange={(event) => set("count", Number(event.target.value))}
                />
              </label>
              <fieldset>
                <legend>Flower colours (choose up to four)</legend>
                <div className="choice-grid">
                  {(Object.keys(colours) as Custom["colours"]).map((value) => (
                    <button
                      key={value}
                      className="choice"
                      aria-pressed={custom.colours.includes(value)}
                      onClick={() => {
                        if (custom.colours.includes(value)) {
                          if (custom.colours.length > 1)
                            set(
                              "colours",
                              custom.colours.filter((colour) => colour !== value),
                            );
                        } else if (custom.colours.length < 4)
                          set("colours", [...custom.colours, value]);
                      }}
                    >
                      <span className="swatch" style={{ backgroundColor: colours[value] }} />
                      {value}
                    </button>
                  ))}
                </div>
              </fieldset>
            </div>
          )}
          {step === 1 && (
            <div className="form-stack">
              <label>
                Bouquet size
                <select
                  value={custom.size}
                  onChange={(event) => set("size", event.target.value as Custom["size"])}
                >
                  <option value="petite">Petite</option>
                  <option value="classic">Classic</option>
                  <option value="grand">Grand</option>
                </select>
              </label>
              <fieldset>
                <legend>Wrapping colour · {custom.wrap}</legend>
                <Swatches
                  values={["Ivory", "Blush", "Lavender", "Sage"]}
                  selected={custom.wrap}
                  onSelect={(value) => set("wrap", value as Custom["wrap"])}
                />
              </fieldset>
              <fieldset>
                <legend>Ribbon colour · {custom.ribbon}</legend>
                <Swatches
                  values={["Ivory", "Rose", "Gold", "Plum"]}
                  selected={custom.ribbon}
                  onSelect={(value) => set("ribbon", value as Custom["ribbon"])}
                />
              </fieldset>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={custom.packaging}
                  onChange={(event) => set("packaging", event.target.checked)}
                />{" "}
                Include a gift box
              </label>
            </div>
          )}
          {step === 2 && (
            <div className="form-stack">
              <label>
                Occasion
                <select
                  value={custom.occasion}
                  onChange={(event) => set("occasion", event.target.value)}
                >
                  <option value="">Choose an occasion</option>
                  {occasions.map((value) => (
                    <option key={value}>{value}</option>
                  ))}
                </select>
              </label>
              <label>
                Message for your gift
                <textarea
                  maxLength={500}
                  rows={3}
                  value={custom.message}
                  onChange={(event) => set("message", event.target.value)}
                  placeholder="A little note for someone special…"
                />
              </label>
            </div>
          )}
          <div className="button-row builder-buttons">
            {step > 0 && (
              <button className="btn btn-outline" onClick={() => setStep(step - 1)}>
                Back
              </button>
            )}
            {step < 2 ? (
              <button className="btn btn-primary" onClick={() => setStep(step + 1)}>
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <>
                {chat && (
                  <a
                    className="btn btn-outline"
                    href={chat}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => trackBloomEvent("contact_click", { contact_method: "whatsapp" })}
                  >
                    Ask on WhatsApp
                  </a>
                )}
                <button
                  className="text-link"
                  aria-expanded={enquire}
                  onClick={() => setEnquire(!enquire)}
                >
                  Ask about this design
                </button>
              </>
            )}
          </div>
          {step === 2 &&
            enquire &&
            (sent ? (
              <p role="status">Your design enquiry has been sent.</p>
            ) : (
              <form onSubmit={saveEnquiry} className="form-stack section-space">
                <ContactFields />
                {error && (
                  <p className="error-note" role="alert">
                    {error}
                  </p>
                )}
                <button className="btn btn-primary" disabled={pending}>
                  {pending ? "Sending…" : "Send design enquiry"}
                </button>
              </form>
            ))}
        </div>
        <aside className="panel builder-preview">
          <div className="preview-art" style={{ backgroundColor: colours[custom.wrap] }}>
            <div className={"preview-flowers preview-" + custom.size}>
              {Array.from({ length: Math.min(7, custom.count) }, (_, index) => (
                <div
                  key={index}
                  style={
                    {
                      "--angle": (index - (Math.min(7, custom.count) - 1) / 2) * 13 + "deg",
                    } as React.CSSProperties
                  }
                >
                  <ChenilleFlower
                    hue={colours[custom.colours[index % custom.colours.length] ?? "Blush"]}
                  />
                </div>
              ))}
            </div>
            <div className="preview-wrap" style={{ backgroundColor: colours[custom.wrap] }} />
            <div className="preview-ribbon" style={{ backgroundColor: colours[custom.ribbon] }} />
          </div>
          <p className="eyebrow">Bouquet illustration</p>
          <p>
            {custom.count} {titleCase(custom.flower)} {custom.count === 1 ? "stem" : "stems"} ·{" "}
            {titleCase(custom.size)}
          </p>
        </aside>
      </div>
    </Container>
  );
}
function ContactFields() {
  return (
    <>
      <label>
        Full name
        <input name="name" required minLength={2} maxLength={120} autoComplete="name" />
      </label>
      <label>
        Email
        <input name="email" type="email" required maxLength={254} autoComplete="email" />
      </label>
      <label>
        Phone
        <input name="phone" type="tel" required minLength={7} maxLength={26} autoComplete="tel" />
      </label>
    </>
  );
}
