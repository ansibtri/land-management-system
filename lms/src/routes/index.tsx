import { createFileRoute } from '@tanstack/react-router'
import Login from '@/components/Login/Login'

import { redirect } from '@tanstack/react-router'
import { validateAuth } from '@/lib/axios/auth'
export const Route = createFileRoute('/')({
  beforeLoad: async ({ context }) => {
    if (!context.auth) {
      context.auth = {
        isAuthenticated: false,
        authToken: undefined,
      };
      context.user = undefined;
    }
    // check if the user is already authenticated
    if (context?.auth?.isAuthenticated && context?.auth?.authToken) {
      // redirect to /user/dashboard if already authenticated
      throw redirect({
        to: "/user/mylands",
      });
    }

    // Call ValidateAuth only if ths user is not authenticated
    const verifyAuthToken = await validateAuth();

    // update the context or handle authenticatio logic based on the result
    if (verifyAuthToken?.isAuthenticated) {
      context.auth.isAuthenticated = verifyAuthToken?.isAuthenticated;
      context.auth.authToken = verifyAuthToken?.authToken;
      context.user = verifyAuthToken?.user;

      throw redirect({
        to: "/user/mylands",
      });
    } else {
      context.auth = {
        isAuthenticated: false,
        authToken: null,
      };
      context.user = null;
    }
  },
  component: App,
})

function App() {

  return (
    <div>
      <Login/>
      
    </div>
  )
}
