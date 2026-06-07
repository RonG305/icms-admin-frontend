import { RegisterForm } from "@/components/Auth/Register/RegisterForm"
import { Image3D } from "@/components/image-3d"

export default function SignUpPage() {
  return (
    <div className="relative min-h-svh flex flex-col items-center justify-center p-6 md:p-10 overflow-hidden">
      {/* Full-page background */}
      <div className="absolute inset-0 -z-10">
        <Image3D
          lightSrc="/dashboard-light.png"
          darkSrc="/dashboard-dark.png"
          alt="Auth background"
          className="h-full w-full aspect-auto rounded-none"
        />
      </div>
      {/* Scrim so the card stays readable */}
      <div className="absolute inset-0 -z-10 bg-background/60 backdrop-blur-sm" />

      <div className="w-full max-w-sm relative z-10">
        <RegisterForm />
      </div>
    </div>
  )
}
