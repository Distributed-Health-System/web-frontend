import Image from "next/image"

type DistributedHealthLogoProps = {
  dark?: boolean
}

// Brand lockup with optional dark-mode treatment for gradient backgrounds.
export function DistributedHealthLogo({ dark = false }: DistributedHealthLogoProps) {
  const textColor = dark ? "text-white" : "text-slate-900"
  const iconWrap = dark ? "bg-white/95" : "bg-transparent"

  return (
    <div className="inline-flex items-center gap-2">
      <span
        className={`flex h-7 w-7 items-center justify-center overflow-hidden rounded-full ${iconWrap}`}
        aria-hidden="true"
      >
        <Image
          src="/assets/logo/logo.svg"
          alt=""
          width={30}
          height={30}
          className="h-full w-full object-contain"
          priority
        />
      </span>
      <span className={`text-[22px] font-semibold tracking-[-0.4px] ${textColor}`}>
        Distributed Health
      </span>
    </div>
  )
}
