export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  // Configuration Kirby
  const KIRBY_URL = process.env.KIRBY_URL || 'http://localhost:8000'
  const KIRBY_USERNAME = process.env.API_AUTH_EMAIL || 'admin'
  const KIRBY_PASSWORD = process.env.API_AUTH_PASSWORD || 'password'
  
  // Debug - affichage des variables d'environnement
  console.log('=== DEBUG API ROUTE ===')
  console.log('KIRBY_URL:', KIRBY_URL)
  console.log('KIRBY_USERNAME:', KIRBY_USERNAME) 
  console.log('KIRBY_PASSWORD:', KIRBY_PASSWORD?.slice(0, 3) + '...')
  console.log('Request body:', JSON.stringify(body, null, 2))
  
  try {
    // Authentification basique
    const auth = Buffer.from(`${KIRBY_USERNAME}:${KIRBY_PASSWORD}`).toString('base64')
    console.log('Auth header:', `Basic ${auth.slice(0, 10)}...`)
    
    const fetchUrl = `${KIRBY_URL}/api/query`
    console.log('Fetching URL:', fetchUrl)
    
    const response = await fetch(fetchUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Basic ${auth}`
      },
      body: JSON.stringify(body)
    })
    
    console.log('Response status:', response.status)
    console.log('Response headers:', Object.fromEntries(response.headers.entries()))
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Response error body:', errorText)
      throw new Error(`Erreur Kirby: ${response.status} ${response.statusText} - ${errorText}`)
    }
    
    const data = await response.json()
    console.log('Response data:', JSON.stringify(data, null, 2))
    console.log('=== END DEBUG ===')
    return data
    
  } catch (error) {
    console.error('Erreur API Kirby:', error)
    throw createError({
      statusCode: 500,
      statusMessage: `Erreur de connexion au CMS: ${error.message}`
    })
  }
})