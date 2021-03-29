import { isAfter } from 'date-fns'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import getStartTime from '../youtube/getStartTime'
import getVideos from '../youtube/getVideos'

const YOUTUBE_CHANNEL_ID = 'UC0Owc36U9lOyi9Gx9Ic-4qg'

const Redirector: NextPage = () => null

type Params = {
  slug: 'recent' | ''
}

export const getStaticProps: GetStaticProps<Params> = async ({ params }) => {
  const slug = Array.isArray(params.slug) ? params.slug.join('/') : params.slug

  if (slug === 'recent') {
    const auth = process.env.GOOGLE_API_KEY
    const videos = await getVideos(YOUTUBE_CHANNEL_ID, auth)

    if (videos.length > 0) {
      const now = new Date()

      const scheduledVideos = videos.filter((video) =>
        isAfter(getStartTime(video), now)
      )

      const video =
        scheduledVideos.length > 0
          ? scheduledVideos.reduce((accumulator, currentValue) =>
              isAfter(getStartTime(accumulator), getStartTime(currentValue))
                ? currentValue
                : accumulator
            )
          : videos.reduce((accumulator, currentValue) =>
              isAfter(getStartTime(accumulator), getStartTime(currentValue))
                ? accumulator
                : currentValue
            )

      if (video.id) {
        return {
          redirect: {
            destination: `https://www.youtube.com/watch?v=${video.id}`,
            permanent: false
          },
          revalidate: 600
        }
      }
    }
  }

  return {
    notFound: true,
    revalidate: 600
  }
}

export const getStaticPaths: GetStaticPaths<Params> = () =>
  Promise.resolve({
    fallback: 'blocking',
    paths: []
  })

export default Redirector
