import { youtube_v3 } from 'googleapis'
import type { GetStaticProps, NextPage } from 'next'
import Error from 'next/error'
import Head from 'next/head'
import { useEffect } from 'react'
import { getRecentVideo } from '../youtube'

type Props = {
  video: youtube_v3.Schema$Video
}

const Recent: NextPage<Props> = ({ video }) => {
  const videoURL = video.id
    ? `https://www.youtube.com/watch?v=${video.id}`
    : video.snippet?.channelId
    ? `https://www.youtube.com/channel/${video.snippet.channelId}`
    : undefined

  useEffect(() => {
    if (!videoURL) return

    const requestID = requestAnimationFrame(() => {
      location.href = videoURL
    })

    return () => {
      cancelAnimationFrame(requestID)
    }
  }, [videoURL])

  if (!videoURL) return <Error statusCode={404} />

  const canonicalURL =
    process.env.NEXT_PUBLIC_BASE_URL &&
    new URL('/recent', process.env.NEXT_PUBLIC_BASE_URL).toString()
  const title = video.snippet?.title ?? videoURL
  const description =
    video.snippet?.description && video.snippet.description.replace(/\n/g, ' ')
  const image =
    video.snippet?.thumbnails?.maxres ?? video.snippet?.thumbnails?.standard

  return (
    <>
      <Head>
        <title>{title}</title>
        <noscript>
          <meta content={`0;URL=${videoURL}`} httpEquiv="refresh" />
        </noscript>
        {canonicalURL && <link href={canonicalURL} rel="canonical" />}
        {description && <meta content={description} name="description" />}
        {description && <meta content="" property="og:description" />}
        {image?.url && <meta content={image.url} property="og:image" />}
        {image?.height && (
          <meta content={image.height.toString()} property="og:image:height" />
        )}
        {image?.width && (
          <meta content={image.width.toString()} property="og:image:width" />
        )}
        <meta content={title} property="og:title" />
        <meta content="article" property="og:type" />
        {canonicalURL && <meta content={canonicalURL} property="og:url" />}
        <meta content="summary_large_image" name="twitter:card" />
      </Head>
    </>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const video = await getRecentVideo(
    process.env.NEXT_PUBLIC_YOUTUBE_CHANNEL_ID,
    {
      auth: process.env.GOOGLE_API_KEY,
      now: new Date()
    }
  )

  return {
    props: {
      video
    },
    revalidate: 600
  }
}

export default Recent
