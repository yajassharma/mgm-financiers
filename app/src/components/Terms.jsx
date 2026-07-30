import SEO from './SEO'
import LegalPage from './LegalPage'
function Section({ title, children }) {
  return (
    <div className="mb-10">
      <h2 className="text-xl font-bold text-mgm-dark font-heading tracking-tight mb-4">{title}</h2>
      <div className="text-mgm-dark/50 font-body text-[14.5px] leading-[1.85] space-y-4">
        {children}
      </div>
    </div>
  )
}

export default function TermsConditions() {
return (
    <>
    <SEO
      title="Terms & Conditions | MGM Financiers"
      description="Read MGM Financiers' Terms and Conditions governing our loan products and services. Understand your rights and obligations as a valued customer."
      canonical="/terms-conditions"
    />
    <LegalPage title={'Terms & Conditions'} lastUpdated="January 1, 2024">
      <Section title="Introduction">
        <p>The terms "We" / "Us" / "Our" / "Company" individually and collectively refer to MGM Financiers Pvt. Ltd. and the terms "Visitor" / "User" refer to the users.</p>
        <p>This page states the Terms and Conditions under which you (Visitor) may visit this website ("Website"). Please read this page carefully. If you do not accept the Terms and Conditions stated here, we would request you to exit this site. The business, any of its business divisions and / or its subsidiaries, associate companies or subsidiaries to subsidiaries or such other investment companies (in India or abroad) reserve their respective rights to revise these Terms and Conditions at any time by updating this posting. You should visit this page periodically to re-appraise yourself of the Terms and Conditions, because they are binding on all users of this Website.</p>
      </Section>

      <Section title="Use of Content">
        <p>All logos, brands, marks, headings, labels, names, signatures, numerals, shapes or any combinations thereof, appearing in this site, except as otherwise noted, are properties either owned, or used under license, by the business and / or its associate entities who feature on this Website. The use of these properties or any other content on this site, except as provided in these terms and conditions or in the site content, is strictly prohibited.</p>
        <p>You may not sell or modify the content of this Website or reproduce, display, publicly perform, distribute, or otherwise use the materials in any way for any public or commercial purpose without the respective organization's or entity's written permission.</p>
      </Section>

      <Section title="Acceptable Website Use">
        <p className="font-semibold text-mgm-dark/70">(A) Security Rules</p>
        <p>Visitors are prohibited from violating or attempting to violate the security of the Web site, including, without limitation:</p>
        <ol className="list-decimal ml-5 space-y-2 mt-2">
          <li>Accessing data not intended for such user or logging into a server or account which the user is not authorised to access</li>
          <li>Attempting to probe, scan or test the vulnerability of a system or network or to breach security or authentication measures without proper authorisation</li>
          <li>Attempting to interfere with service to any user, host or network, including, without limitation, via means of submitting a virus or "Trojan horse" to the Website, overloading, "flooding", "mail bombing" or "crashing"</li>
          <li>Sending unsolicited electronic mail, including promotions and/or advertising of products or services</li>
        </ol>
        <p>Violations of system or network security may result in civil or criminal liability. The business and / or its associate entities will have the right to investigate occurrences that they suspect as involving such violations and will have the right to involve, and cooperate with, law enforcement authorities in prosecuting users who are involved in such violations.</p>

        <p className="font-semibold text-mgm-dark/70 mt-6">(B) General Rules</p>
        <p>Visitors may not use the Web Site in order to transmit, distribute, store or destroy material:</p>
        <ol className="list-decimal ml-5 space-y-2 mt-2">
          <li>That could constitute or encourage conduct that would be considered a criminal offence or violate any applicable law or regulation</li>
          <li>In a manner that will infringe the copyright, trademark, trade secret or other intellectual property rights of others or violate the privacy or publicity of other personal rights of others</li>
          <li>That is libellous, defamatory, pornographic, profane, obscene, threatening, abusive or hateful</li>
        </ol>
      </Section>

      <Section title="Indemnity">
        <p>The User unilaterally agree to indemnify and hold harmless, without objection, the Company, its officers, directors, employees and agents from and against any claims, actions and/or demands and/or liabilities and/or losses and/or damages whatsoever arising from or resulting from their use of mgmfinanciers.com or their breach of the terms.</p>
      </Section>

      <Section title="Refund Policy">
        <p>For any issues relating to refund, the customer may contact MGM within 15 days of date of transaction, beyond which period request would not be processed. Refund processing is subject to approval and the decision made by the company is final.</p>
        <p>If after consideration of facts it is concluded that the cancellation is due to the factors for which we are solely responsible, then 50% of the refundable amount will be reimbursed to the client.</p>
      </Section>

      <Section title="Cancellation Policy">
        <p>A deal confirmation for a personal loan states that the borrower has surpassed all the verification steps required for loan approval.</p>
        <p>After approval, if the borrower changes their mind about the loan and want to cancel the application they may be charged a loan cancellation fee. However, a personal loan cancellation is only possible BEFORE the amount is disbursed in the borrower's bank account. Once the loan amount is credited, it is not possible to reverse or cancel the personal loan application.</p>
        <p>Our overall loan process follows the order , loan application, approval, deal confirmation and disbursement. So, if the borrower feels the need for personal loan cancellation, the decision needs to be communicated to the company before deal confirmation and disbursement of money.</p>
        <p>In the event of personal loan cancellation, cancellation charges are to be borne by the borrower.</p>
        <p>After the loan amount has been disbursed from our end, the direct cancellation process is null and void. After that, if the borrower wishes to terminate the loan, the charges and interest amount due will follow the agreed upon terms and conditions of foreclosure.</p>
      </Section>

      <Section title="Liability">
        <p>User agrees that neither Company nor its group companies, directors, officers or employee shall be liable for any direct or/and indirect or/and incidental or/and special or/and consequential or/and exemplary damages, resulting from the use or/and the inability to use the service or/and for cost of procurement of substitute goods or/and services or resulting from any goods or/and data or/and information or/and services purchased or/and obtained or/and messages received or/and transactions entered into through or/and from the service or/and resulting from unauthorized access to or/and alteration of user's transmissions or/and data or/and arising from any other matter relating to the service, including but not limited to, damages for loss of profits or/and use or/and data or other intangible, even if Company has been advised of the possibility of such damages.</p>
        <p>User further agrees that Company shall not be liable for any damages arising from interruption, suspension or termination of service, including but not limited to direct or/and indirect or/and incidental or/and special consequential or/and exemplary damages, whether such interruption or/and suspension or/and termination was justified or not, negligent or intentional, inadvertent or advertent.</p>
        <p>User agrees that Company shall not be responsible or liable to user, or anyone, for the statements or conduct of any third party of the service. In sum, in no event shall Company's total liability to the User for all damages or/and losses or/and causes of action exceed the amount paid by the User to Company, if any, that is related to the cause of action.</p>
      </Section>

      <Section title="Disclaimer of Consequential Damages">
        <p>In no event shall Company or any parties, organizations or entities associated with the corporate brand name us or otherwise, mentioned at this Website be liable for any damages whatsoever (including, without limitations, incidental and consequential damages, lost profits, or damage to computer hardware or loss of data information or business interruption) resulting from the use or inability to use the Website and the Website material, whether based on warranty, contract, tort, or any other legal theory, and whether or not, such organization or entities were advised of the possibility of such damages.</p>
      </Section>
    </LegalPage>
    </>
  )
}
