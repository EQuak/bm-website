interface LogoProps {
  height?: string | number
  width?: string | number
}

export const ItemImagePlaceHolderLogo = ({
  width = 48,
  height = 48
}: LogoProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={width}
    height={height}
    viewBox={`0 0 ${width} ${height}`}
    fill="none"
  >
    <rect
      x="42"
      y="6"
      width="36"
      height="36"
      rx="0.5"
      transform="rotate(90 42 6)"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 28L13.6464 20.3536C13.8417 20.1583 14.1583 20.1583 14.3536 20.3536L36 42"
      stroke="black"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M27 20C29.7614 20 32 17.7614 32 15C32 12.2386 29.7614 10 27 10C24.2386 10 22 12.2386 22 15C22 17.7614 24.2386 20 27 20Z"
      stroke="black"
      strokeWidth="1.5"
    />
    <path d="M27 33L42 18" stroke="black" strokeWidth="1.5" />
  </svg>
)
export default ItemImagePlaceHolderLogo
