import { CheckIcon, XIcon } from "./icons";

const beforeItems = [
  "Email threads nobody can find later",
  '"I thought that was included"',
  "Manual invoices assembled from memory",
  "Work completed before scope was agreed",
  "Clients pay less than quoted",
];

const afterItems = [
  "Every item explicitly approved or rejected",
  "Signed record of what was agreed",
  "Invoice writes itself from approved items",
  "Work starts only after sign-off",
  "No surprises, no disputes",
];

export function ProblemSection() {
  return (
    <section id="problem">
      <div className="section-label reveal">The problem</div>
      <h2 className="section-title reveal">
        Scope creep costs freelancers
        <br />
        thousands every year.
      </h2>
      <p className="section-sub reveal">It&apos;s not that clients are bad. It&apos;s that there&apos;s no clear record of what was agreed.</p>

      <div className="problem-grid reveal">
        <div className="problem-card before">
          <span className="problem-tag before">Before Worklit</span>
          <div className="problem-card-title">The old way</div>
          <div className="problem-items">
            {beforeItems.map((item) => (
              <div key={item} className="problem-item">
                <span className="problem-item-icon">
                  <XIcon size={14} color="var(--text-soft)" />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="problem-card after">
          <span className="problem-tag after">After Worklit</span>
          <div className="problem-card-title">The Worklit way</div>
          <div className="problem-items">
            {afterItems.map((item) => (
              <div key={item} className="problem-item">
                <span className="problem-item-icon">
                  <CheckIcon size={14} color="var(--green)" />
                </span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
