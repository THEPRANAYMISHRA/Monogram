import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './components/home/Home';
import Login from './components/login/Login';
import Signup from './components/Signup/Signup';
import { ProtectedRoute } from './protectedRoutes';
import PageLoading from './components/pageLoading/PageLoading';
import Explore from './components/explore/Explore';
import SideBar from './components/sidebar/SideBar';
import Membership from './components/premium/Membership';
import ViewProfile from './components/viewUser/ViewProfile';
import ViewOthers from './components/viewOtherProfiles/ViewOthers';
import SettingsPage from './components/settings/SettingsPage';


function App() {
  return (
    <main className='d-flex justify-content-start align-items-center vh-100'>
      <Routes>
        <Route path='/' element={<ProtectedRoute><SideBar /><Home /></ProtectedRoute>} />
        <Route path='/explore' element={<ProtectedRoute><SideBar /><Explore /></ProtectedRoute>} />
        <Route path='/membership' element={<ProtectedRoute><SideBar /><Membership /></ProtectedRoute>} />
        <Route path='/profile' element={<ProtectedRoute><SideBar /><ViewProfile /></ProtectedRoute>} />
        <Route path='/search' element={<ProtectedRoute><SideBar /><ViewOthers /></ProtectedRoute>} />
        <Route path='/settings' element={<ProtectedRoute><SideBar /><SettingsPage /></ProtectedRoute>} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/loading' element={<PageLoading />} />
      </Routes>
    </main>
  );
}

export default App;
