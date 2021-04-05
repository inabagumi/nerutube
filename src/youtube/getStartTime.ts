import { youtube_v3 } from 'googleapis'

export default function getStartTime({
  liveStreamingDetails
}: youtube_v3.Schema$Video): Date {
  const startTime =
    liveStreamingDetails?.actualStartTime ??
    liveStreamingDetails?.scheduledStartTime

  if (!startTime) {
    throw new TypeError('Does not include start time.')
  }

  return new Date(startTime)
}
