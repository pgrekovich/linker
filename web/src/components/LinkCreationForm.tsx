import React, { useState } from 'react'
import { useCookies } from 'react-cookie'

const LinkCreationForm = () => {
  const [cookies] = useCookies(['token'])

  const [originalUrl, setOriginalUrl] = useState('')
  const [customShortenedUrl, setcustomShortenedUrl] = useState('')
  const [generatedLink, setGeneratedLink] = useState('')

  const base = window.location.origin

  const createShortLink = async (
    originalUrl: string,
    customShortenedUrl?: string
  ) => {
    try {
      const response = await fetch('/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': cookies.token
        },
        body: JSON.stringify({ originalUrl, customShortenedUrl })
      })

      const data = await response.json()
      return data.shortenedUrl
    } catch (error) {
      console.error('Error creating short link:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const shortLink = await createShortLink(originalUrl, customShortenedUrl)
    setGeneratedLink(shortLink)

    // Clear the input fields after submission
    setOriginalUrl('')
    setcustomShortenedUrl('')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`${base}/${generatedLink}`).then(
      () => {
        console.log('Link copied to clipboard')
      },
      (err) => {
        console.error('Failed to copy link: ', err)
      }
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-md bg-gray-800 shadow-md p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-5 text-center text-purple-400">
          Create a Short Link
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="originalUrl" className="block mb-1 text-gray-200">
              Original URL:
            </label>
            <input
              type="url"
              id="originalUrl"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              required
              className="w-full p-2 border border-gray-700 bg-gray-700 text-white rounded"
            />
          </div>
          <div>
            <label
              htmlFor="customShortenedUrl"
              className="block mb-1 text-gray-200"
            >
              Custom Short Link (optional):
            </label>
            <input
              type="text"
              id="customShortenedUrl"
              value={customShortenedUrl}
              onChange={(e) => setcustomShortenedUrl(e.target.value)}
              className="w-full p-2 border border-gray-700 bg-gray-700 text-white rounded"
            />
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="py-2 px-4 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            >
              Create Link
            </button>
          </div>
        </form>
        {generatedLink && (
          <div className="mt-5 p-4 bg-gray-700 rounded-lg text-center">
            <p className="text-lg text-gray-200 mb-2">
              Generated link:{' '}
              <span className="text-purple-400">
                <a
                  href={generatedLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {`${base}/${generatedLink}`}
                </a>
              </span>
            </p>
            <button
              onClick={handleCopy}
              className="mt-2 py-1 px-3 bg-purple-600 text-white rounded hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
            >
              Copy Link
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default LinkCreationForm
