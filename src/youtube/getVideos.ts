import { google, youtube_v3 } from 'googleapis'

export type Options = {
  auth?: string
}

export default async function getVideos(
  channelID?: string,
  { auth }: Options = {}
): Promise<youtube_v3.Schema$Video[]> {
  if (!channelID) throw new TypeError('Channel ID is required.')
  if (!auth) throw new TypeError('API key is empty.')

  const service = google.youtube('v3')
  const searchList = await service.search.list({
    auth,
    channelId: channelID,
    maxResults: 50,
    order: 'date',
    part: ['id'],
    safeSearch: 'none',
    type: ['video']
  })
  const ids = (searchList.data.items || [])
    .map((item) => item.id?.videoId ?? '')
    .filter(Boolean)

  if (ids.length < 1) return []

  const videos = await service.videos.list({
    auth,
    id: ids,
    maxResults: ids.length,
    part: ['liveStreamingDetails', 'snippet']
  })

  return videos.data.items || []
}
