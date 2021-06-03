module.exports = {
  i18n: {
    defaultLocale: 'ja',
    locales: ['ja']
  },
  async redirects() {
    return [
      {
        destination: `https://www.youtube.com/channel/${process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID}`,
        permanent: false,
        source: '/'
      }
    ]
  }
}
