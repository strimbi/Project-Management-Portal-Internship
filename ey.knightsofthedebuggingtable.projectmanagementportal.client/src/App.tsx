import { BrowserRouter, Routes, Route } from "react-router";
import { FluentProvider } from "@fluentui/react-components";
import LandingPage from "./pages/LandingPage";
import { appTheme } from "./appTheme";
import ProtectedRoute from "./components/ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProjectsPage from "./pages/Project/ProjectsPage";
import ProjectDetailsPage from "./pages/Project/ProjectDetailsPage";
import ProjectFormPage from "./pages/Project/ProjectFormPage";
import StakeholderFormPage from "./pages/Stakeholder/StakeholderFormPage";
import TemplateFormPage from "./pages/Template/TemplateFormPage";
import TemplatesPage from "./pages/Template/TemplatesPage";
import ResourceFormPage from "./pages/Resource/ResourceFormPage";
import TaskFormPage from "./pages/Tasks/TaskFormPage";
import TaskDetailsPage from "./pages/Tasks/TaskDetailsPage";
import ResourceDetailsPage from "./pages/Resource/ResourceDetailsPage";
import StakeholderDetailsPage from "./pages/Stakeholder/StakeholderDetailsPage";
import ApprovalsPage from "./pages/Approval/ApprovalsPage";
import AdvanceRequestPage from "./pages/AdvanceRequest/AdvanceRequestPage";
import Analytics from "./pages/Analytics/Analytics";

export default function App() {
  return (
    <FluentProvider theme={appTheme}>
      <div className="background">
        <BrowserRouter>
          <Routes>
            <Route index element={<LandingPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route
              path="analytics"
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              }
            />
            <Route
              path="approvals"
              element={
                <ProtectedRoute>
                  <ApprovalsPage />
                </ProtectedRoute>
              }
            ></Route>
            <Route path="templates">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <TemplatesPage />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="create"
                element={
                  <ProtectedRoute>
                    <TemplateFormPage />
                  </ProtectedRoute>
                }
              ></Route>
            </Route>
            <Route path="advance-requests">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <AdvanceRequestPage />
                  </ProtectedRoute>
                }
              ></Route>
            </Route>
            <Route path="projects">
              <Route
                index
                element={
                  <ProtectedRoute>
                    <ProjectsPage />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="create"
                element={
                  <ProtectedRoute>
                    <ProjectFormPage />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path="update/:id"
                element={
                  <ProtectedRoute>
                    <ProjectFormPage />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path=":id"
                element={
                  <ProtectedRoute>
                    <ProjectDetailsPage />
                  </ProtectedRoute>
                }
              ></Route>
              <Route
                path=":projectId/stakeholders/create"
                element={
                  <ProtectedRoute>
                    <StakeholderFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":projectId/stakeholders/:stakeholderId/update"
                element={
                  <ProtectedRoute>
                    <StakeholderFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":projectId/stakeholders/:stakeholderId"
                element={
                  <ProtectedRoute>
                    <StakeholderDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":projectId/resources/create"
                element={
                  <ProtectedRoute>
                    <ResourceFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":projectId/resources/:resourceId/update"
                element={
                  <ProtectedRoute>
                    <ResourceFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":projectId/resources/:resourceId"
                element={
                  <ProtectedRoute>
                    <ResourceDetailsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":projectId/tasks/create"
                element={
                  <ProtectedRoute>
                    <TaskFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":projectId/tasks/:taskId/update"
                element={
                  <ProtectedRoute>
                    <TaskFormPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path=":projectId/tasks/:taskId"
                element={
                  <ProtectedRoute>
                    <TaskDetailsPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </FluentProvider>
  );
}
