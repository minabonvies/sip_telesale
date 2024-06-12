type Props = React.SVGProps<SVGSVGElement>

export default function Mute(props: Props) {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M31.5 20.73L34.5 17.73V22.5C34.5 25.2848 33.3938 27.9555 31.4246 29.9246C29.4555 31.8937 26.7848 33 24 33C22.6348 33.0073 21.2824 32.7368 20.025 32.205L22.395 29.835C22.9232 29.9434 23.4608 29.9986 24 30C25.9891 30 27.8968 29.2098 29.3033 27.8033C30.7098 26.3968 31.5 24.4891 31.5 22.5V20.73ZM24 36C21.8297 36.0089 19.6892 35.4943 17.76 34.5L15.555 36.705C17.6766 37.9464 20.0501 38.6948 22.5 38.895V42H18V45H30V42H25.5V39C29.6111 38.6247 33.4322 36.722 36.2092 33.6674C38.9861 30.6128 40.5171 26.6282 40.5 22.5H37.5C37.5 26.0804 36.0777 29.5142 33.5459 32.0459C31.0142 34.5777 27.5804 36 24 36ZM16.5 33.675L14.28 35.835L8.085 42L6 39.915L12 33.915C11.66 33.555 11.33 33.18 11.01 32.79C8.7111 29.855 7.4739 26.228 7.5 22.5H10.5C10.4989 25.4142 11.4408 28.2504 13.185 30.585C13.4849 30.9857 13.8106 31.3665 14.16 31.725L16.275 29.61C15.9279 29.247 15.6118 28.8557 15.33 28.44C14.1345 26.69 13.4966 24.6193 13.5 22.5V13.5C13.509 11.0376 14.383 8.65676 15.9694 6.77351C17.5558 4.89027 19.7536 3.62447 22.1787 3.19736C24.6037 2.77025 27.1017 3.20901 29.2361 4.43694C31.3704 5.66488 33.0053 7.60387 33.855 9.91499C34.0573 10.4506 34.2129 11.0026 34.32 11.565L39.915 5.99999L42 8.08499L34.5 15.585L31.5 18.585L20.82 29.265L18.615 31.5L16.5 33.675ZM18.465 27.48L31.5 14.385V13.5C31.5005 13.1182 31.4704 12.737 31.41 12.36C31.1186 10.4956 30.1351 8.80964 28.6557 7.63827C27.1763 6.46689 25.3097 5.89623 23.4282 6.04008C21.5467 6.18394 19.7886 7.03175 18.5044 8.41442C17.2203 9.79709 16.5046 11.613 16.5 13.5V22.5C16.5016 23.8211 16.8481 25.1188 17.505 26.265C17.7608 26.701 18.0625 27.1083 18.405 27.48H18.465Z"
        fill="currentColor"
      />
    </svg>
  )
}