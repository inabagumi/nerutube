import { isAfter } from 'date-fns'
import { youtube_v3 } from 'googleapis'
import type { GetStaticPaths, GetStaticProps, NextPage } from 'next'
import getVideos from '../youtube/getVideos'

const YOUTUBE_CHANNEL_ID = 'UC0Owc36U9lOyi9Gx9Ic-4qg'

function getStartTime({
  liveStreamingDetails
}: youtube_v3.Schema$Video): Date | undefined {
  if (!liveStreamingDetails) return

  const startTime =
    liveStreamingDetails.actualStartTime ??
    liveStreamingDetails?.scheduledStartTime

  return new Date(startTime)
}

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
      const video = videos.reduce((accumulator, currentValue) => {
        const accumulatorStartTime = getStartTime(accumulator)
        const currentValueStartTime = getStartTime(currentValue)

        return isAfter(accumulatorStartTime, now) &&
          isAfter(currentValueStartTime, now)
          ? isAfter(currentValueStartTime, accumulatorStartTime)
            ? accumulator
            : currentValue
          : isAfter(accumulatorStartTime, currentValueStartTime)
          ? accumulator
          : currentValue
      })

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
