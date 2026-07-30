import { Helmet } from 'react-helmet-async'

const SITE_URL = 'https://mgmfinanciers.com'

export default function SEO({
  title = 'MGM Financiers | Personal Loan, Vehicle Loan, Gold Loan | Ludhiana, Punjab',
  description = 'MGM Financiers is a premier financial institution in Ludhiana, Punjab with 28+ years of excellence. We offer Personal Loan, Vehicle Loan, Gold Loan, Loan Against Property, Construction Loan, and Consumer Durable Loan at competitive interest rates.',
  canonical = '/',
  ogImage = '/og-image.png',
  type = 'website',
}) {
  const fullUrl = `${SITE_URL}${canonical}`
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:site_name" content="MGM Financiers" />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
    </Helmet>
  )
}
