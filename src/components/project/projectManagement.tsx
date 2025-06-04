'use client'

import {
    GitCommit,
    Settings,
    FolderGit,
    PlusCircle,
    User,
    UserPlus,
    ChevronRight,
    CheckCircle,
    ExternalLink
} from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
}
from "@/components/ui/dialog";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { ScrollArea } from "../ui/scroll-area";
import { CommitType } from "@/app/projects/[projectId]/page";

interface ProjectManagementSectionProps {
    mockCommits: CommitType[];
    repoName: string;
    temp: string;
    isFetching: boolean;
    setTemp: (temp: string) => void;
    pageName: string;
    setPageName: (name: string) => void;
    commitMessage: string;
    setCommitMessage: (message: string) => void;
    inviteEmail: string;
    setInviteEmail: (email: string) => void;
    showSuccess: boolean;
    isCreatingRepo: boolean;
    isCommitting: boolean;
    isInviting: boolean;
    isSavingRepoName: boolean;
    isCreatingPage: boolean;
    formErrors: any;
    validateForm: (field: string, value: string) => boolean;
    handleSaveRepoName: () => void;
    handleInviteContributor: () => void;
    handleCommit: () => void;
    handleCreatePage: () => void;
    isCommitDialogOpen: boolean;
    setIsCommitDialogOpen: (open: boolean) => void;
    isCreatePageDialogOpen: boolean;
    setIsCreatePageDialogOpen: (open: boolean) => void;
    createRepo: (accessToken: any) => void;
    contributors: any[];
}

// const mockCommits = [
//     {
//         hash: "a1b2c3d4",
//         message: "Initial commit with project setup",
//         author: "You",
//         date: "2 days ago",
//     },
//     {
//         hash: "e5f6g7h8",
//         message: "Added homepage content",
//         author: "Collaborator",
//         date: "1 day ago",
//     },
//     {
//         hash: "i9j0k1l2",
//         message: "Fixed styling issues",
//         author: "You",
//         date: "5 hours ago",
//     },
// ];

