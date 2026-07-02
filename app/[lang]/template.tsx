import PageTransition from "@/components/animation/PageTransition";

// template.tsx remounts on every navigation → drives page-transition anim.
export default function Template({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
