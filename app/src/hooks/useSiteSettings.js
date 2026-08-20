import { useState, useEffect } from 'react'

const DEFAULTS = {
  bankNames: ['Kotak Mahindra Bank', 'Union Bank of India'],
  stats: {
    yearsOfLending: 28,
    customersServed: 3000,
    employees: 50,
    operationalLocations: 35,
    loansDisbursedCr: 25,
  },
  milestones: [
    { year: '1996', title: 'Foundation', desc: 'Established with a vision to make financial assistance accessible and honest.' },
    { year: '2005', title: 'Customer Growth', desc: 'Thousands of families and entrepreneurs trust us with their financial futures.' },
    { year: '2012', title: 'Regional Expansion', desc: 'Extended our reach across Punjab, Rajasthan, Haryana and Maharashtra.' },
    { year: '2013', title: 'Navi Mumbai Expansion', desc: 'Expanded operations to Navi Mumbai, strengthening our Maharashtra presence.' },
    { year: '2018', title: 'Branch Network', desc: 'Built a network of offices to serve customers with local, personal attention.' },
    { year: '2022', title: 'Digital Transformation', desc: 'Embraced technology to make processes faster while keeping the human touch.' },
    { year: '2025', title: 'Sri Ganganagar', desc: 'Expanded to Sri Ganganagar, Rajasthan.' },
    { year: '2026', title: 'Multi-City Expansion', desc: 'Expanded to Jaipur, Kota and Jhalawar in Rajasthan, and Gurugram in Haryana.' },
    { year: 'Today', title: 'Trusted Institution', desc: '3,000+ customers, 50+ employees, and a legacy built on relationships.' },
  ],
  rbiWording: 'RBI-registered NBFC',
  companyTagline: 'A premier financial institution based in Ludhiana with 28+ years of excellence in serving the nation',
  heroTitle: 'Building Trust, Delivering Growth',
}

let cached = null
let fetching = null

export default function useSiteSettings() {
  const [settings, setSettings] = useState(cached || DEFAULTS)
  const [loading, setLoading] = useState(!cached)

  useEffect(() => {
    if (cached) {
      setSettings(cached)
      setLoading(false)
      return
    }

    if (!fetching) {
      fetching = fetch('/api/site-settings')
        .then(r => r.json())
        .then(json => {
          if (json.status === 'success' && json.data) {
            cached = json.data
            setSettings(json.data)
          }
        })
        .catch(() => {})
        .finally(() => {
          setLoading(false)
          fetching = null
        })
    }
  }, [])

  return { settings, loading }
}
