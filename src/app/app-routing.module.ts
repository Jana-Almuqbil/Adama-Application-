import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Initial page
  { path: '', redirectTo: 'splash', pathMatch: 'full' },

  // Database pages
  { path: 'splash', loadChildren: () => import('./pages/splash/splash.module').then(m => m.SplashPageModule) },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'signup', loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule) },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)},

  { path: 'select-baby', loadChildren: () => import('./pages/select-baby/select-baby.module').then(m => m.SelectBabyPageModule) },
  { path: 'create-baby', loadChildren: () => import('./pages/create-baby/create-baby.module').then( m => m.CreateBabyPageModule), },
  
  { path: 'terms', loadChildren: () => import('./pages/terms/terms.module').then( m => m.TermsPageModule) },
  { path: 'select-baby', loadChildren: () => import('./pages/select-baby/select-baby.module').then(m => m.SelectBabyPageModule), },
  { path: 'settings', loadChildren: () => import('./pages/settings/settings.module').then( m => m.SettingsPageModule) },
  { path: 'support', loadChildren: () => import('./pages/support/support.module').then(m => m.SupportPageModule)},
  
  { path: 'articles', loadChildren: () => import('./pages/articles/articles.module').then(m => m.ArticlesPageModule) },
  { path: 'notification', loadChildren: () => import('./pages/notification/notification.module').then(m => m.NotificationPageModule) },
  { path: 'profile', loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule) },
  { path: 'verification-status', loadChildren: () => import('./pages/verification-status/verification-status.module').then(m => m.VerificationStatusPageModule) },
  { path: 'history', loadChildren: () => import('./pages/history/history.module').then(m => m.HistoryPageModule) },

  { path: 'questionaire', loadChildren: () => import('./pages/questionaire/questionaire.module').then( m => m.QuestionairePageModule) },
  { path: 'symptoms', loadChildren: () => import('./pages/symptoms/symptoms.module').then( m => m.SymptomsPageModule) },
  { path: 'loading', loadChildren: () => import('./pages/loading/loading.module').then( m => m.LoadingPageModule) },
  
  { path: 'doctor-home', loadChildren: () => import('./pages/Doctor/doctor-home/doctor-home.module').then( m => m.DoctorHomePageModule) },
  { path: 'case-details', loadChildren: () => import('./pages/Doctor/case-details/case-details.module').then( m => m.CaseDetailsPageModule) },
  { path: 'doctor-notification', loadChildren: () => import('./pages/Doctor/doctor-notification/doctor-notification.module').then( m => m.DoctorNotificationPageModule) },
  { path: 'edit-diagnosis', loadChildren: () => import('./pages/Doctor/edit-diagnosis/edit-diagnosis.module').then( m => m.EditDiagnosisPageModule) },
  { path: 'verified-cases', loadChildren: () => import('./pages/Doctor/verified-cases/verified-cases.module').then( m => m.VerifiedCasesPageModule) },

  { path: 'photo', loadChildren: () => import('./pages/photo/photo.module').then( m => m.PhotoPageModule) },
  { path: 'result', loadChildren: () => import('./pages/result/result.module').then( m => m.ResultPageModule) },
  { path: 'change-password', loadChildren: () => import('./pages/change-password/change-password.module').then( m => m.ChangePasswordPageModule) },
  { path: 'update-parent', loadChildren: () => import('./pages/update-parent/update-parent.module').then( m => m.UpdateParentPageModule) },
  { path: 'report-verified-case', loadChildren: () => import('./pages/report-verified-case/report-verified-case.module').then( m => m.ReportVerifiedCasePageModule) },
  { path: 'forget-password', loadChildren: () => import('./pages/forget-password/forget-password.module').then( m => m.ForgetPasswordPageModule) },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
