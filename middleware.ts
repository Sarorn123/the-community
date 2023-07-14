import { Role } from "@prisma/client";
import { JWT } from "next-auth/jwt";
import { NextRequestWithAuth, withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server";

interface TokenWithRole extends JWT {
  role?: string
}

export default withAuth(
  // so this is mean we check  only when logged in 
  function middleware(request: NextRequestWithAuth) {
    const { token }: { token: TokenWithRole | null } = request.nextauth;
    const { pathname } = request.nextUrl;
    if (!token) return;
    // we can access this message with NextParams
    if (pathname.startsWith("/admin") && token.role !== Role.ADMIN) return NextResponse.redirect(new URL("/?message=not authorize", request.url))

  },
  {
    callbacks: {
      // this line mean we only run middleware when have logged in 
      authorized: async ({ token }) => !!token
    },
  },
)

//   this line mean route prefix with admin must be login
export const config = { matcher: ["/admin/:path*"] }