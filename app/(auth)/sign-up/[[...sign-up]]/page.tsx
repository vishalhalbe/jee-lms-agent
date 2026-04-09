import { SignUp } from "@clerk/nextjs"

export default function SignUpPage() {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-white">Create your account</h1>
        <p className="text-white/50 text-sm">Start your JEE journey today — it&apos;s free</p>
      </div>
      <SignUp
        appearance={{
          variables: {
            colorPrimary: "#f97316",
            colorBackground: "rgba(255,255,255,0.04)",
            colorInputBackground: "rgba(255,255,255,0.06)",
            colorInputText: "#ffffff",
            colorText: "#ffffff",
            colorTextSecondary: "rgba(255,255,255,0.6)",
            borderRadius: "12px",
          },
          elements: {
            card: "glass-elevated shadow-none border-0",
            headerTitle: "hidden",
            headerSubtitle: "hidden",
            socialButtonsBlockButton:
              "glass border-white/10 text-white hover:border-white/20 transition-all",
            formButtonPrimary:
              "bg-orange-500 hover:bg-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.4)]",
            footerActionLink: "text-orange-400 hover:text-orange-300",
          },
        }}
      />
    </div>
  )
}
