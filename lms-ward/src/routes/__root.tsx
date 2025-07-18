import { Outlet, createRootRouteWithContext, redirect } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import TanStackQueryLayout from '../integrations/tanstack-query/layout.tsx'

import type { QueryClient } from '@tanstack/react-query'
import {ToastContainer} from "react-toastify";

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  
  component: () => (
    <>
      <Outlet />
      <ToastContainer/>
      <TanStackRouterDevtools />
      <TanStackQueryLayout />
    </>
  ),
})
