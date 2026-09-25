export function getYouTubeId(url: string | null): string | null {
    if (!url) return null;

    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return (match && match[2].length === 11) ? match[2] : null;
}

export function getYouTubeThumbnail(url: string | null): string {
    const videoId = getYouTubeId(url);
    if (!videoId) return '/assets/images/sermon-placeholder.jpg'; // Fallback image

    // Returns the high quality thumbnail
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}
