export function StatusLogo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Dark rounded square background */}
      <rect width="32" height="32" rx="7" fill="#111111" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="6.5" stroke="#262626" />

      {/* Terminal prompt bracket */}
      <path
        d="M7 10L12 16L7 22"
        stroke="#22c55e"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Status code "200" */}
      <text
        x="15"
        y="19.5"
        fontFamily="monospace"
        fontSize="10"
        fontWeight="800"
        fill="#e5e5e5"
        letterSpacing="-0.3"
      >
        200
      </text>

      {/* Small green dot — stable indicator */}
      <circle cx="26" cy="8" r="2.5" fill="#22c55e">
        <animate
          attributeName="opacity"
          values="1;0.4;1"
          dur="2s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  )
}
