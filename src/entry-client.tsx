import "@vitejs/plugin-react/preamble";
import "./styles.css";
import { hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { App } from "./app";
import { BloomDocument, type BloomDocumentData } from "./bloom-document";
import { reportLovableError } from "./lib/lovable-error-reporting";

const initial = document.getElementById("bloom-data");
if (!initial?.textContent) throw new Error("The page did not include its initial catalogue.");
const data = JSON.parse(initial.textContent) as BloomDocumentData;

hydrateRoot(
  document,
  <BloomDocument data={data}>
    <BrowserRouter>
      <App initialStore={data.store} requestOrigin={data.requestOrigin} />
    </BrowserRouter>
  </BloomDocument>,
  {
    onRecoverableError: (error) => {
      if (import.meta.env.DEV) console.error(error);
      reportLovableError(error, { phase: "hydration" });
    },
    onUncaughtError: (error) => {
      console.error(error);
      reportLovableError(error, { phase: "render" });
    },
  },
);
