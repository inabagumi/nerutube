import { youtube_v3 } from 'googleapis'

function getStartTime({
  liveStreamingDetails
}: youtube_v3.Schema$Video): Date | undefined {
  if (!liveStreamingDetails) return

  const startTime =
    liveStreamingDetails.actualStartTime ??
    liveStreamingDetails?.scheduledStartTime

  return new Date(startTime)
}

export default getStartTime
