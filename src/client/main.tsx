import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App.js";
import { PhoneToolPage } from "./PhoneTool.js";
import "./styles.css";

const pathname = window.location.pathname;
const aliasMatch = pathname.match(/^\/phonetool\/([a-z0-9-]+)$/);

let page;
if (pathname === "/path") {
  page = <App />;
} else if (aliasMatch) {
  page = <PhoneToolPage alias={aliasMatch[1]} />;
} else {
  // Everything else (including /) is Jane's Phone Tool page.
  window.history.replaceState(null, "", "/phonetool/jdoe");
  page = <PhoneToolPage alias="jdoe" />;
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>{page}</StrictMode>
);
