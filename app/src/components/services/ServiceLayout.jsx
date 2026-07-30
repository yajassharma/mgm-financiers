import SEO from '../SEO'
import Header from '../Header'
import Footer from '../Footer'
import ServiceHero from './ServiceHero'
import FeatureHighlights from './FeatureHighlights'
import ProcessTimeline from './ProcessTimeline'
import Eligibility from './Eligibility'
import FAQ from './FAQ'
import RelatedServices from './RelatedServices'
import ServiceCTA from './ServiceCTA'

export default function ServiceLayout({ service }) {
  return (
    <div className="min-h-screen bg-white">
      <SEO
        title={`${service.name} | Apply Online | MGM Financiers`}
        description={`${service.shortDesc}. Apply for ${service.name} at MGM Financiers with competitive interest rates and quick approval. Check eligibility and apply now.`}
        canonical={`/services/${service.id}`}
      />
      <Header />
      <main>
        <ServiceHero service={service} />
        <FeatureHighlights service={service} />
        <ProcessTimeline service={service} />
        <Eligibility service={service} eligibility={service.eligibility} />
        <FAQ questions={service.faqs} />
        <RelatedServices service={service} />
        <ServiceCTA service={service} />
      </main>
      <Footer />
    </div>
  )
}
