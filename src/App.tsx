import { useState } from 'react';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { BottomNav } from './components/BottomNav';
import { QuickAdd } from './components/QuickAdd';
import { TodayPage } from './pages/TodayPage';
import { CalendarPage } from './pages/CalendarPage';
import { LearningPage } from './pages/LearningPage';
import { WorkPage } from './pages/WorkPage';
import { MePage } from './pages/MePage';
import { TasksPage } from './pages/TasksPage';
import { CoursesPage } from './pages/CoursesPage';
import { EnglishPage } from './pages/EnglishPage';
import { EnglishLessonPage } from './pages/EnglishLessonPage';
import { EnglishMistakesPage } from './pages/EnglishMistakesPage';
import { VocabularyPage } from './pages/VocabularyPage';
import { CountdownsPage } from './pages/CountdownsPage';
import { RewardsPage } from './pages/RewardsPage';
import { ClientsPage } from './pages/ClientsPage';
import { VideosPage } from './pages/VideosPage';
import { PetsPage } from './pages/PetsPage';
import { FinancePage } from './pages/FinancePage';
import { NotesPage } from './pages/NotesPage';
import { ReviewPage } from './pages/ReviewPage';
import { SearchPage } from './pages/SearchPage';
import { SettingsPage } from './pages/SettingsPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App(){
  const [onboarded,setOnboarded]=useState(()=>localStorage.getItem('life-os-onboarded')==='1');
  if(!onboarded) return <OnboardingPage onDone={()=>setOnboarded(true)}/>;
  return <HashRouter><div className="app-shell"><Routes>
    <Route path="/" element={<TodayPage/>}/><Route path="/calendar" element={<CalendarPage/>}/><Route path="/learning" element={<LearningPage/>}/><Route path="/work" element={<WorkPage/>}/><Route path="/me" element={<MePage/>}/>
    <Route path="/tasks" element={<TasksPage/>}/><Route path="/courses" element={<CoursesPage/>}/><Route path="/english" element={<EnglishPage/>}/><Route path="/english/lesson/:id" element={<EnglishLessonPage/>}/><Route path="/english/mistakes" element={<EnglishMistakesPage/>}/><Route path="/english/vocabulary" element={<VocabularyPage/>}/><Route path="/countdowns" element={<CountdownsPage/>}/><Route path="/rewards" element={<RewardsPage/>}/>
    <Route path="/clients" element={<ClientsPage/>}/><Route path="/videos" element={<VideosPage/>}/><Route path="/pets" element={<PetsPage/>}/><Route path="/finance" element={<FinancePage/>}/><Route path="/notes" element={<NotesPage/>}/><Route path="/review" element={<ReviewPage/>}/><Route path="/search" element={<SearchPage/>}/><Route path="/settings" element={<SettingsPage/>}/><Route path="*" element={<NotFoundPage/>}/>
  </Routes><QuickAdd/><BottomNav/></div></HashRouter>
}
