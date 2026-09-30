import SEO from './SEO'
import LegalPage from './LegalPage'

function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-mgm-dark font-heading tracking-tight mb-4">{title}</h2>
      <div className="text-mgm-dark/70 font-body text-[14.5px] leading-[1.85] space-y-4">
        {children}
      </div>
    </div>
  )
}

function BulletList({ items }) {
  return (
    <ul className="space-y-2.5 ml-1">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-mgm-gold/40 mt-2" aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function AccessibilityStatement() {
  return (
    <>
      <SEO
        title="Accessibility Statement | MGM Financiers"
        description="MGM Financiers' commitment to web accessibility. This site conforms to WCAG 2.1 Level AA and IS 17802 (Part 1):2021 for an inclusive browsing experience."
        canonical="/accessibility"
      />
      <LegalPage title={'Accessibility Statement'} lastUpdated="October 1, 2026">
        <Section title="Our Commitment">
          <p>
            MGM Financiers Pvt. Ltd. is committed to ensuring digital accessibility for all users,
            including people with disabilities. We strive to make this website usable by everyone,
            regardless of the technology used or ability.
          </p>
        </Section>

        <Section title="Conformance Status">
          <p>
            This website is designed to conform to the <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong>{' '}
            and to the requirements of <strong>IS 17802 (Part 1):2021 — Accessibility for ICT Products and Services</strong>,
            as referenced by the Bureau of Indian Standards.
          </p>
          <p>
            WCAG 2.1 Level AA explains how to make web content more accessible to people with a wide
            array of disabilities, including visual, auditory, physical, speech, cognitive, language,
            learning, and neurological disabilities. Conformance means that people with disabilities
            will be able to perceive, understand, navigate, and interact with this website.
          </p>
        </Section>

        <Section title="Measures We Take">
          <BulletList items={[
            'Semantic HTML with properly nested headings, landmarks (header, nav, main, footer), and a skip-to-content link.',
            'All meaningful images and icons carry alternative text or are marked as decorative.',
            'Text and interactive elements meet required colour contrast ratios (at least 4.5:1 for normal text and 3:1 for large text and UI components).',
            'Every form field has a programmatic label, and errors are announced to screen readers with clear, text-based messages — status is never conveyed by colour alone.',
            'All functionality is operable by keyboard alone (Tab, Shift+Tab, Enter, Space, Escape), including menus, accordions, modals, and the loan application flow.',
            'Dialogs and drawers trap focus while open, close with the Escape key, and return focus to the element that opened them.',
            'Focus is always visible with a high-contrast outline.',
            'The layout reflows without horizontal scrolling at 320px width and remains usable at 200% browser zoom.',
            'Animations respect the operating system\u2019s "reduce motion" preference.',
            'Interface elements and states are identifiable without relying on colour alone.',
          ]} />
        </Section>

        <Section title="Compatibility">
          <p>
            This website is tested to work with current versions of Google Chrome, Mozilla Firefox,
            Microsoft Edge, and Apple Safari, on desktop and mobile devices, at screen widths from
            320px to 1440px and beyond.
          </p>
        </Section>

        <Section title="Known Limitations">
          <p>
            Some downloadable documents (PDF forms and notices) may not yet be fully tagged for screen
            readers. Where a document is not fully accessible, an equivalent accessible alternative is
            available on request. We are working to remediate these documents on an ongoing basis.
          </p>
        </Section>

        <Section title="Feedback and Contact Information">
          <p>
            If you encounter an accessibility barrier on this website, or need assistance with any
            service, please contact us. We treat accessibility feedback with the same urgency as any
            other service concern.
          </p>
          <ul className="space-y-2">
            <li>
              Email:{' '}
              <a href="mailto:customer.redressal@mgmfinanciers.com" className="text-mgm-gold-text font-medium underline underline-offset-2 hover:text-mgm-dark transition-colors">
                customer.redressal@mgmfinanciers.com
              </a>
            </li>
            <li>Phone: 0161-5047087, +91 97803 00161</li>
            <li>
              Online grievance form:{' '}
              <a href="/grievance" className="text-mgm-gold-text font-medium underline underline-offset-2 hover:text-mgm-dark transition-colors">
                Grievance Redressal
              </a>
            </li>
          </ul>
          <p>
            We aim to acknowledge accessibility feedback within 48 working hours and to resolve
            issues within a reasonable timeframe.
          </p>
        </Section>
      </LegalPage>
    </>
  )
}
