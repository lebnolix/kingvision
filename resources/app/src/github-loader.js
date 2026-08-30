/**
 * GitHub Config Loader
 * App ke liye configuration GitHub se load karta hai
 */

const fs = require('fs')
const path = require('path')

class GitHubConfigLoader {
  constructor(githubConfig) {
    this.config = githubConfig
    this.cache = new Map()
    this.cacheTTL = 5 * 60 * 1000 // 5 minutes
  }

  /**
   * Raw GitHub URL banata hai
   * @param {string} filePath - GitHub pe file path
   * @returns {string} - Raw GitHub URL
   */
  getRawUrl(filePath) {
    return `${this.config.github.base_url}${filePath}`
  }

  /**
   * GitHub se JSON file fetch karta hai
   * @param {string} fileKey - File key from config.files
   * @returns {Promise<Object>} - Fetched JSON data
   */
  async loadFromGitHub(fileKey) {
    try {
      // Check cache first
      if (this.cache.has(fileKey)) {
        const { data, timestamp } = this.cache.get(fileKey)
        if (Date.now() - timestamp < this.cacheTTL) {
          console.log(`[GitHub] Cache hit for ${fileKey}`)
          return data
        }
      }

      const filePath = this.config.files[fileKey]
      if (!filePath) {
        throw new Error(`Unknown file key: ${fileKey}`)
      }

      const url = this.getRawUrl(filePath)
      console.log(`[GitHub] Fetching ${fileKey} from: ${url}`)

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status} ${response.statusText}`)
      }

      const contentType = response.headers.get('content-type') || ''
      const text = await response.text()
      let data = text

      if (contentType.includes('application/json') || filePath.toLowerCase().endsWith('.json')) {
        try {
          data = JSON.parse(text)
        } catch (e) {
          data = text
        }
      }

      // Cache it
      this.cache.set(fileKey, { data, timestamp: Date.now() })
      console.log(`[GitHub] ✅ ${fileKey} loaded successfully`)

      return data
    } catch (error) {
      console.error(`[GitHub] ❌ Failed to load ${fileKey}:`, error.message)
      return null
    }
  }

  /**
   * Local fallback se file load karta hai (agar GitHub fail ho)
   * @param {string} localPath - Local file path
   * @returns {Object|null} - Loaded JSON or null
   */
  loadLocalFallback(localPath) {
    try {
      const fullPath = path.resolve(localPath)
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8')
        console.log(`[Local] Using fallback: ${fullPath}`)
        return JSON.parse(content)
      }
    } catch (error) {
      console.error(`[Local] Fallback failed:`, error.message)
    }
    return null
  }

  /**
   * GitHub se load karta hai, fail hote fallback use karta hai
   * @param {string} fileKey - File key
   * @param {string} localPath - Local fallback path
   * @returns {Promise<Object|null>}
   */
  async loadWithFallback(fileKey, localPath) {
    // Try GitHub first
    const githubData = await this.loadFromGitHub(fileKey)
    if (githubData) return githubData

    // Fallback to local
    console.log(`[GitHub] Falling back to local for ${fileKey}`)
    return this.loadLocalFallback(localPath)
  }

  /**
   * Cache clear karta hai
   */
  clearCache() {
    this.cache.clear()
    console.log('[GitHub] Cache cleared')
  }
}

module.exports = { GitHubConfigLoader }
