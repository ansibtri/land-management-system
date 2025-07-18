import { RouterProvider } from "@tanstack/react-router"
import { createRouter } from "@tanstack/react-router"
import * as TanStackQueryProvider from './integrations/tanstack-query/root-provider.tsx'
// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { useAuth } from "./lib/provider/AuthProvider.tsx"

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
// Create a new router instance
const router = createRouter({
  routeTree,
 context: {
    auth: undefined,
    user: undefined,
    ...TanStackQueryProvider.getContext(),
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

const App = () => {

    const {userAuth} = useAuth();
  return (
    
    <>
    <RouterProvider 
            router={router}
            context={{
              auth: {
                isAuthenticated: userAuth?.isAuthenticated,
                authToken: userAuth?.authToken,
              },
              user: userAuth?.user,
            }}
          />
    </>
  )
}

export default App