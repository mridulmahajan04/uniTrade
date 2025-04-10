import { client } from "@/sanity/lib/client"
import { ImageUrlBuilder } from "@sanity/image-url/lib/types/builder";
import { SanityImageSource } from "@sanity/image-url/lib/types/types"
import imageUrlBuilder from "@sanity/image-url"
const builder = imageUrlBuilder(client);

export function imageUrl(source: SanityImageSource) {
    return builder.image(source);
}