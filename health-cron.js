const http = require('http')
const https = require('https')
const { URL } = require('url')

function pingUrl(targetUrl) {
  try {
    const parsed = new URL(targetUrl)
    const lib = parsed.protocol === 'https:' ? https : http

    const req = lib.get(parsed, (res) => {
      const { statusCode } = res
      let body = ''
      res.on('data', (chunk) => (body += chunk))
      res.on('end', () => {
        console.log(`[health-cron] ping ${targetUrl} -> ${statusCode}`)
      })
    })

    req.on('error', (err) => {
      console.error(`[health-cron] request error when pinging ${targetUrl}:`, err.message)
    })

    req.setTimeout(10000, () => {
      console.error(`[health-cron] request timeout when pinging ${targetUrl}`)
      req.abort()
    })
  } catch (err) {
    console.error('[health-cron] invalid URL', targetUrl, err.message)
  }
}

function startHealthCron(options = {}) {
  const intervalMs = options.intervalMs || (14 * 60 * 1000) // 14 minutes
  const url = options.url || process.env.HEALTH_PING_URL

  if (!url) {
    console.warn('[health-cron] no URL configured (pass options.url or set HEALTH_PING_URL). Skipping health pings.')
    return {
      stop: () => {},
    }
  }

  console.log(`[health-cron] starting health ping for ${url} every ${Math.round(intervalMs / 60000)} minutes`)

  // immediate ping
  pingUrl(url)

  const timer = setInterval(() => pingUrl(url), intervalMs)

  return {
    stop: () => clearInterval(timer),
  }
}

module.exports = startHealthCron
