import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { useAuthStore } from "./store/AuthStore";
import { Loader2 } from "lucide-react";

// Shared Components/Pages
import ScrollToTop from "./components/shared/ScrollToTop";
const Error = lazy(() => import("./pages/shared/Error"));
const Home = lazy(() => import("./pages/shared/Home"));
const Footer = lazy(() => import("./components/shared/Footer"));
const StudentLogin = lazy(() => import("./pages/shared/studentLogin"));
const StaffLogin = lazy(() => import("./pages/shared/StaffLogin"));
const AboutUs = lazy(() => import("./pages/shared/AboutUs"));
const ContactUs = lazy(() => import("./pages/shared/ContactUs"));
const SharedEvents = lazy(() => import("./pages/shared/SharedEvents"));
const ForgotPassword = lazy(() => import("./pages/shared/ForgetPassword"));
// Student Components/Pages
const StudentDashboard = lazy(() => import("./pages/student/StudentDashboard"));
const StudentViewGrades = lazy(() =>
  import("./pages/student/StudentViewGrades")
);
const StudentQuizDetails = lazy(() =>
  import("./pages/student/StudentQuizDetails")
);
const StudentCourseContent = lazy(() =>
  import("./pages/student/StudentCourseContent")
);
const StudentOverviewTab = lazy(() =>
  import("./components/student/tabs/StudentOverviewTab")
);
const StudentAssignmentsTab = lazy(() =>
  import("./components/student/tabs/StudentAssignmentsTab")
);
const StudentUnitDetails = lazy(() =>
  import("./components/student/tabs/StudentUnitDetails")
);
const StudentShowQuizzes = lazy(() =>
  import("./components/student/tabs/StudentShowQuizzes")
);
const StudentReviewQuiz = lazy(() =>
  import("./components/student/tabs/StudentReviewQuiz")
);

// Teacher Components/Pages
const TeacherDashboard = lazy(() => import("./pages/teacher/TeacherDashboard"));
const TeacherCourseContent = lazy(() =>
  import("./pages/teacher/teacherCourseContent")
);
const TeacherOverviewTab = lazy(() =>
  import("./components/teacher/tabs/TeacherOverviewTab")
);
const TeacherUnitContentTab = lazy(() =>
  import("./components/teacher/tabs/TeacherUnitContentTab")
);
const TeacherAssignmentsTab = lazy(() =>
  import("./components/teacher/tabs/TeacherAssignmentsTab")
);
const TeacherCoresStudentab = lazy(() =>
  import("./components/teacher/tabs/TeacherCourseStudentsTab")
);
const TeacherQuizzesTab = lazy(() =>
  import("./components/teacher/tabs/TeacherQuizzesTab")
);
const TeacherAddQuizzes = lazy(() =>
  import("./components/teacher/TeacherAddQuiz")
);
const TeacherTakeAbscene = lazy(() =>
  import("./pages/teacher/TeacherTakeAbscene")
);
const AssignmentDetail = lazy(() =>
  import("./components/teacher/tabs/AssignmentDetail")
);
const QuizSubmitStatus = lazy(() =>
  import("./components/teacher/tabs/QuizSubmitStatus")
);
const QuizReview = lazy(() => import("./components/teacher/quiz/QuizReview"));

// Parent Components/Pages
const ParentDashboard = lazy(() => import("./pages/parent/ParentDashboard"));
const ParentAssignment = lazy(() =>
  import("./components/parent/Tabs/ParentAssignment")
);
const ParentOverview = lazy(() =>
  import("./components/parent/Tabs/ParentOverview")
);
const ParentCourseContent = lazy(() =>
  import("./pages/parent/ParentCourseContent")
);
const ParentUnitDetails = lazy(() =>
  import("./components/parent/Tabs/ParentUnitDetails")
);
const ParentShowQuizzes = lazy(() =>
  import("./components/parent/Tabs/ParentShowQuizzes")
);
const ParentReviewQuiz = lazy(() =>
  import("./components/parent/Tabs/ParentReviewQuiz")
);
const ParentViewGrades = lazy(() => import("./pages/parent/ParentViewGrades"));
const ParentShowReports = lazy(() =>
  import("./pages/parent/ParentShowReports")
);
const ParentShowAbsences = lazy(() =>
  import("./pages/parent/ParentShowAbsences")
);

