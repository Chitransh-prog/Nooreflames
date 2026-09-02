import { groq } from 'next-sanity';

export const productsQuery = groq`
  *[_type == "product"] | order(_createdAt desc) {
    _id,
    title,
    "slug": slug.current,
    subtitle,
    price,
    originalPrice,
    rating,
    reviewsCount,
    badge,
    category,
    image
  }
`;

export const heroSlidesQuery = groq`
  *[_type == "heroSlide"] {
    _id,
    title,
    tagline,
    buttonText,
    buttonLink,
    desktopImage,
    mobileImage
  }
`;

export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    brandName,
    announcementBarText,
    heroHeaderTitle,
    metaDescription
  }
`;

export const videoReelsQuery = groq`
  *[_type == "videoReel"] | order(_createdAt desc) {
    _id,
    title,
    thumbnail,
    videoUrl,
    "videoFileUrl": videoFile.asset->url,
    views,
    productLink
  }
`;

export const promoBannersQuery = groq`
  *[_type == "promoBanner"][0] {
    _id,
    title,
    subtitle,
    buttonText,
    buttonLink,
    backgroundImage
  }
`;

export const whyChooseUsQuery = groq`
  *[_type == "whyChooseUs"][0] {
    _id,
    heading,
    subtitle,
    features
  }
`;

export const testimonialsQuery = groq`
  *[_type == "testimonial"] | order(_createdAt desc) {
    _id,
    authorName,
    authorRole,
    quote,
    rating,
    authorImage,
    videoUrl,
    isVideo
  }
`;

export const pressLogosQuery = groq`
  *[_type == "pressLogo"] | order(order asc) {
    _id,
    name,
    logo
  }
`;
