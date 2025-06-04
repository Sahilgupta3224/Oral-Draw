'use client'
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import FilesSection from '@/components/project/fileSection';
import ProjectManagementSection from '@/components/project/projectManagement';
import DashboardHeader from '@/components/dashboard/dashboardHeader';
import { Spinner } from '@/components/ui/spinner';
interface FilesType {
  name: string;
  path: string;
  type: string;
  sha: string;
  download_url: string;
  content?: string;
  isNew?: boolean;
  hasChanged?: boolean;
}
export interface CommitType {
  date: string;
  commiter_username: string;
  commit_message: string;
  sha: string;
}
interface NewFileType {
  name: string;
  type: string;
}

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
  const [mockCommits, setMockCommits] = useState<CommitType[]>([]);
  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);
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
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          Accept: "application/vnd.github+json"
        }
      });

      // if (!res.ok) {
      //   throw new Error("Failed to fetch repository files");
      // }
      const files = await res.json();
      const myfiles = files.map((file: any) => {
        const extension = file.name.split('.').pop();
        return {
          name: file.name,
          path: file.path,
          type: extension,
          sha: file.sha,
          download_url: file.download_url
        };
      });
      setFiles(myfiles);
      console.log(myfiles);

    } catch (error) {
      console.error("Error fetching files:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const fetchCommit = async (
    owner: string,
    repo: string,
    accessToken: string
  ) => {
    setIsFetching(true);
    try {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/commits?sha=${'main'}&per_page=3`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/vnd.github+json",
          },
        }
      );

      if (!res.ok) {
        throw new Error(`GitHub API error: ${res.status}`);
      }

      const commits = await res.json();
      const myCommits = commits.map((commit: any) => {
        return {
          date: commit.commit.author.date,
          commiter_username: commit.commit.author.name,
          commit_message: commit.commit.message,
          sha: commit.sha
        }
      })
      setMockCommits(myCommits)
      console.log(myCommits)
    } catch (error) {
      console.error("Error fetching latest commit:", error);
    } finally {
      setIsFetching(false);
    }
  };


  useEffect(() => {
    if (session?.user?.username && repoName && session?.user?.access_token) {
      fetchRepoFiles(session.user.username, repoName, session.user.access_token);
      fetchCommit(session.user.username, repoName, session.user.access_token);
    } else if (status !== "loading") {
      setIsLoading(false);
      setIsFetching(false)
    }
  }, [session?.user?.username, repoName, session?.user?.access_token, status]);

  const validateForm = (field: string, value: string) => {
    let isValid = true;

    switch (field) {
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

      const ress = await axios.post('http://localhost:3000/api/project/createrepo', payload);
      console.log(ress)
    } catch (error: any) {
      console.error("Error creating repo or saving project:", error.message);
    } finally {
      setIsCreatingRepo(false);
    }
  };
  const handleSaveRepoName = async () => {
    if (!validateForm('repoName', temp)) return;

    setIsSavingRepoName(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSavingRepoName(false);
    }
  };

  const handleInviteContributor = async () => {
    if (!validateForm('inviteEmail', inviteEmail)) return;

    setIsInviting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInviteEmail("");
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error(error);
    } finally {
      setIsInviting(false);
    }
  };

  const handleCommit = async () => {
    setIsCommitting(true);
    try {

      setCommitMessage("");
      setIsCommitDialogOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCommitting(false);
    }
  };

  const handleCreatePage = async () => {
    if (!validateForm('pageName', pageName)) return;
    setIsCreatingPage(true);
    const htmlContent = `<!DOCTYPE html>
                      <html lang="en">
                      <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${pageName}</title>
                      </head>
                      <body>
                        <!-- Your content here -->
                      </body>
                      </html>`;
    const cssContent = `/* ${pageName} styles */`;
    try {
      await createFileInRepo(
        session?.user?.access_token,
        session?.user?.username,
        repoName,
        `${pageName}${'.html'}`,
        htmlContent,
        `Add ${pageName}${'.html'}`
      );
      await createFileInRepo(
        session?.user?.access_token,
        session?.user?.username,
        repoName,
        `${pageName}${'.css'}`,
        cssContent,
        `Add ${pageName}${'.css'}`
      );
      setPageName("");
      setIsCreatePageDialogOpen(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreatingPage(false);
    }
  };
  const createFileInRepo = async (access_token: any, username: any, repoName: string, filePath: string, content: string, message: string) => {
    // console.log({ access_token, username, repoName, filePath, content, message })
    try {
      const response = await fetch(`https://api.github.com/repos/${username}/${repoName}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${access_token}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          content: btoa(content),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create file');
      }
      // const res  = await response.json();
    } catch (error) {
      console.error('Error creating file:', error);
      throw error;
    }
  }
  const handleCreateFile = async () => {
    if (!validateForm('fileName', newFile.name)) return;
    setIsCreatingFile(true);
    let fileContent = '';
    if (newFile.type === '.html') {
      fileContent = `<!DOCTYPE html>
                      <html lang="en">
                      <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>${newFile.name}</title>
                      </head>
                      <body>
                        <!-- Your content here -->
                      </body>
                      </html>`;
    } else if (newFile.type === '.css') {
      fileContent = `/* ${newFile.name} styles */`;
    } else {
      fileContent = `// ${newFile.name}`;
    }
    try {
      await createFileInRepo(
        session?.user?.access_token,
        session?.user?.username,
        repoName,
        `${newFile.name}${newFile.type}`,
        fileContent,
        `Add ${newFile.name}${newFile.type}`
      );

      if (session?.user?.username && repoName && session?.user?.access_token) {
        fetchRepoFiles(session.user.username, repoName, session.user.access_token);
      }
      setIsAddFileDialogOpen(false)
      setNewFile({ name: 'New File', type: '.html' })
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreatingFile(false);
    }
  }
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
      {showSuccess}
      <div className="flex justify-between items-center mb-6"></div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <FilesSection
          repoName={repoName}
          files={files}
          isLoading={isLoading}
          isAddFileDialogOpen={isAddFileDialogOpen}
          setIsAddFileDialogOpen={setIsAddFileDialogOpen}
          newFile={newFile}
          setNewFile={setNewFile}
          formErrors={formErrors}
          validateForm={validateForm}
          handleCreateFile={handleCreateFile}
          isCreatingFile={isCreatingFile}
        />

        <ProjectManagementSection
          repoName={repoName}
          mockCommits = {mockCommits}
          isFetching={isFetching}
          temp={temp}
          setTemp={setTemp}
          pageName={pageName}
          setPageName={setPageName}
          commitMessage={commitMessage}
          setCommitMessage={setCommitMessage}
          inviteEmail={inviteEmail}
          setInviteEmail={setInviteEmail}
          showSuccess={showSuccess}
          isCreatingRepo={isCreatingRepo}
          isCommitting={isCommitting}
          isInviting={isInviting}
          isSavingRepoName={isSavingRepoName}
          isCreatingPage={isCreatingPage}
          formErrors={formErrors}
          validateForm={validateForm}
          handleSaveRepoName={handleSaveRepoName}
          handleInviteContributor={handleInviteContributor}
          handleCommit={handleCommit}
          handleCreatePage={handleCreatePage}
          isCommitDialogOpen={isCommitDialogOpen}
          setIsCommitDialogOpen={setIsCommitDialogOpen}
          isCreatePageDialogOpen={isCreatePageDialogOpen}
          setIsCreatePageDialogOpen={setIsCreatePageDialogOpen}
          createRepo={createRepo}
          contributors={contributors}
        />
      </div>
    </div>
  );
}