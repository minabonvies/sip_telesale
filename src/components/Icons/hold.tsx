type Props = React.SVGProps<SVGSVGElement>

export default function Hold(props: Props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none" {...props}>
      <path
        d="M12.4733 9.22222C12.6 11.08 12.9167 12.9167 13.4022 14.6689L10.8689 17.2233C10.0244 14.6689 9.47556 12.0089 9.28556 9.22222H12.4733ZM33.2889 34.5767C35.0833 35.0833 36.92 35.4 38.7778 35.5267V38.6933C35.9911 38.5033 33.2889 37.9544 30.7556 37.0889L33.2889 34.5767ZM14.5 5H7.11111C5.95 5 5 5.95 5 7.11111C5 26.9344 21.0656 43 40.8889 43C42.05 43 43 42.05 43 40.8889V33.5C43 32.3389 42.05 31.3889 40.8889 31.3889C38.25 31.3889 35.7167 30.9667 33.3522 30.1856C33.1411 30.1222 32.9089 30.08 32.6978 30.08C32.1489 30.08 31.6211 30.2911 31.1989 30.6922L26.5544 35.3367C20.5589 32.2967 15.6822 27.42 12.6422 21.4244L17.2867 16.7589C17.8567 16.21 18.0678 15.3867 17.8144 14.6478C17.0122 12.22 16.6111 9.66556 16.6111 7.11111C16.6111 5.95 15.6611 5 14.5 5ZM30.3333 5H34.5556V19.7778H30.3333V5ZM38.7778 5H43V19.7778H38.7778V5Z"
        fill="currentColor"
      />
    </svg>
  )
}
