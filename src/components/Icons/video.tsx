type Props = React.SVGProps<SVGSVGElement>

export default function Video(props: Props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g clipPath="url(#clip0_8059_1732)">
        <path
          d="M15 19H2C0.9 19 0 18.1 0 17V7C0 5.9 0.9 5 2 5H15C16.1 5 17 5.9 17 7V17C17 18.1 16.1 19 15 19ZM19 9V15L23.44 17.96C23.9 18.27 24.52 18.14 24.83 17.68C24.94 17.52 25 17.32 25 17.12V6.87C25 6.32 24.55 5.87 24 5.87C23.8 5.87 23.61 5.93 23.44 6.04L19 9Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_8059_1732">
          <rect width="24" height="24" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  )
}
