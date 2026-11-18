import { Button } from "../components/primitives";
import { Quantity } from "../components/StoreComponents";

export function StyleGuide() {
  return (
    <main className="container style-page">
      <div className="page-intro">
        <p className="eyebrow">Bookish system</p>
        <h1>Style guide</h1>
        <p>A warm, literary visual language built for thoughtful browsing.</p>
      </div>
      <section>
        <h2>Colour palette</h2>
        <div className="swatches">
          {[
            ["Burgundy", "#6B1E2E"],
            ["Gold", "#C9A24B"],
            ["Paper", "#F7F1E3"],
            ["Parchment", "#EADFC8"],
            ["Ink", "#2A1B1F"],
            ["Sage", "#7A8B6F"],
          ].map(([n, c]) => (
            <div key={n}>
              <i style={{ background: c }} />
              <b>{n}</b>
              <small>{c}</small>
            </div>
          ))}
        </div>
      </section>
      <section>
        <h2>Typography</h2>
        <div className="type-samples">
          <div>
            <small>Display · Playfair Display</small>
            <h1>Stories worth keeping.</h1>
          </div>
          <div>
            <small>Editorial · Lora</small>
            <h3>A beautiful book is a place to return to.</h3>
          </div>
          <div>
            <small>Interface · Inter</small>
            <p>Clear, warm, and quietly useful for every reader.</p>
          </div>
        </div>
      </section>
      <section>
        <h2>Components</h2>
        <div className="component-row">
          <Button>Primary button</Button>
          <Button variant="secondary">Secondary button</Button>
          <Button variant="ghost">Ghost button</Button>
          <span className="tag">Fiction</span>
          <Quantity value={1} onChange={() => {}} />
        </div>
        <div className="input-showcase">
          <label className="field">
            <span>Default input</span>
            <input placeholder="Your name" />
          </label>
          <label className="field success">
            <span>Success state</span>
            <input value="hello@bookish.co" readOnly />
            <small>Lovely, you’re all set.</small>
          </label>
          <label className="field invalid">
            <span>Error state</span>
            <input value="Not an email" readOnly />
            <small className="error-msg">Please enter a valid email.</small>
          </label>
        </div>
      </section>
    </main>
  );
}
