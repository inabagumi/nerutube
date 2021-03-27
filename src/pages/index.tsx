import { isAfter } from 'date-fns'
import { google, youtube_v3 } from 'googleapis'
import type { GetStaticProps, NextPage } from 'next'

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

const Home: NextPage = () => null

export default Home

export const getStaticProps: GetStaticProps = async () => {
  const auth = process.env.GOOGLE_API_KEY
  const service = google.youtube('v3')
  const searchList = await service.search.list({
    auth,
    channelId: YOUTUBE_CHANNEL_ID,
    maxResults: 50,
    order: 'date',
    part: ['id'],
    safeSearch: 'none',
    type: ['video']
  })
  const ids = searchList.data.items?.map((item) => item.id.videoId)

  if (ids.length < 1) {
    return {
      notFound: true,
      revalidate: 600
    }
  }

  if (ids.length > 0) {
    const videos = await service.videos.list({
      auth,
      id: ids,
      maxResults: ids.length,
      part: ['contentDetails', 'liveStreamingDetails', 'snippet']
    })
    const now = new Date()
    const video = videos.data.items?.reduce((accumulator, currentValue) => {
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

    if (video?.id) {
      return {
        redirect: {
          destination: `https://www.youtube.com/watch?v=${video.id}`,
          permanent: false
        },
        revalidate: 600
      }
    }
  }

  return {
    notFound: true,
    revalidate: 600
  }
}
