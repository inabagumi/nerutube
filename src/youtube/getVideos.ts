import { google, youtube_v3 } from 'googleapis'

async function getVideos(
  id: string,
  auth: string
): Promise<youtube_v3.Schema$Video[]> {
  const service = google.youtube('v3')
  const searchList = await service.search.list({
    auth,
    channelId: id,
    maxResults: 50,
    order: 'date',
    part: ['id'],
    safeSearch: 'none',
    type: ['video']
  })
  const ids = searchList.data.items?.map((item) => item.id.videoId)

  if (ids.length < 1) return []

  const videos = await service.videos.list({
    auth,
    id: ids,
    maxResults: ids.length,
    part: ['liveStreamingDetails']
  })

  return videos.data.items || []
}

export default getVideos
