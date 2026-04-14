export type SiteVideo = {
  id: string;
  title: string;
  description?: string | null;
  video_url: string;
  thumbnail_url?: string | null;
  display_order?: number | null;
  is_active?: boolean | null;
};

export function getVideoSource(url: string) {
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  return 'direct';
}

export function isDirectVideo(url: string) {
  return /\.(mp4|webm|mov|m4v)(\?|$)/i.test(url) || getVideoSource(url) === 'direct';
}

export function getYouTubeThumbnail(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg` : null;
}

export function getInstagramPostId(url: string): string | null {
  const match = url.match(/instagram\.com\/(?:[^\/]+\/)?(?:reel|p)\/([^\/\?]+)/);
  return match ? match[1] : null;
}

export function getInstagramContentType(url: string): 'reel' | 'p' | null {
  const match = url.match(/instagram\.com\/(?:[^\/]+\/)?(reel|p)\//);
  return match ? (match[1] as 'reel' | 'p') : null;
}

export function getInstagramEmbedUrl(url: string): string | null {
  const postId = getInstagramPostId(url);
  const contentType = getInstagramContentType(url) || 'p';
  return postId ? `https://www.instagram.com/${contentType}/${postId}/embed/captioned/` : null;
}

export function getInstagramPermalink(url: string): string | null {
  const postId = getInstagramPostId(url);
  return postId ? `https://www.instagram.com/p/${postId}/` : null;
}

export function getInstagramThumbnail(url: string): string | null {
  const postId = getInstagramPostId(url);
  const contentType = getInstagramContentType(url) || 'p';
  if (!postId) return null;
  return `https://www.instagram.com/${contentType}/${postId}/media/?size=l`;
}

export function getVideoThumbnail(video: SiteVideo) {
  if (video.thumbnail_url) return video.thumbnail_url;
  const source = getVideoSource(video.video_url);
  if (source === 'youtube') return getYouTubeThumbnail(video.video_url);
  if (source === 'instagram') return getInstagramThumbnail(video.video_url) || '/landing_img.jpeg';
  return '/landing_img.jpeg';
}

export function getVideoSourceLabel(url: string) {
  const source = getVideoSource(url);
  if (source === 'instagram') return 'Instagram';
  if (source === 'youtube') return 'YouTube';
  return 'Video';
}

export function getEmbedData(video: SiteVideo) {
  const source = getVideoSource(video.video_url);
  const isInstagram = source === 'instagram';
  const isYouTube = source === 'youtube';
  const isDirect = isDirectVideo(video.video_url);
  
  return {
    source,
    isInstagram,
    isYouTube,
    isDirect,
    instagramEmbedUrl: isInstagram ? getInstagramEmbedUrl(video.video_url) : null,
    instagramPermalink: isInstagram ? getInstagramPermalink(video.video_url) : null,
    instagramPostId: isInstagram ? getInstagramPostId(video.video_url) : null,
    thumbnail: getVideoThumbnail(video),
    sourceLabel: getVideoSourceLabel(video.video_url)
  };
}