// Admin Components/Pages
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AddUser = lazy(() => import("./pages/admin/AddUser"));
const DeleteUser = lazy(() => import("./pages/admin/DeleteUser"));
const CourseContent = lazy(() => import("./pages/admin/CourseContent"));
const ResetUserPassword = lazy(() => import("./pages/admin/ResetUserPassword"));
const Settings = lazy(() => import("./pages/admin/Settings"));
const AdminEvents = lazy(() => import("./pages/admin/AdminEvents"));
const AdminShowReports = lazy(() =>
  import("./components/admin/AdminShowReports")
);
const AddCourse = lazy(() => import("./pages/admin/AddCourse"));
const AdminCourseOverview = lazy(() =>
  import("./components/admin/courseThings/AdminCourseOverview")
);
const AdminUnitContent = lazy(() =>
  import("./components/admin/courseThings/AdminUnitContent")
);
const TakeAbsence = lazy(() => import("./pages/admin/TakeAbsence"));

const AdminShowAbsences = lazy(() => import("./pages/admin/AdminShowAbsences"));

function App() {
  const {
    isCheckingAuth,
    authAdmin,
    authTeacher,
    authStudent,
    authParent,
    checkAuth,
  } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const isAuthenticated = authAdmin || authTeacher || authStudent || authParent;

  const getRedirectPath = () => {
    if (authAdmin) return "/admin-dashboard";
    if (authTeacher) return "/teacher-dashboard";
    if (authStudent) return "/student-dashboard";
    if (authParent) return "/parent-dashboard";
    return "/";
  };

  if (isCheckingAuth && !isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin" size={50} />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="animate-spin" size={50} />
        </div>
      }
    >
      <div data-theme="mytheme">
        <ScrollToTop />
        <Routes>
          {/* Shared Routes */}
          <>
            <Route path="*" element={<Error />} />
            <Route
              path="/"
              element={
                !isAuthenticated ? (
                  <Home />
                ) : (
                  <Navigate to={getRedirectPath()} />
                )
              }
            />
            <Route
              path="/about us"
              element={
                !isAuthenticated ? (
                  <AboutUs />
                ) : (
                  <Navigate to={getRedirectPath()} />
                )
              }
            />
            <Route
              path="/contact"
              element={
                !isAuthenticated ? (
                  <ContactUs />
                ) : (
                  <Navigate to={getRedirectPath()} />
                )
              }
            />
            <Route
              path="/studentLogin"
              element={
                !isAuthenticated ? (
                  <StudentLogin />
                ) : (
                  <Navigate to={getRedirectPath()} />
                )
              }
            />
            <Route
              path="/staffLogin"
              element={
                !isAuthenticated ? (
                  <StaffLogin />
                ) : (
                  <Navigate to={getRedirectPath()} />
                )
              }
            />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/events" element={<SharedEvents />} />
          </>

          {/* Student Routes */}
          <>
            <Route
              path="/student-dashboard"
              element={authStudent ? <StudentDashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/student-view-grades"
              element={
                authStudent ? <StudentViewGrades /> : <Navigate to="/" />
              }
            />
            <Route
              path="/Student-Quiz-Details/:course_id/:quiz_id"
              element={
                authStudent ? <StudentQuizDetails /> : <Navigate to="/" />
              }
            />
            <Route
              path="/student/course/:course_id/quizes/:quiz_id/mark"
              element={
                authStudent ? <StudentReviewQuiz /> : <Navigate to="/" />
              }
            />

            <Route
              path="units/:unit_id/content"
              element={<StudentUnitDetails />}
            />
            <Route
              path="/student-course-content/:course_id"
              element={
                authStudent ? <StudentCourseContent /> : <Navigate to="/" />
              }
            >
              <Route
                index
                element={<Navigate replace to="student-overview" />}
              />
              <Route
                path="student-overview"
                element={
                  authStudent ? <StudentOverviewTab /> : <Navigate to="/" />
                }
              />
              <Route
                path="units/:unit_id"
                element={
                  authStudent ? <StudentUnitDetails /> : <Navigate to="/" />
                }
              />
              <Route
                path="student-assignments"
                element={
                  authStudent ? <StudentAssignmentsTab /> : <Navigate to="/" />
                }
              />
              <Route
                path="student-quizzes"
                element={
                  authStudent ? <StudentShowQuizzes /> : <Navigate to="/" />
                }
              />
            </Route>
          </>

          {/* Teacher Routes */}
          <>
            <Route
              path="/teacher-dashboard"
              element={authTeacher ? <TeacherDashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/teacher-course-content/:course_id"
              element={
                authTeacher ? <TeacherCourseContent /> : <Navigate to="/" />
              }
            >
              <Route
                index
                element={<Navigate replace to="teacher-course-students" />}
              />
              <Route
                path="teacher-unit-content/:unit_id"
                element={
                  authTeacher ? <TeacherUnitContentTab /> : <Navigate to="/" />
                }
              />
              <Route
                path="teacher-overview"
                element={
                  authTeacher ? <TeacherOverviewTab /> : <Navigate to="/" />
                }
              />
              <Route
                path="teacher-course-students"
                element={
                  authTeacher ? <TeacherCoresStudentab /> : <Navigate to="/" />
                }
              />

              <Route
                path="teacher-assignments"
                element={
                  authTeacher ? <TeacherAssignmentsTab /> : <Navigate to="/" />
                }
              />
              <Route
                path="/teacher-course-content/:course_id/assignment-detail"
                element={
                  authTeacher ? <AssignmentDetail /> : <Navigate to="/" />
                }
              />

              <Route
                path="teacher-quizzes"
                element={
                  authTeacher ? <TeacherQuizzesTab /> : <Navigate to="/" />
                }
              />
              <Route
                path="quiz-submit-status/:quiz_id"
                element={
                  authTeacher ? <QuizSubmitStatus /> : <Navigate to="/" />
                }
              />
            </Route>

            <Route
              path="/teacher-course-content/:course_id/teacher-quizzes/teacher-add-quiz"
              element={
                authTeacher ? <TeacherAddQuizzes /> : <Navigate to="/" />
              }
            />
            <Route
              path="/course/:course_id/quizes/:quiz_id/review/:student_id"
              element={authTeacher ? <QuizReview /> : <Navigate to="/" />}
            />
            <Route
              path="/teacher-take-absence"
              element={
                authTeacher ? <TeacherTakeAbscene /> : <Navigate to="/" />
              }
            />
          </>

          {/* Parent Routes */}
          <>
            <Route
              path="/parent-dashboard"
              element={authParent ? <ParentDashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/parent-view-grades"
              element={authParent ? <ParentViewGrades /> : <Navigate to="/" />}
            />
            <Route
              path="/parent-show-reports/:student_id"
              element={authParent ? <ParentShowReports /> : <Navigate to="/" />}
            />
            <Route
              path="/parent-show-absences"
              element={
                authParent ? <ParentShowAbsences /> : <Navigate to="/" />
              }
            />
            <Route
              path="/parent-course-content/:course_id/:student_id/"
              element={
                authParent ? <ParentCourseContent /> : <Navigate to="/" />
              }
            >
              <Route
                index
                element={<Navigate to="parent-overview" replace />}
              />
              <Route
                path="parent-overview"
                element={authParent ? <ParentOverview /> : <Navigate to="/" />}
              />
              <Route
                path=":unit_id/content"
                element={
                  authParent ? <ParentUnitDetails /> : <Navigate to="/" />
                }
              />
              <Route
                path="parent-assignments"
                element={
                  authParent ? <ParentAssignment /> : <Navigate to="/" />
                }
              />
              <Route
                path="parent-quizzes"
                element={
                  authParent ? <ParentShowQuizzes /> : <Navigate to="/" />
                }
              />
            </Route>

            <Route
              path="/parent/course/:course_id/:student_id/quizes/:quiz_id/mark"
              element={authParent ? <ParentReviewQuiz /> : <Navigate to="/" />}
            />
          </>

          {/* admin Routes */}
          <>
            <Route
              path="/admin-dashboard"
              element={authAdmin ? <AdminDashboard /> : <Navigate to="/" />}
            />
            <Route
              path="/admin-show-absences/:student_id/:section_id"
              element={authAdmin ? <AdminShowAbsences /> : <Navigate to="/" />}
            />
            <Route
              path="/addition"
              element={authAdmin ? <AddUser /> : <Navigate to="/" />}
            />
            <Route
              path="/deletion"
              element={authAdmin ? <DeleteUser /> : <Navigate to="/" />}
            />
            <Route
              path="/reset-password"
              element={authAdmin ? <ResetUserPassword /> : <Navigate to="/" />}
            />
            <Route
              path="/coursecontent"
              element={authAdmin ? <CourseContent /> : <Navigate to="/" />}
            />

            <Route
              path="/settings"
              element={authAdmin ? <Settings /> : <Navigate to="/" />}
            />
            <Route
              path="/admin-event"
              element={authAdmin ? <AdminEvents /> : <Navigate to="/" />}
            />

            <Route
              path="/addCourse"
              element={authAdmin ? <AddCourse /> : <Navigate to="/" />}
            />
            <Route
              path="/admin-course-overview/:courseId"
              element={
                authAdmin ? <AdminCourseOverview /> : <Navigate to="/" />
              }
            />
            <Route
              path="/admin-unit-content/:courseId"
              element={authAdmin ? <AdminUnitContent /> : <Navigate to="/" />}
            />
            <Route
              path="/takeAbsence"
              element={authAdmin ? <TakeAbsence /> : <Navigate to="/" />}
            />
            <Route
              path="/admin/view-report/:student_id"
              element={authAdmin ? <AdminShowReports /> : <Navigate to="/" />}
            />
          </>
        </Routes>

        {/* Footer */}
        <Footer />
      </div>
    </Suspense>
  );
}

export default App;
