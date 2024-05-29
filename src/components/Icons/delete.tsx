type Props = React.SVGProps<SVGSVGElement>

export default function Delete(props: Props) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M22 3H7C6.31 3 5.765 3.35 5.405 3.88L0 11.995L5.405 20.11C5.765 20.64 6.31 21 7 21H22C23.105 21 24 20.105 24 19V5C24 3.895 23.105 3 22 3ZM19 15.585L17.585 17L14 13.415L10.415 17L9 15.585L12.585 12L9 8.415L10.415 7L14 10.585L17.585 7L19 8.415L15.415 12L19 15.585Z"
        fill="currentColor"
      />
    </svg>
  )
}
