import { isAfter } from 'date-fns'
import { youtube_v3 } from 'googleapis'
import getStartTime from './getStartTime'
import getVideos, { Options as GetVideosOptions } from './getVideos'

export type Options = GetVideosOptions & {
  now?: Date
}

export default async function getRecentVideo(
  channelID?: string,
  { now = new Date(), ...options }: Options = {}
): Promise<youtube_v3.Schema$Video> {
  const videos = await getVideos(channelID, options)

  if (videos.length < 1) throw new TypeError('There is no video.')

  const scheduledVideos = videos.filter((video) =>
    isAfter(getStartTime(video), now)
  )
  return scheduledVideos.length > 0
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
}
