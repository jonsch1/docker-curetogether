"use client"

import * as React from "react"
import { useRouter } from 'next/navigation'
import {
  BookOpen,
  Brain,
  ChevronRight,
  ChevronsUpDown,
  FileText,
  FolderOpen,
  GalleryVerticalEnd,
  Globe,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Microscope,
  MoreHorizontal,
  PenTool,
  Plus,
  Search,
  Settings,
  Users,
  User
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Separator } from "@/components/ui/separator"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import data from "@/data/data.json"
import { useSidebar } from "@/components/ui/sidebar"
import { ThemeItems } from "@/components/theme-toggle"
const Icons = {
  BookOpen,
  Brain,
  ChevronRight,
  ChevronsUpDown,
  FileText,
  FolderOpen,
  GalleryVerticalEnd,
  Globe,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Microscope,
  MoreHorizontal,
  PenTool,
  Plus,
  Search,
  Settings,
  Users,
}

import { signIn, signOut, useSession } from "next-auth/react"

export default function RareDiseasePlatformSidebar({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  // const [activeProject, setActiveProject] = React.useState(data.projects[0])
  const { open, toggleSidebar } = useSidebar()
  const { data: session } = useSession()
  // Helper function to get icon component
  const getIcon = (iconName: string) => {
    const Icon = Icons[iconName as keyof typeof Icons]
    return Icon ? <Icon className="size-4 shrink-0" /> : null
  }

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                      <GalleryVerticalEnd className="size-4" />
                    </div>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        CureTogether
                      </span>
                      <span className="truncate text-xs">
                        Collaborative Research
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  align="start"
                  side="bottom"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Switch Project
                  </DropdownMenuLabel>
                  {data.projects.map((project, index) => (
                    <DropdownMenuItem
                      key={project.name}
                      onClick={() => {
                        // setActiveProject(project)
                        // router.push("/projects/dashboard")
                      }}
                      className="gap-2 p-2"
                    >
                      <div className="flex size-8 items-center justify-center">
                        <img
                          src={`https://avatar.vercel.sh/${project.name}`}
                          alt={project.name}
                          className="size-6 shrink-0"
                        />
                      </div>
                      {project.name}
                      <Badge
                        variant={
                          project.status === "active"
                            ? "default"
                            : project.status === "new"
                            ? "secondary"
                            : "outline"
                        }
                        className="ml-auto"
                      >
                        {project.status}
                      </Badge>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="gap-2 p-2"
                    onClick={() => router.push('/projects/create')}
                  >
                    <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                      <Plus className="size-4" />
                    </div>
                    <div className="font-medium text-muted-foreground">
                      Create New Project
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible
                      asChild
                      defaultOpen={item.isActive}
                      className="group/collapsible"
                    >
                      <div>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton>
                            {getIcon(item.icon)}
                            <span>{item.title}</span>
                            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton 
                                  onClick={() => subItem.url !== "#" && router.push(subItem.url)}
                                  className={subItem.url === "#" ? "pointer-events-none text-muted-foreground" : ""}
                                >
                                  <span>{subItem.title}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton
                      onClick={() => router.push(item.url)}
                    >
                      {getIcon(item.icon)}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup className="group-data-[collapsible=icon]:hidden">
            <SidebarGroupLabel>Quick Actions</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push('/projects/curate')}>
                  <PenTool />
                  <span>Curate Statements</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push('/content?type=discussion')}>
                  <MessageSquare />
                  <span>Join Discussion</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => router.push('/content?type=hypothesis')}>
                  <FileText />
                  <span>Submit Hypothesis</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="text-sidebar-foreground/70">
                  <MoreHorizontal className="text-sidebar-foreground/70" />
                  <span>More Actions</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => toggleSidebar()}>
                <ChevronRight className={`size-4 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                <span>{open ? 'Collapse Sidebar' : ''}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage src={`https://avatar.vercel.sh/${session?.user?.email || 'Guest'}`} alt={session?.user?.name || 'Guest'} />
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {session?.user?.name || 'Guest'}
                      </span>
                      <span className="truncate text-xs">{session?.user?.email || 'Not signed in'}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                    {!open && <SidebarTrigger className="ml-2" />}
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side="bottom"
                  align="end"
                  sideOffset={4}
                >
                  {session ? (
                    <>
                      <DropdownMenuLabel className="p-0 font-normal">
                        <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                          <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage
                              src={`https://avatar.vercel.sh/${session.user?.email || 'Guest'}`}
                              alt={session.user?.name || 'Guest'}
                            />
                            <AvatarFallback className="rounded-lg">
                              {session.user?.name?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                          <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold">
                              {session.user?.name}
                            </span>
                            <span className="truncate text-xs">
                              {session.user?.email}
                            </span>
                          </div>
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => router.push(`/profile/${session.user.id}`)}>
                          <User className="mr-2 h-4 w-4" />
                          <span>View Profile</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/account')} disabled={true}>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Account Settings (soon)</span>
                        </DropdownMenuItem>
                      </DropdownMenuGroup>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => signOut()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <DropdownMenuItem onClick={() => signIn()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign In</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="px-2 py-1.5 text-sm font-medium">Theme</DropdownMenuLabel>
                    <ThemeItems />
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </>
  )
}
