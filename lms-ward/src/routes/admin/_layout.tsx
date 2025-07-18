import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import Sidebar from "../../components/Sidebar/Sidebar"
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { validateAuth } from '@/lib/axios/auth'
export const Route = createFileRoute('/admin/_layout')({
  beforeLoad: async ({ context }) => {
    console.log("Before Load Route: /user/_layout");
    console.log("Context: ", context);
    if (!context.auth) {
      context.auth = {
        isAuthenticated: false,
        authToken: undefined,
      };
      context.user = undefined;
    }
    // check if the user is already authenticated
    if (!context?.auth?.isAuthenticated) {
      // redirect to /home if not authenticated
      throw redirect({
        to: "/",
      });
    }

    // Call ValidateAuth only if ths user is not authenticated
    const verifyAuthToken = await validateAuth();

    // update the context or handle authenticatio logic based on the result
    if (verifyAuthToken?.isAuthenticated) {
      context.auth.isAuthenticated = verifyAuthToken?.isAuthenticated;
      context.auth.authToken = verifyAuthToken?.authToken;
      context.user = verifyAuthToken?.user;

    } else {
      context.auth = {
        isAuthenticated: false,
        authToken: null,
      };
      context.user = null;
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return (<div>
    <SidebarProvider>
      <Sidebar />
      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
    </SidebarProvider>
  </div>)
}
