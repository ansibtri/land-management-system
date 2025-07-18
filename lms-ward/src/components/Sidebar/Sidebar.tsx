import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '../ui/sidebar';
import { User2 } from 'lucide-react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { redirect, useNavigate } from '@tanstack/react-router';
import {
    Collapsible,
    CollapsibleTrigger,
    CollapsibleContent
} from '@radix-ui/react-collapsible';
import { logout } from '@/lib/axios/auth';
import { useMutation } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';

const sidebarNavist = [
     {
        title: "User Management",
        url: "/user-management",
    },
    {
        title: "Land Records",
        url: "/land-records",
    },
    {
        title: "Recommendation",
        url: "/recommendation",
    }
];

const SidebarNavigation = () => {
    const navigate = useNavigate();

    const { mutate } = useMutation({
        mutationFn: () => {return logout()},
        onSuccess: (value) => {
            console.log(value)
            window.location.href="/"
        },
        onError: (error) => {
            console.error("Logout failed:", error);
        }
    })
    return (
        <div>
            <Sidebar>
                <SidebarHeader>
                    <h1 className="text-2xl font-bold">Ward-LMS</h1>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarGroup>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {sidebarNavist.map((item, index) => (
                                    <SidebarMenuItem key={index}>

                                        {item.children && item.children.length > 0 ? (
                                            <Collapsible>
                                                <CollapsibleTrigger asChild>
                                                    <SidebarMenuButton>
                                                        {item.title}
                                                        <ChevronDown className="ml-auto" />
                                                    </SidebarMenuButton>
                                                </CollapsibleTrigger>
                                                <CollapsibleContent>
                                                    <SidebarMenu>
                                                        {item.children.map((child, childIndex) => (
                                                            <SidebarMenuItem key={childIndex}>
                                                                <SidebarMenuButton onClick={() => navigate({ to: `/admin/transactions/${child.url}` })}>
                                                                    <p className="pl-3">{child.title}</p>
                                                                </SidebarMenuButton>
                                                            </SidebarMenuItem>
                                                        ))}
                                                    </SidebarMenu>
                                                </CollapsibleContent>
                                            </Collapsible>
                                        ) : (
                                            <Link to={`/admin/${item.url}`}>
                                                <SidebarMenuButton onClick={() => navigate({ to: `/admin/${item.url}` })}>
                                                {item.title}
                                            </SidebarMenuButton>
                                            </Link>
                                        )}
                                    </SidebarMenuItem>
                                ))}
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <SidebarMenuButton>
                                        <User2 /> Username
                                        <ChevronUp className="ml-auto" />
                                    </SidebarMenuButton>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    side="top"
                                    className="w-[--radix-popper-anchor-width]"
                                >
                                    <DropdownMenuItem>
                                        <span>Account</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <span>Billing</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <SidebarMenuButton onClick={() => mutate()}>
                                            <span>Sign out</span>
                                        </SidebarMenuButton>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
        </div>
    )
}

export default SidebarNavigation