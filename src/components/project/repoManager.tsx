"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, FolderOpen, FolderGit, GitCommit, PlusCircle, ExternalLink, 
  ChevronRight, File, Pencil, FileCode, Settings, User, UserPlus, AlertCircle, CheckCircle
} from "lucide-react";
import DashboardHeader from "../dashboard/dashboardHeader";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { Spinner } from "../ui/spinner";

// import { toast } from "@/components/ui/use-toast";

type FilesType = {
  name: string;
  path: string;
  type: string;
}

type NewFileType = {
  name: string;
  type: string;
}

const mockCommits = [
  {
    hash: "a1b2c3d",
    message: "Update home page design",
    author: "JohnDoe",
    date: "2 hours ago",
  },
  {
    hash: "e4f5g6h",
    message: "Fix contact form styling",
    author: "JohnDoe",
    date: "1 day ago",
  },
  {
    hash: "i7j8k9l",
    message: "Initial commit",
    author: "JohnDoe",
    date: "1 week ago",
  },
];

export default function RepoManager() {
  const query = useSearchParams();
  const repoName = query.get("name") as string;
  const { data: session, status } = useSession();
  const [files, setFiles] = useState<FilesType[]>([]);
  const [temp, setTemp] = useState(repoName);
  const [pageName, setPageName] = useState("");
  const [commitMessage, setCommitMessage] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingRepo, setIsCreatingRepo] = useState(false);
  const [isCommitting, setIsCommitting] = useState(false);
  const [isInviting, setIsInviting] = useState(false);
  const [isSavingRepoName, setIsSavingRepoName] = useState(false);
  const [isCreatingPage, setIsCreatingPage] = useState(false);
  const [isCreatingFile, setIsCreatingFile] = useState(false);
  
  // Form validation
  const [formErrors, setFormErrors] = useState({
    repoName: false,
    commitMessage: false,
    pageName: false,
    fileName: false,
    inviteEmail: false
  });

  // Mock contributors data
  const [contributors, setContributors] = useState([
    { id: 1, name: "You", email: "you@example.com", role: "Owner" },
    {
      id: 2,
      name: "Collaborator",
      email: "collaborator@example.com",
      role: "Contributor",
    },
  ]);
  
  const [isCommitDialogOpen, setIsCommitDialogOpen] = useState(false);
  const [isCreatePageDialogOpen, setIsCreatePageDialogOpen] = useState(false);
  const [isAddFileDialogOpen, setIsAddFileDialogOpen] = useState(false);

  // For Add File
  const [newFile, setNewFile] = useState<NewFileType>({
    name: "newFile",
    type: ".html"
  });

  const fetchRepoFiles = async (owner: string, repo: string, accessToken: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json"
        }
      });

      if (!res.ok) {
        throw new Error("Failed to fetch repository files");
      }

      const files = await res.json();
      const myfiles = files.map((file: any) => {
        const extension = file.name.split('.').pop();
        return {
          name: file.name,
          path: file.path,
          type: extension
        };
      });
      setFiles(myfiles);
    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session?.user?.username && repoName && session?.user?.access_token) {
      fetchRepoFiles(session.user.username, repoName, session.user.access_token);
    } else if (status !== "loading") {
      setIsLoading(false);
    }
  }, [session?.user?.username, repoName, session?.user?.access_token, status]);

  const validateForm = (field: string, value: string) => {
    let isValid = true;
    
    switch(field) {
      case 'repoName':
        isValid = value.trim() !== '';
        setFormErrors(prev => ({ ...prev, repoName: !isValid }));
        break;
      case 'commitMessage':
        isValid = value.trim() !== '';
        setFormErrors(prev => ({ ...prev, commitMessage: !isValid }));
        break;
      case 'pageName':
        isValid = value.trim() !== '';
        setFormErrors(prev => ({ ...prev, pageName: !isValid }));
        break;
      case 'fileName':
        isValid = value.trim() !== '';
        setFormErrors(prev => ({ ...prev, fileName: !isValid }));
        break;
      case 'inviteEmail':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = emailRegex.test(value);
        setFormErrors(prev => ({ ...prev, inviteEmail: !isValid }));
        break;
    }
    
    return isValid;
  };

  const handleSaveRepoName = async () => {
    if (!validateForm('repoName', temp)) return;
    
    setIsSavingRepoName(true);
    try {
      // Here you would implement the actual API call to rename the repository
      // For now, we'll just simulate a successful operation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
     
    } catch (error) {
      
    } finally {
      setIsSavingRepoName(false);
    }
  };

  const handleInviteContributor = async () => {
    if (!validateForm('inviteEmail', inviteEmail)) return;
    
    setIsInviting(true);
    try {
      // Here you would implement the GitHub API call to invite a contributor
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setInviteEmail("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      
     
    } catch (error) {
      
    } finally {
      setIsInviting(false);
    }
  };

  const handleCommit = async () => {
    if (!validateForm('commitMessage', commitMessage)) return;
    
    setIsCommitting(true);
    try {
      // Here you would implement the actual commit functionality
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Committing:", commitMessage);
      setCommitMessage("");
      setIsCommitDialogOpen(false);
      
      
    } catch (error) {
      
    } finally {
      setIsCommitting(false);
    }
  };

  const handleCreatePage = async () => {
    if (!validateForm('pageName', pageName)) return;
    
    setIsCreatingPage(true);
    try {
      // Here you would implement the actual page creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Creating page: ${pageName}`);
      setPageName("");
      setIsCreatePageDialogOpen(false);
      
     
    } catch (error) {
     
    } finally {
      setIsCreatingPage(false);
    }
  };

  const handleCreateFile = async () => {
    if (!validateForm('fileName', newFile.name)) return;
    
    setIsCreatingFile(true);
    try {
      // Here you would implement the actual file creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log("Creating file:", newFile);
      setNewFile({ name: "newFile", type: ".html" });
      setIsAddFileDialogOpen(false);
      
      
    } catch (error) {
      
    } finally {
      setIsCreatingFile(false);
    }
  };

  const createRepo = async (accessToken: any) => {
    if (!validateForm('repoName', temp)) return;
    
    setIsCreatingRepo(true);
    try {
      const res = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: temp,
          description: "Created with 💝 by Buildzy using GitHub OAuth!",
          private: false,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create repository");
      }

      const payload = {
        create_at: data.created_at || new Date().toISOString(),
        description: data.description,
        full_name: data.full_name,
        github_id: data.id,
        name: data.name,
        owner: session?.user?.username || "unknown",
        owner_id: session?.user?.id || "unknown",
      };

      await axios.post('http://localhost:3000/api/project/createrepo', payload);
      
    } catch (error: any) {
      console.error("Error creating repo or saving project:", error.message);
    } finally {
      setIsCreatingRepo(false);
    }
  };

  const showSuccessToast = () => (
    <div className="fixed top-4 right-4 bg-green-50 border border-green-200 text-green-800 rounded-md p-3 flex items-center shadow-md z-50">
      <CheckCircle className="h-4 w-4 mr-2" />
      <span>Operation completed successfully!</span>
    </div>
  );

  if (status === "loading") {
    return (
      <div className="container flex items-center justify-center h-screen">
        <Spinner size="large" />
        <span className="ml-2">Loading your session...</span>
      </div>
    );
  }

  return (
    <div className="container px-4 sm:px-6 md:px-8">
      <DashboardHeader />
      <div className="flex justify-between items-center mb-6"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <FolderOpen className="h-5 w-5" />
              Repository Files
            </CardTitle>
            <CardDescription className="truncate">Files in {repoName}</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[50vh] md:h-[60vh]">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-40">
                  <Spinner size="medium" />
                  <p className="mt-2 text-sm text-muted-foreground">Loading files...</p>
                </div>
              ) : files.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No files found in this repository.</p>
                  <p className="text-sm mt-2">Add your first file to get started!</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {files.map((file) => (
                    <div
                      key={file.name}
                      className="flex items-center justify-between rounded-md p-2 hover:bg-muted cursor-pointer"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        {file.type === "html" ? (
                          <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
                        ) : file.type === "css" ? (
                          <FileCode className="h-4 w-4 text-purple-500 flex-shrink-0" />
                        ) : (
                          <File className="h-4 w-4 text-gray-500 flex-shrink-0" />
                        )}
                        <span className="truncate">{file.name}</span>
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
          <CardFooter>
            <Dialog open={isAddFileDialogOpen} onOpenChange={setIsAddFileDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add File
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New File</DialogTitle>
                  <DialogDescription>Specify the file name and type.</DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">File Name</label>
                    <Input
                      value={newFile.name}
                      onChange={(e) => {
                        setNewFile({ ...newFile, name: e.target.value });
                        validateForm('fileName', e.target.value);
                      }}
                      placeholder="about"
                      className={formErrors.fileName ? "border-red-500" : ""}
                    />
                    {formErrors.fileName && (
                      <p className="text-xs text-red-500 mt-1">File name cannot be empty</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium">File Type</label>
                    <Input
                      value={newFile.type}
                      onChange={(e) => setNewFile({ ...newFile, type: e.target.value })}
                      placeholder=".html"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddFileDialogOpen(false)} disabled={isCreatingFile}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateFile}
                    disabled={isCreatingFile || formErrors.fileName}
                  >
                    {isCreatingFile ? (
                      <>
                        <Spinner size="small" className="mr-2" />
                        Creating...
                      </>
                    ) : (
                      "Create File"
                    )}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <CardTitle className="text-lg md:text-xl">Project Management</CardTitle>
              <div className="flex flex-wrap gap-2">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <FolderGit className="mr-2 h-4 w-4" />
                      <span className="hidden sm:inline">Create Repository</span>
                      <span className="sm:hidden">Create Repo</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create Repository</DialogTitle>
                      <DialogDescription>
                        What should be your new repository name?
                      </DialogDescription>
                    </DialogHeader>
                    <div>
                      <label className="text-sm font-medium">
                        Your repository name
                      </label>
                      <Input
                        value={temp}
                        onChange={(e) => {
                          setTemp(e.target.value);
                          validateForm('repoName', e.target.value);
                        }}
                        placeholder="Your Repo"
                        className={`mt-1 ${formErrors.repoName ? "border-red-500" : ""}`}
                      />
                      {formErrors.repoName && (
                        <p className="text-xs text-red-500 mt-1">Repository name cannot be empty</p>
                      )}
                    </div>
                    <DialogFooter>
                      <Button variant="secondary" disabled={isCreatingRepo}>Cancel</Button>
                      <Button 
                        onClick={() => createRepo(session?.user?.access_token)}
                        disabled={isCreatingRepo || formErrors.repoName}
                      >
                        {isCreatingRepo ? (
                          <>
                            <Spinner size="small" className="mr-2" />
                            Creating...
                          </>
                        ) : (
                          "Create"
                        )}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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
                          This will create services.html and services.css files
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
                    {mockCommits.map((commit) => (
                      <div key={commit.hash} className="border rounded-md p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                          <div className="overflow-hidden">
                            <div className="font-medium flex items-center gap-1 text-sm md:text-base truncate">
                              <GitCommit className="h-4 w-4 flex-shrink-0" />
                              <span className="truncate">{commit.message}</span>
                            </div>
                            <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                              {commit.author} committed {commit.date}
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
                          <code>{commit.hash}</code>
                        </div>
                      </div>
                    ))}
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
      </div>
    </div>
  );
}
