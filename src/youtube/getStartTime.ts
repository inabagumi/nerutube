import { youtube_v3 } from 'googleapis'

export default function getStartTime({
  liveStreamingDetails
}: youtube_v3.Schema$Video): Date {
  if (
    !liveStreamingDetails ||
    !liveStreamingDetails.actualStartTime ||
    !liveStreamingDetails.scheduledStartTime
  ) {
    throw new TypeError('Does not include start time.')
  }

  const startTime =
    liveStreamingDetails.actualStartTime ??
    liveStreamingDetails.scheduledStartTime

  return new Date(startTime)
}