export default function ProjectManagementSection({
    mockCommits,
    repoName,
    isFetching,
    temp,
    setTemp,
    pageName,
    setPageName,
    commitMessage,
    setCommitMessage,
    inviteEmail,
    setInviteEmail,
    showSuccess,
    isCreatingRepo,
    isCommitting,
    isInviting,
    isSavingRepoName,
    isCreatingPage,
    formErrors,
    validateForm,
    handleSaveRepoName,
    handleInviteContributor,
    handleCommit,
    handleCreatePage,
    isCommitDialogOpen,
    setIsCommitDialogOpen,
    isCreatePageDialogOpen,
    setIsCreatePageDialogOpen,
    createRepo,
    contributors
}: ProjectManagementSectionProps) {
    const { data: session } = useSession();
    console.log(mockCommits)
    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <CardTitle className="text-lg md:text-xl">Project Management</CardTitle>
                    <div className="flex flex-wrap gap-2">
                        <Dialog open={isCommitDialogOpen} onOpenChange={setIsCommitDialogOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <GitCommit className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Commit Changes</span>
                                    <span className="sm:hidden">Commit</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Commit Changes</DialogTitle>
                                    <DialogDescription>Add a message to describe your changes.</DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <label className="text-sm font-medium">Commit Message</label>
                                    <Input
                                        value={commitMessage}
                                        onChange={(e) => {
                                            setCommitMessage(e.target.value);
                                            validateForm('commitMessage', e.target.value);
                                        }}
                                        placeholder="Update website design"
                                        className={`mt-1 ${formErrors.commitMessage ? "border-red-500" : ""}`}
                                    />
                                    {formErrors.commitMessage && (
                                        <p className="text-xs text-red-500 mt-1">Commit message cannot be empty</p>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCommitDialogOpen(false)} disabled={isCommitting}>
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleCommit}
                                        disabled={isCommitting || formErrors.commitMessage}
                                    >
                                        {isCommitting ? (
                                            <>
                                                <Spinner size="small" className="mr-2" />
                                                Committing...
                                            </>
                                        ) : (
                                            "Commit"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                        <Dialog open={isCreatePageDialogOpen} onOpenChange={setIsCreatePageDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="outline">
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    <span className="hidden sm:inline">Create New Page</span>
                                    <span className="sm:hidden">New Page</span>
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle>Create New Page</DialogTitle>
                                    <DialogDescription>Enter a name for your new page. HTML and CSS files will be created.</DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <label className="text-sm font-medium">Page Name</label>
                                    <Input
                                        value={pageName}
                                        onChange={(e) => {
                                            setPageName(e.target.value);
                                            validateForm('pageName', e.target.value);
                                        }}
                                        placeholder="services"
                                        className={`mt-1 ${formErrors.pageName ? "border-red-500" : ""}`}
                                    />
                                    {formErrors.pageName ? (
                                        <p className="text-xs text-red-500 mt-1">Page name cannot be empty</p>
                                    ) : (
                                        <p className="text-xs text-muted-foreground mt-1">
                                            {`This will create ${pageName}.html and ${pageName}.css files`}
                                        </p>
                                    )}
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsCreatePageDialogOpen(false)} disabled={isCreatingPage}>
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleCreatePage}
                                        disabled={isCreatingPage || formErrors.pageName}
                                    >
                                        {isCreatingPage ? (
                                            <>
                                                <Spinner size="small" className="mr-2" />
                                                Creating...
                                            </>
                                        ) : (
                                            "Create & Edit"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="commits">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="commits">
                            <GitCommit className="mr-2 h-4 w-4" />
                            Commit History
                        </TabsTrigger>
                        <TabsTrigger value="settings">
                            <Settings className="mr-2 h-4 w-4" />
                            Settings
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="commits" className="mt-4">
                        <ScrollArea className="h-[45vh] md:h-[55vh]">
                            <div className="space-y-4">
                                {isFetching ? (
                                    <div className="flex flex-col items-center justify-center h-40">
                                        <Spinner size="medium" />
                                        <p className="mt-2 text-sm text-muted-foreground">Loading files...</p>
                                    </div>
                                ) : mockCommits.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <p>No commits found in this repository.</p>
                                        <p className="text-sm mt-2">Add your first commit to get started!</p>
                                    </div>
                                ) : (
                                    mockCommits.map((commit) => (
                                        <div key={commit.sha} className="border rounded-md p-3 sm:p-4">
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                                                <div className="overflow-hidden">
                                                    <div className="font-medium flex items-center gap-1 text-sm md:text-base truncate">
                                                        <GitCommit className="h-4 w-4 flex-shrink-0" />
                                                        <span className="truncate">{commit.commit_message}</span>
                                                    </div>
                                                    <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                                                        {commit.commiter_username} committed {commit.date}
                                                    </div>
                                                </div>
                                                <div className="flex gap-2 self-end sm:self-auto">
                                                    <Button variant="outline" size="sm" className="text-xs">
                                                        View Changes
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-8 w-8 flex-shrink-0"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <div className="mt-2 text-xs sm:text-sm bg-muted p-2 rounded-md overflow-x-auto">
                                                <code>{commit.sha.substring(0, 7)}</code>
                                            </div>
                                        </div>
                                    )))}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="settings" className="mt-4">
                        {showSuccess && (
                            <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-3 mb-4 flex items-center">
                                <CheckCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                                <span>Changes saved successfully!</span>
                            </div>
                        )}
                        <div className="space-y-4">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">
                                        Repository Settings
                                    </CardTitle>
                                    <CardDescription>
                                        Manage your repository configuration
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium">
                                                Repository Name
                                            </label>
                                            <div className="flex flex-col sm:flex-row gap-2 mt-1">
                                                <Input
                                                    value={temp}
                                                    onChange={(e) => {
                                                        setTemp(e.target.value);
                                                        validateForm('repoName', e.target.value);
                                                    }}
                                                    placeholder="my-awesome-website"
                                                    className={formErrors.repoName ? "border-red-500" : ""}
                                                />
                                                <Button
                                                    onClick={handleSaveRepoName}
                                                    disabled={isSavingRepoName || formErrors.repoName}
                                                    className="sm:flex-shrink-0"
                                                >
                                                    {isSavingRepoName ? (
                                                        <>
                                                            <Spinner size="small" className="mr-2" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        "Save"
                                                    )}
                                                </Button>
                                            </div>
                                            {formErrors.repoName && (
                                                <p className="text-xs text-red-500 mt-1">Repository name cannot be empty</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">
                                                Repository Visibility
                                            </label>
                                            <div className="flex gap-2 mt-1">
                                                <Button variant="outline" className="w-full">
                                                    Public
                                                </Button>
                                                <Button variant="outline" className="w-full">
                                                    Private
                                                </Button>
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Changes to repository visibility may require
                                                additional GitHub permissions.
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg">
                                        Contributor Management
                                    </CardTitle>
                                    <CardDescription>
                                        Manage who has access to this repository
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium">
                                                Contributors
                                            </label>
                                            <div className="space-y-2 mt-2">
                                                {contributors.map((contributor) => (
                                                    <div
                                                        key={contributor.id}
                                                        className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-2 border rounded-md"
                                                    >
                                                        <div className="flex items-center gap-2 mb-2 sm:mb-0">
                                                            <User className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                                            <div className="overflow-hidden">
                                                                <div className="font-medium truncate">
                                                                    {contributor.name}
                                                                </div>
                                                                <div className="text-xs text-muted-foreground truncate">
                                                                    {contributor.email}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2 self-end sm:self-auto">
                                                            <span className="text-xs bg-muted px-2 py-1 rounded-full">
                                                                {contributor.role}
                                                            </span>
                                                            {contributor.role !== "Owner" && (
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-6 w-6"
                                                                >
                                                                    <ChevronRight className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-sm font-medium">
                                                Invite Contributor
                                            </label>
                                            <div className="flex gap-2 mt-1">
                                                <Input
                                                    value={inviteEmail}
                                                    onChange={(e) => setInviteEmail(e.target.value)}
                                                    placeholder="email@example.com"
                                                />
                                                <Button onClick={handleInviteContributor}>
                                                    <UserPlus className="mr-2 h-4 w-4" />
                                                    Invite
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}