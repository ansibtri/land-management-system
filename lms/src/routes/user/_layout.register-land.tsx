import LandRegister from '@/components/LandRegister/LandRegister'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/user/_layout/register-land')({
  component: RouteComponent,
})

function RouteComponent() {


  return <div>
    <LandRegister />
  </div>
}
