import ProtectedRoute from '@/router/protectedLayout';
import Admmin403 from '@/pages/Admin403';
import Overview from '@/pages/dashboard/overview';
import LoginPage from '@/pages/login';
import RegisterPage from '@/pages/register';
import { Navigate, createBrowserRouter } from 'react-router-dom';
import GuestLayout from './guestLayout';
import { redRoutes } from '@/middleware/red-routes';

// const DefaultRouter = () => {
//     return (
//         <BrowserRouter>
//             <Routes>
//                 {/* Halaman Publik */}

//                 <Route element={<GuestLayout />}>
//                     <Route path="login" element={<LoginPage />} />
//                     <Route path="register" element={<RegisterPage />} />
//                     <Route index element={<Navigate to="/login" />} />
//                 </Route>

//                 <Route path='app' element={<ProtectedRoute />}>
//                     <Route path="dashboard">
//                         <Route index element={<Navigate to="/app/dashboard/overview" />} />
//                         <Route path="overview" element={<Overview />} />
//                     </Route>
//                     <Route index element={<Navigate to="/app/dashboard/overview" />} />
//                     <Route path="*" element={<Navigate to="/app/dashboard/overview" />} />

//                 </Route>
//                 <Route path="403" element={<Admmin403 />} />
//                 <Route path="*" element={<h1 className="text-3xl text-center mt-20">404 Not Found</h1>} />
//             </Routes>
//         </BrowserRouter>
//     );
// };

// export default DefaultRouter;

export let DefaultRouter = createBrowserRouter([
    {
        path: '/',
        element: <GuestLayout />,
        children: [
            {
                path: 'login',
                element: <LoginPage />
            },
            {
                path: 'register',
                element: <RegisterPage />
            },
            {
                path: '*',
                element: <Navigate to="/login" />
            }
        ]
    },
    {
        path: 'app',
        element: <ProtectedRoute />,
        middleware: [redRoutes],
        children: [
            {
                index: true,
                element: <Navigate to="/app/dashboard/overview" />
            },
            {
                path: 'dashboard',
                children: [
                    {
                        index: true,
                        element: <Navigate to="/app/dashboard/overview" />
                    },
                    {
                        path: 'overview',
                        element: <Overview />
                    }
                ]
            },

            {
                path: '*',
                element: <Navigate to="/app/dashboard/overview" />
            }
        ]
    },
    {
        path: '403',
        element: <Admmin403 />
    },
    {
        path: '*',
        element: <h1 className="text-3xl text-center mt-20">404 Not Found</h1>
    }
])